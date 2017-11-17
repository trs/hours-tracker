<template>
  <div id="page-idle">
    <div id="timer-container">
      <h2>{{ timer }}</h2>
    </div>

    <div id="action-container">
      <span>
        <button-element>Start</button-element>
      </span>
    </div>

    <div id="date-container">
      <span>November 14</span>
      <calendar-icon></calendar-icon>
    </div>
  </div>
</template>

<script>
  import ButtonElement from './ButtonElement';
  import {CalendarIcon} from 'vue-feather-icons';

  export default {
    name: 'idle-page',
    components: {
      ButtonElement,
      CalendarIcon
    },
    data: function () {
      return {
        timer: '00:00:00'
      };
    },
    created: function () {
      this.$electron.ipcRenderer.on('main:timer:set', (event, time) => {
        this.timer = time;
      });
    }
  };
</script>

<style scoped>
#page-idle {
  height: 100vh;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
}

#page-idle > div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

div#timer-container {
  padding: 8px 12px;
}
  #timer-container h2 {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

div#action-container {
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
}
  div#action-container > span {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

div#date-container {
  padding: 8px 12px;
  justify-content: space-between;
}
  div#date-container > svg {
    width: 16px;
    height: 16px;
  }
</style>
