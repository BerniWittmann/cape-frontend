<template>
  <el-container>
    <el-header>
      <v-navigation></v-navigation>
    </el-header>
    <el-main>
      <!-- Page Content -->
      <slot></slot>
    </el-main>
    <el-footer>
      <v-footer></v-footer>
    </el-footer>
  </el-container>
</template>

<script>
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
/*
 * @vuese
 * @group Layouts
 *
 * Shows the page content with a navigation bar and footer
 */
export default {
  name: 'DefaultLayout',
  components: {
    VNavigation: Navigation,
    VFooter: Footer
  }
}

</script>
