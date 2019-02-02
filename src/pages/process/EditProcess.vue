<template>
  <v-layout>
    <el-row>
      <el-col>
        <process-info-form
                ref="processInfoForm"
                :process="process" :isNewProcess="isNewProcess"
                v-on:router-back="$router.back()"
                v-on:submit-process="submit"
                v-on:reset-process="reset"
        ></process-info-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <process-modeler v-model="processData" @input="() => {}" ref="processModeler"></process-modeler>
      </el-col>
    </el-row>
  </v-layout>
</template>

<script>
/* ============
 * Edit Process Page
 * ============
 *
 * A page where a process can be edited
 */

import DefaultLayout from '@/layouts/Default.vue'
import ProcessInfoForm from '@/components/process/ProcessInfoForm.vue'
import ProcessModeler from '@/components/process/ProcessModeler.vue'

import ProcessService from '@/services/process'
import Process from '@/models/process'

export default {
  components: {
    VLayout: DefaultLayout,
    ProcessInfoForm,
    ProcessModeler
  },

  computed: {
    process() {
      if (this.isNewProcess) {
        if (this.$route.params.processData) {
          return Process.create(this.$route.params.processData)
        }
        return new Process()
      }
      return this.$store.state.process.activeProcess
    },
    isNewProcess() {
      return this.$route.name === 'process.new'
    }
  },

  data() {
    return {
      name: undefined,
      processData: {
        xml: undefined,
        svg: undefined,
        extensionAreas: []
      }
    }
  },

  methods: {
    submit() {
      this.$refs.processInfoForm.submit((result) => {
        if (result) {
          try {
            this.$refs.processModeler.validate()
          } catch (e) {
            this.$message.error(this.$t('process.edit.process_validation_errors.' + e.message))
            return
          }

          const data = Process.create({
            ...this.process,
            ...this.processData
          })
          data.id = this.process.id
          data.name = result.name
          data.tags = result.tags
          data.description = result.description
          if (!this.isNewProcess) {
            ProcessService.update(data).then(() => {
              this.reset()
            })
          } else {
            ProcessService.create(data).then(() => {
              this.$router.replace({
                name: 'process.edit',
                params: {
                  processID: this.$store.state.process.processes[this.$store.state.process.processes.length - 1].id
                }
              })
            })
          }
        }
      })
    },

    reset() {
      ProcessService.get(this.process).then(() => {
        this.name = this.process.name
        this.processData.xml = this.process.xml
        this.processData.svg = this.process.svg
        this.$refs.processInfoForm.setFormPristine()
        this.$refs.processModeler.reloadXML()
      })
    }
  },

  beforeMount() {
    this.name = this.process.name
    this.processData.xml = this.process.xml
    this.processData.svg = this.process.svg
  },

  beforeRouteLeave(to, from, next) {
    if (!this.process.id) return next()
    ProcessService.free({ id: this.process.id }).then(() => next())
  }
}
</script>

<style scoped lang="scss">
.process-edit__title {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 3em;
  }
}
.el-row {
  margin-bottom: 20px;
}
</style>
