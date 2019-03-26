<template>
  <div>
    <el-form :model="injectionData" :inline="true" class="injection-mapping-form" ref="injectionForm"
             label-position="top"
             :rules="rules">
      <el-form-item>
        <p class="ifft-text">{{ $t('injection_mapping.if') }}</p>
      </el-form-item>
      <el-form-item prop="contextSituation" :label="$t('injection_mapping.context_situation')">
        <el-cascader
                v-model="currentContextSituation"
                :options="contextSituationTreeData"
                :show-all-levels="false" expand-trigger="hover" filterable
                :placeholder="$t('injection_mapping.context_situation')"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <p class="ifft-text">{{ $t('injection_mapping.then') }}</p>
      </el-form-item>
      <el-form-item prop="injectedProcess" :label="$t('injection_mapping.injected_process')">
        <el-cascader
                v-model="currentInjectedProcess"
                :options="processTreeData"
                :show-all-levels="false" expand-trigger="hover" filterable
                :placeholder="$t('injection_mapping.injected_process')"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <process-preview v-if="currentProcessObject.svg" class="process-preview" :process="currentProcessObject"></process-preview>
      </el-form-item>
    </el-form>
    <el-button type="success" @click="save">{{ $t('injection_mapping.save') }}</el-button>
    <el-button type="danger" @click="deleteInjectionMapping()">
      {{ $t('injection_mapping.edit.delete') }}
    </el-button>
  </div>
</template>

<script>
import InjectionMapping from '@/models/injectionMapping'
import InjectionMappingService from '@/services/injectionMapping'
import ProcessPreview from '@/components/ProcessPreview.vue'

/*
 * @vuese
 * @group Components
 *
 * A Component to edit an Injection Mapping
 */
export default {
  name: 'InjectionMapping',
  components: {
    ProcessPreview
  },
  props: {
    // the Injection Mapping
    injectionMapping: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      injectionData: {},
      rules: {
        contextSituation: [{
          required: true, message: this.$t('injection_mapping.validation.context_situation.required'), trigger: 'blur'
        }],
        injectedProcess: [{
          required: true, message: this.$t('injection_mapping.validation.injected_process.required'), trigger: 'blur'
        }]
      }
    }
  },

  watch: {
    injectionMapping: {
      deep: true,
      immediate: true,
      handler: function (value) {
        this.injectionData = { ...value }
      }
    }
  },

  computed: {
    currentContextSituation: {
      get() {
        return this.getCurrentObject(this.injectionData.contextSituation, this.contextSituationTreeData)
      },
      set(value) {
        this.injectionData.contextSituation = value[1]
      }
    },
    currentInjectedProcess: {
      get() {
        return this.getCurrentObject(this.injectionData.injectedProcess, this.processTreeData)
      },
      set(value) {
        this.injectionData.injectedProcess = value[1]
      }
    },
    contextSituationTreeData() {
      return this.$store.getters['contextSituation/contextSituationsByTags']
    },
    processTreeData() {
      return this.$store.getters['process/processesByTags']
    },
    currentProcessObject() {
      if (this.currentInjectedProcess.length !== 2) return {}
      return this.currentInjectedProcess[1]
    }
  },

  methods: {
    save() {
      this.$refs.injectionForm.validate((valid) => {
        if (valid) {
          const injectionObject = InjectionMapping.create(this.injectionData)
          if (this.injectionData.id) {
            InjectionMappingService.update(injectionObject)
          } else {
            InjectionMappingService.create(injectionObject).then(() => {
              InjectionMappingService.getByExtensionArea(this.injectionData.processID, this.injectionData.extensionAreaID)
            })
          }
        }
      })
    },
    deleteInjectionMapping() {
      this.$confirm(this.$t('injection_mapping.delete.message'), this.$t('injection_mapping.delete.warning'), {
        confirmButtonText: this.$t('injection_mapping.delete.ok'),
        cancelButtonText: this.$t('injection_mapping.delete.cancel'),
        type: 'warning',
        cancelButtonClass: 'is-plain el-button--info',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        if (this.injectionData.id) {
          InjectionMappingService.remove(this.injectionData)
        } else {
          InjectionMappingService.getByExtensionArea(this.injectionData.processID, this.injectionData.extensionAreaID)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('injection_mapping.delete.cancellation')
        })
      })
    },

    getCurrentObject(data, treeData) {
      if (!data) return []
      let result = [undefined, undefined]
      for (let tag of treeData) {
        result[0] = tag.value
        const res = tag.children.find(c => c.key === data.id)
        if (res) {
          result[1] = res.value
          break
        }
      }
      if (!result[1]) {
        result = []
      }
      return result
    }
  }
}

</script>

<style lang="scss">
.injection-mapping-form {
  display: flex;
  .ifft-text {
    vertical-align: center;
    font-size: 30px;
    text-transform: uppercase;
    margin-left: 10px;
    margin-right: 10px;
    line-height: 75px;
    color: #666;
  }
  .el-form-item:last-of-type {
    flex: 2;
  }
  .process-preview {
    height: auto !important;
    max-height: 300px;
  }
}
</style>
