<template>
  <v-layout>
    <div class="home">
      <img alt="CaPE logo" src="../assets/logo.png" class="logo">
      <h3>{{ $t('home.greeting') }}</h3>
      <graph-visualization></graph-visualization>
    </div>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'
import GraphVisualization from '@/components/GraphVisualization.vue'

/*
 * @vuese
 * @group Pages
 *
 * The Landing Page
 */
export default {
  name: 'HomePage',
  components: {
    VLayout: DefaultLayout,
    GraphVisualization
  }
}
</script>

<style scoped lang="scss">
.home {
  text-align: center;
}
.logo {
  max-width: 100%;
}
</style>
