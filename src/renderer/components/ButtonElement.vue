<template>
  <button
    id="element-button"
    v-bind:class="{ active: running }"
    v-on:click="toggleTimer">
    <x-icon v-show="running === true"></x-icon>
    <play-icon v-show="running === false"></play-icon>
  </button>
</template>

<script>
  import { PlayIcon, XIcon } from 'vue-feather-icons';

  export default {
    name: 'button-element',
    components: {
      XIcon,
      PlayIcon
    },
    data: function () {
      return {
        running: false
      }
    },
    methods: {
      toggleTimer: function () {
        this.running = !this.running;
      }
    }
  }
</script>

<style scoped>
#element-button {
  padding: 0;
  width: 4em;
  height: 4em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  outline: 0;
  background: none;
  border: 0;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 2px #f45e61;
  color: #f45e61;
  font-size: inherit;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  border-radius: 100%;
}
#element-button::before, #element-button::after {
  box-sizing: inherit;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
}
#element-button:hover {
  color: #0eb7da;
}
#element-button.active:hover {
  color: #f45e61 !important;
}
#element-button::before, #element-button::after {
  top: 0;
  left: 0;
  border-radius: 100%;
}
#element-button::before {
  border: 2px solid transparent;
}
#element-button:hover::before {
  border-top-color: #0eb7da;
  border-right-color: #0eb7da;
  border-bottom-color: #0eb7da;
  -webkit-transition: border-top-color 0.15s linear, border-right-color 0.15s linear 0.1s, border-bottom-color 0.15s linear 0.2s;
  transition: border-top-color 0.15s linear, border-right-color 0.15s linear 0.1s, border-bottom-color 0.15s linear 0.2s;
}
#element-button.active:hover::before {
  border-top-color: #f45e61;
  border-right-color: #f45e61;
  border-bottom-color: #f45e61;
}
#element-button::after {
  border: 0 solid transparent;
}
#element-button:hover::after {
  border-top: 2px solid #0eb7da;
  border-left-width: 2px;
  border-right-width: 2px;
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
  -webkit-transition: border-left-width 0s linear 0.35s, -webkit-transform 0.4s linear 0s;
  transition: border-left-width 0s linear 0.35s, -webkit-transform 0.4s linear 0s;
  transition: transform 0.4s linear 0s, border-left-width 0s linear 0.35s;
  transition: transform 0.4s linear 0s, border-left-width 0s linear 0.35s, -webkit-transform 0.4s linear 0s;
}
#element-button.active:hover::after {
  border-top: 2px solid #f45e61;
}

.active {
  box-shadow: inset 0 0 0 2px #0eb7da !important;
  color: #0eb7da !important;
}

svg.feather-play {
  /* border: 1px solid purple; */
  margin-left: 1px;
}
</style>
