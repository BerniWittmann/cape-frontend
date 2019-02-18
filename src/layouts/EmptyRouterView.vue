<template>
  <div class="empty-router-view">
    <router-view name="dialog"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
/*
 * @vuese
 * @group Layouts
 *
 * Renders an Empty Router View
 */
export default {
  name: 'EmptyRouterViewLayout'
}

</script>

<style lang="scss" scoped>
.empty-router-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
}
</style>
