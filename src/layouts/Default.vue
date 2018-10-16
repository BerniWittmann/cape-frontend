<template>
  <el-container>
    <el-header>
      <v-navigation></v-navigation>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
    <el-footer>
      <v-footer></v-footer>
    </el-footer>
  </el-container>
</template>

<script>
/* ============
 * Default Layout
 * ============
 *
 * Shows a pages content with a navigation bar
 *
 * Layouts are used to store a lot of shared code.
 * This way the app stays clean.
 */
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default {
  components: {
    VNavigation: Navigation,
    VFooter: Footer
  }
}

</script>
