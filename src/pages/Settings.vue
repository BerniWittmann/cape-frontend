<template>
  <v-layout>
    <div class="page">
      <h2>{{ $t('settings.title') }}</h2>
      <el-tabs type="border-card" @tab-click="updateLayout">

        <el-tab-pane :label="$t('settings.tags')">
          <tag-settings ref="tagSettings"></tag-settings>
        </el-tab-pane>

        <el-tab-pane :label="$t('settings.context_types')">
          <context-type-settings ref="contextTypeSettings"></context-type-settings>
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
import ContextTypeSettings from '@/components/settings/ContextTypeSettings.vue'

export default {
  components: {
    VLayout: DefaultLayout,
    TagSettings,
    ProcessModelerSettings,
    ContextTypeSettings
  },

  methods: {
    updateLayout(tab) {
      if (tab.label === this.$t('settings.tags')) {
        this.$refs.tagSettings.updateLayoutTable()
      }
      if (tab.label === this.$t('settings.context_types')) {
        this.$refs.contextTypeSettings.updateLayoutTable()
      }
    }

  }
}
</script>

<style scoped lang="scss">
.page {
  text-align: center;
}
</style>
