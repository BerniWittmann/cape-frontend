<template>
  <v-layout>
    <div class="home">
      <img alt="CaPE logo" src="../assets/logo.png" class="logo">
      <h3>{{ $t('home.greeting') }}</h3>
      <p>{{ $t('home.construction_notice') }}</p>
    </div>
  </v-layout>
</template>

<script>
// @ is an alias to /src
import DefaultLayout from '@/layouts/Default.vue'

export default {
  components: {
    VLayout: DefaultLayout
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
