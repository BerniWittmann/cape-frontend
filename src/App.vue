<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
/* ============
 * App - Root
 * ============
 *
 * This file is the root component of the Vue Application
 */

export default {
  name: 'app'
}
</script>

<style lang="scss">
#app {
  font-family: Helvetica Neue, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: auto;

  & > .el-container.is-vertical {
    min-height: 100%;
  }
}
body {
  margin: 0;
}
</style>
