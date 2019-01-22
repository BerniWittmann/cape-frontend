<template>
  <el-dialog :title="activeProcess.name" :visible.sync="showProcessPreview">
    <el-row class="margin-props">
      <el-col>
        {{$t('process.edit.properties')}}
      </el-col>
    </el-row>
    <el-row>
      <el-col class="margin-left">
        <tag v-for="tag in activeProcess.tags" :tag="tag" :key="tag.id" size="small"></tag>
      </el-col>
    </el-row>
    <el-row class="margin-top">
      <el-col class="margin-left">
        <span>{{activeProcess.description}}</span>
      </el-col>
    </el-row>
    <br>
    <iframe v-bind:style="{ height: svgHeightAdjust }" :srcdoc="processSVG" class="svg-view margin-top"></iframe>
    <el-row class="margin-top" justify="end" :gutter="20">
      <el-col :span="6">
        <el-button icon="el-icon-delete" type="danger" @click="deleteProcess">{{
          $t('process.delete.delete_button') }}
        </el-button>
      </el-col>
      <el-col :span="12" :offset="6">
        <div style="float: right">
        <a :href="fileContent" :download="fileName" class="download-link">
          <el-button plain icon="el-icon-download">{{$t('process.edit.download')}}</el-button>
        </a>
        <el-button icon="el-icon-edit" @click="editProcess" class="margin-left">{{ $t('process.edit.link') }}</el-button>
        </div>
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
      return height <= maxHeight ? height + 25 + 'px' : maxHeight + 'px'
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
  margin-top: 25px;
}

.margin-left {
  margin-left: 10px;
}

.margin-props {
  margin-top: -25px;
  margin-bottom: 10px;
}

.download-link {
  margin-left: 10px;
}

</style>
