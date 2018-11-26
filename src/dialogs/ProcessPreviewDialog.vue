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
                <el-button icon="el-icon-edit" size="small" @click="editProcess">{{ $t('process.edit.link') }}
                </el-button>
                <el-button icon="el-icon-delete" type="danger" plain size="small" @click="deleteProcess">{{ $t('process.delete.delete_button') }}
                </el-button>
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
import processService from '@/services/process'

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
    },

    deleteProcess() {
      this.$confirm(this.$t('process.delete.message'), this.$t('process.delete.warning'), {
        confirmButtonText: this.$t('process.delete.ok'),
        cancelButtonText: this.$t('process.delete.cancel'),
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('process.delete.confirmation')
        })
        processService.remove(this.activeProcess)
        this.$router.back()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('process.delete.cancellation')
        })
      })
    }
  }

}
</script>

<style scoped lang="scss">

</style>
