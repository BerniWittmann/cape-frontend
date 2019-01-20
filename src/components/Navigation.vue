<template>
  <el-menu :default-active="this.activeRoute" mode="horizontal" :router="true" class="nav" active-text-color="#6CC9E8">
    <router-link
            :to="{ name: 'home' }"
            class="nav-image-wrap"
            tag="a"
    >
      <div class="nav-image"></div>
    </router-link>
    <el-menu-item :route="{ name: 'processes' }" index="processes">{{ $t('nav.processes') }}</el-menu-item>
    <el-menu-item :route="{ name: 'context_factors'}" index="context_factors">{{$t('nav.context_factors')}}</el-menu-item>
  </el-menu>
</template>
<script>
/* ============
 * Navigation Component
 * ============
 *
 * Navigation Bar component.
 *port DefaultLayout from '@/layouts/Default.vue'
 * Renders the navigation Bar.
 */

export default {
  computed: {
    activeRoute() {
      return this.$route.name
    }
  }
}

</script>

<style scoped lang="scss">
.nav-image-wrap {
  float: left;
  display: flex;
  align-items: center;
  text-decoration: none !important;
  outline: none !important;
  margin-right: 20px;

  .nav-image {
    margin: 10px 0 10px 20px;
    height: 40px;
    width: 100px;
    background: url('../assets/logo.png') no-repeat center center;
    background-size: contain;
  }
}

</style>
