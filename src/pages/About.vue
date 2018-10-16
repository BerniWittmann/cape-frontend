<template>
  <v-layout>
    <div class="about">
      <h1>{{ $t('about.title') }}</h1>
    </div>
  </v-layout>
</template>

<script>
import DefaultLayout from '@/layouts/Default.vue'

export default {
  components: {
    VLayout: DefaultLayout
  }
}
</script>

<style scoped lang="scss">
.about {
  text-align: center;
}
</style>
