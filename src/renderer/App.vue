<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'hours-tracker'
  };
</script>

<style>
@font-face {
  font-family: 'Roboto';
  src: url('~@/assets/fonts/Roboto/Roboto-Thin.ttf');
}

html, body {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  height: 100vh;
}

html, body {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  color: #fafafa;
  background: #394046;
}
</style>
