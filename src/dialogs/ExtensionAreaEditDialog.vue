<template>
  <el-dialog :title="title" :visible.sync="showExtensionArea" width="70%">
    <injection-mapping v-for="injectionMapping in injectionMappings" :key="injectionMapping.id" :injection-mapping="injectionMapping"></injection-mapping>
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
    }
  }

}
</script>

<style scoped lang="scss">

</style>
