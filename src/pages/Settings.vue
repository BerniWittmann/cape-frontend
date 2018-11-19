<template>
  <v-layout>
    <div class="page">
      <h3>{{ $t('settings.title') }}</h3>
      <h4>{{ $t('settings.tags') }}</h4>
      <tag-settings></tag-settings>
    </div>
  </v-layout>
</template>

<script>
/* ============
 * Settings Page
 * ============
 *
 * The Settings Page
 */
import DefaultLayout from '@/layouts/Default.vue'
import TagSettings from '@/components/settings/TagSettings.vue'

export default {
  components: {
    VLayout: DefaultLayout,
    TagSettings
  }
}
</script>

<style scoped lang="scss">
.page {
  text-align: center;
}
</style>
