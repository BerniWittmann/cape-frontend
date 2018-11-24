<template>
  <div class="empty-router-view">
    <router-view name="dialog"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
/* ============
 * Empty Router View
 * ============
 *
 * Renders an empty Router View
 */

export default {}

</script>

<style lang="scss" scoped>
.empty-router-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
}
</style>
