const Rx = require('rxjs');
const storage = require('electron-json-storage');

const TIMER = {
  total: 0,
  start: null
};

function today() {
  return new Date().toDateString();
}

function now () {
  return new Date().valueOf();
}

function loadToday() {
  return loadDay(today());
}

function loadDay(day) {
  storage.remove(day);
  const get = Rx.Observable.bindCallback(storage.get);
  return get(day)
    .do(([, time]) => {
      if (time.total) {
        TIMER.total = time.total;
      }
    });
}

function saveToday() {
  return saveDay(today(), TIMER);
}

function saveDay(day, value) {
  const set = Rx.Observable.bindCallback(storage.set);
  return set(day, value);
}

function startTimer () {
  TIMER.start = now();
}

function stopTimer () {
  if (!TIMER.start) return;

  TIMER.total = TIMER.total + now() - TIMER.start;
  TIMER.start = null;
}

function getCurrentTime () {
  const current = TIMER.start ? now() - TIMER.start : 0;
  return TIMER.total + current;
}

function formatMs (milliseconds, includeSeconds = true) {
  milliseconds = Math.floor(milliseconds / 1000);
  let hours = Math.floor(milliseconds / 3600);
  let minutes = Math.floor((milliseconds - (hours * 3600)) / 60);
  let seconds = milliseconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  return `${hours}:${minutes}${includeSeconds ? `:${seconds}` : ''}`;
}

<<<<<<< HEAD
export {
  loadToday,
  saveToday,
  startTimer,
  stopTimer,
  getCurrentTime,
  formatMs
=======
function getCurrentTime () {
  const now = new Date().valueOf();

  return timers.reduce((total, time) => {
    if (time.end) {
      return total + (time.end - time.start);
    } else {
      return total + (now - time.start);
    }
  }, 0);
}

export {
  startTimer,
  stopTimer,
  format,
  getCurrentTime
>>>>>>> eff7fcb... WIP: timer logic
};
