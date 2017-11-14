'use strict';

import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import * as Rx from 'rxjs';
import * as path from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let window;
let tray;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function initialize () {
  /**
   * Initial window options
   */
  window = new BrowserWindow({
    width: 160,
    height: 160,
    show: false,
    resizable: false,
    movable: false,
    frame: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    backgroundColor: '#ffffff'
  });
  window.setAlwaysOnTop(true);
  window.loadURL(winURL);
  window.on('closed', () => {
    window = null;
  });

  const iconURL = path.join(__static, '/clockTemplate.png');
  const icon = nativeImage.createFromPath(iconURL);
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  // tray.setTitle('Hours');

  const menu = Menu.buildFromTemplate([
    {
      label: 'Settings'
    },
    {type: 'separator'},
    {
      label: 'Quit',
      role: 'quit'
    }
  ]);

  Rx.Observable.fromEvent(tray, 'click')
    .skipUntil(Rx.Observable.fromEvent(window, 'ready-to-show'))
    .subscribe(function () {
      if (window.isVisible() && window.isFocused()) {
        window.hide();
      } else {
        const trayBounds = tray.getBounds();
        const windowBounds = window.getBounds();

        const windowX = Math.max(0,
          trayBounds.x - Math.floor(windowBounds.width / 2) + Math.floor(trayBounds.width / 2));
        const windowY = trayBounds.y;

        window.setPosition(windowX, windowY);
        window.hide();
        window.show();
      }
    });

  Rx.Observable.fromEvent(tray, 'right-click')
    .subscribe(function () {
      tray.popUpContextMenu(menu);
    });

  Rx.Observable.fromEvent(window, 'blur')
    .subscribe(function () {
      window.hide();
    })
}

Rx.Observable.fromEvent(app, 'ready')
  .subscribe(initialize);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (window === null) {
//     createWindow()
//   }
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
