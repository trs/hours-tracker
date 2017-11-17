'use strict';

/* eslint no-duplicate-imports: "off" */
/* eslint import/no-duplicates: "off" */

import * as electron from 'electron';
import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron';
import * as Rx from 'rxjs';
import * as path from 'path';

import * as timer from './timer';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let window;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function getCurrentDisplay () {
  const cursorPoint = electron.screen.getCursorScreenPoint();
  return electron.screen.getDisplayNearestPoint(cursorPoint);
}

function isBoundInScreen (display, bounds) {
  const boundDisplay = electron.screen.getDisplayMatching(bounds);
  return display.id === boundDisplay.id;
}

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

  const tray = new Tray(icon);
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

  function updateCurrentTimeTitle() {
    const time = timer.getCurrentTime();
    const formattedTime = timer.formatMs(time);

    tray.setTitle(formattedTime);
  }

  updateCurrentTimeTitle();

  Rx.Observable.fromEvent(ipcMain, 'renderer:timer:start')
    .do(() => timer.startTimer())
    .mergeMap(event => {
      return Rx.Observable.timer(0, 1000)
        .takeUntil(Rx.Observable.fromEvent(ipcMain, 'renderer:timer:stop'))
        .map(() => event);
    })
    .do(() => timer.updateCurrentTimeTitle)
    .subscribe(formattedTime => {
      updateCurrentTimeTitle();

      window.webContents.send('main:timer:set', formattedTime);
    });

  Rx.Observable.fromEvent(ipcMain, 'renderer:timer:stop')
    .subscribe(function () {
      timer.stopTimer();
    });

  Rx.Observable.fromEvent(tray, 'click')
    .skipUntil(Rx.Observable.fromEvent(window, 'ready-to-show'))
    .subscribe(function () {
      const windowBounds = window.getBounds();
      const display = getCurrentDisplay();
      const sameDisplay = isBoundInScreen(display, windowBounds);

      if (sameDisplay && window.isVisible() && window.isFocused()) {
        window.hide();
      } else {
        const trayBounds = tray.getBounds();

        const windowX = Math.max(0,
          trayBounds.x - Math.floor(windowBounds.width / 2) + Math.floor(trayBounds.width / 2));
        const windowY = display.workArea.y;

        window.hide();
        window.setPosition(windowX, windowY);
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
    });
}

Rx.Observable.fromEvent(app, 'ready')
  .mergeMap(() => timer.loadToday())
  .subscribe(() => initialize());

Rx.Observable.fromEvent(app, 'quit')
  .do(() => timer.stopTimer())
  .mergeMap(() => timer.saveToday())
  .subscribe();

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
