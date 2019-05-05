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
    <process-preview class="margin-top" :process="activeProcess"></process-preview>
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
import Tag from '@/components/Tag.vue'
import ProcessPreview from '@/components/ProcessPreview.vue'
import processService from '@/services/process'

/*
 * @vuese
 * @group Dialogs
 *
 * A Dialog to preview a Process which shows the name, tags, description and a preview-svg. Allows to delete, edit or download a process.
 */
export default {
  name: 'ProcessPreviewDialog',
  components: {
    Tag,
    ProcessPreview
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
    fileContent() {
      return 'data:text/xml,' + encodeURIComponent(this.activeProcess.xml)
    },
    fileName() {
      return this.activeProcess.name.replace(/ /g, '_') + '.bpmn'
    }
  },

  methods: {
    // @vuese
    // closes the dialog
    closeDialog() {
      this.$router.back()
    },

    // @vuese
    // routes to the edit page of the process
    editProcess() {
      this.$router.push({
        name: 'process.edit',
        params: this.$route.params
      })
    },

    // @vuese
    // deletes the process after asking for confirmation
    deleteProcess() {
      this.$confirm(this.$t('process.delete.message'), this.$t('process.delete.warning'), {
        confirmButtonText: this.$t('process.delete.ok'),
        cancelButtonText: this.$t('process.delete.cancel'),
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
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
