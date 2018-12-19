<template>
  <el-dialog :title="activeProcess.name" :visible.sync="showProcessPreview">
    <el-row>
      <el-col>
        <tag v-for="tag in activeProcess.tags" :tag="tag" :key="tag.id" size="small"></tag>
      </el-col>
    </el-row>
    <el-row class="margin-top">
      <el-col>
        <span>{{activeProcess.description}}</span>
      </el-col>
    </el-row>
    <br>
    <iframe v-bind:style="{ height: svgHeightAdjust }" :srcdoc="processSVG" class="svg-view margin-top"></iframe>
    <el-row class="margin-top">
      <el-col>
        <el-button icon="el-icon-edit" size="small" @click="editProcess">{{ $t('process.edit.link') }}
        </el-button>
        <el-button icon="el-icon-delete" type="danger" plain size="small" @click="deleteProcess">{{
          $t('process.delete.delete_button') }}
        </el-button>
        <a :href="fileContent" :download="fileName" class="download-link"><el-button plain size="small" icon="el-icon-download">{{$t('process.edit.download')}}</el-button></a>
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
    },
    svgHeightAdjust() {
      if (!this.activeProcess.svg) return 'auto'
      const maxHeight = 500
      const heightPos = this.activeProcess.svg.indexOf('height="') + 8
      const height = parseInt(this.activeProcess.svg.substring(heightPos, this.activeProcess.svg.indexOf('"', heightPos)))
      return height <= maxHeight ? height + 20 + 'px' : maxHeight + 'px'
    },
    fileContent() {
      return 'data:text/xml,' + encodeURIComponent(this.activeProcess.xml)
    },
    fileName() {
      return this.activeProcess.name.replace(/ /g, '_') + '.bpmn'
    },
    processSVG() {
      return !this.activeProcess.svg ? this.$t('process.error_svg_preview') : this.activeProcess.svg
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
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
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

.svg-view {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: none;
}

.margin-top {
  margin-top: 15px;
}

.download-link {
  margin-left: 10px;
}

</style>
