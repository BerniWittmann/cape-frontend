<template>
  <v-layout>
    <div class="page">
      <h3>{{ $t('settings.title') }}</h3>
      <el-tabs type="border-card" @tab-click="updateTable">

        <el-tab-pane :label="$t('settings.tags')">
          <tag-settings></tag-settings>
        </el-tab-pane>

        <el-tab-pane :label="$t('settings.context_types')">
          <context-type-settings ref="contextTypeSettings"></context-type-settings>
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
import ContextTypeSettings from '@/components/settings/ContextTypeSettings.vue'

export default {
  components: {
    VLayout: DefaultLayout,
    TagSettings,
    ContextTypeSettings
  },

  methods: {
    updateTable(clickedTab) {
      if (clickedTab.label === this.$t('settings.context_types')) {
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
