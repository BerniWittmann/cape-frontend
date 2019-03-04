<template>
  <el-dialog :title="title" :visible.sync="showExtensionArea" width="70%">
    <p>TODO Injection Mapping</p>
  </el-dialog>
</template>

<script>

/*
 * @vuese
 * @group Dialogs
 *
 * A Dialog to edit an Extension Area
 */
export default {
  name: 'ExtensionAreaEditDialog',
  components: {},

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
