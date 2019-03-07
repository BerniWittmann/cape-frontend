<template>
  <el-dialog :title="title" :visible.sync="showExtensionArea" width="70%">
    <el-collapse v-model="activeInjection" accordion>
      <el-collapse-item v-for="injectionMapping in injectionMappings" :key="injectionMapping.id" :name="injectionMapping.id">
        <template slot="title">
          {{ getTitlePart(injectionMapping, 'contextSituation') }} <i class="title-icon el-icon-back"></i> {{ getTitlePart(injectionMapping, 'injectedProcess') }}
        </template>
        <injection-mapping  :injection-mapping="injectionMapping"></injection-mapping>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script>

import InjectionMapping from '@/components/InjectionMapping.vue'

/*
 * @vuese
 * @group Dialogs
 *
 * A Dialog to edit an Extension Area
 */
export default {
  name: 'ExtensionAreaEditDialog',
  components: {
    InjectionMapping
  },

  data() {
    return {
      activeInjection: ''
    }
  },

  computed: {
    activeProcess() {
      return this.$store.state.process.activeProcess
    },
    showExtensionArea: {
      get: function () {
        return !!this.activeProcess
      },
      set: function () {
        this.closeDialog()
      }
    },

    title() {
      return this.$route.params.title || this.$t('extension_area.title')
    },

    injectionMappings() {
      return this.$store.getters['injectionMapping/getInjectionMappings'](this.$route.params.processID, this.$route.params.extensionAreaID)
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },

    getTitlePart(injectionMapping, name) {
      if (!injectionMapping[name]) return this.$t('injection_mapping.undefined_' + name)
      return injectionMapping[name].name
    }
  }

}
</script>

<style scoped lang="scss">
.title-icon {
  transform: rotate(180deg);
  margin-left: 10px;
  margin-right: 10px;
}
</style>
