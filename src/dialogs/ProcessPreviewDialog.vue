<template>
  <el-dialog :title="activeProcess.name" :visible.sync="showProcessPreview">
    <el-row>
      <el-col>
        <tag v-for="tag in activeProcess.tags" :tag="tag" :key="tag.id" size="small"></tag>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col>
        <el-button icon="el-icon-edit" size="small" @click="editProcess">{{ $t('process.edit.link') }}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
/* ============
* Process Preview Dialog
* ============
*
* Shows a preview of the Dialog
*/
import Tag from '@/components/Tag.vue'

export default {
  components: {
    Tag
  },

  computed: {
    activeProcess() {
      return this.$store.state.process.activeProcess
    },
    showProcessPreview: {
      get: function () {
        return !!this.activeProcess
      },
      set: function () {
        this.closeDialog()
      }
    }
  },

  methods: {
    closeDialog() {
      this.$router.back()
    },
    editProcess() {
      this.$router.push({
        name: 'process.edit',
        params: this.$route.params
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
