<template>
  <v-layout>
    <h2 class="process-edit__title">
      <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">{{ $t('process.edit.back' )}}</el-button>
      <span v-if="isNewProcess">{{ $t('process.add.title')}}</span>
      <span v-else>{{ $t('process.edit.title', { name })}}</span>
    </h2>
    <el-row :gutter="20">
      <el-col :span="18">
        <process-modeler v-model="processData" @input="() => {}"></process-modeler>
      </el-col>
      <el-col :span="6">
        <process-info-form ref="processInfoForm" :process="process"></process-info-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button type="success" @click.native="submit">{{ $t('process.edit.save') }}</el-button>
        <el-button v-if="!isNewProcess" @click.native="reset" type="danger" plain>{{ $t('process.edit.reset') }}
        </el-button>
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
        svg: undefined
      }
    }
  },

  methods: {
    submit() {
      this.$refs.processInfoForm.submit((result) => {
        if (result) {
          const data = Process.create({
            ...this.process,
            ...this.processData
          })
          data.id = this.process.id
          data.name = result.name
          data.tags = result.tags
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
      })
    }
  },

  beforeMount() {
    this.name = this.process.name
    this.processData.xml = this.process.xml
    this.processData.svg = this.process.svg
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
</style>
