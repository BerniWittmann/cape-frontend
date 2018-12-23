<template>
  <v-layout>
    <div class="page">
      <h3>{{ $t('settings.title') }}</h3>

      <el-tabs type="border-card">

        <el-tab-pane :label="$t('settings.tags')">
          <tag-settings></tag-settings>
        </el-tab-pane>

        <el-tab-pane :label="$t('settings.process_modeler.tab_title')">
          <process-modeler-settings></process-modeler-settings>
        </el-tab-pane>

      </el-tabs>
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
import ProcessModelerSettings from '@/components/settings/ProcessModelerSettings.vue'

export default {
  components: {
    VLayout: DefaultLayout,
    TagSettings,
    ProcessModelerSettings
  }
}
</script>

<style scoped lang="scss">
.page {
  text-align: center;
}
</style>
