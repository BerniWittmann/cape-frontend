<template>
  <v-layout>
    <h2 class="process-edit__title"><el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">{{ $t('process.edit.back' )}}</el-button> {{ $t('process.edit.title', { name })}}</h2>
    <el-row :gutter="20">
      <el-col :span="18">
        <p>TODO Modeler comes here </p>
      </el-col>
      <el-col :span="6">
        <process-info-form ref="processInfoForm" :process="process"></process-info-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-button type="success" @click.native="submit">{{ $t('process.edit.save') }}</el-button>
        <el-button @click.native="reset" type="danger" plain>{{ $t('process.edit.reset') }}</el-button>
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

import ProcessService from '@/services/process'

export default {
  components: {
    VLayout: DefaultLayout,
    ProcessInfoForm
  },

  computed: {
    process() {
      return this.$store.state.process.activeProcess
    }
  },

  data() {
    return {
      name: undefined
    }
  },

  methods: {
    submit() {
      this.$refs.processInfoForm.submit((result) => {
        if (result) {
          ProcessService.update(this.process).then(() => {
            this.reset()
          })
        }
      })
    },

    reset() {
      ProcessService.get(this.process).then(() => {
        this.name = this.process.name
        this.$refs.processInfoForm.setFormPristine()
      })
    }
  },

  beforeMount() {
    this.name = this.process.name
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
