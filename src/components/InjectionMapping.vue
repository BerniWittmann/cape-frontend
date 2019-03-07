<template>
  <div>
    <el-form :model="injectionData" :inline="true" class="injection-mapping-form" ref="injectionForm" label-position="top"
             :rules="rules">
      <el-form-item prop="contextSituation" :label="$t('injection_mapping.context_situation')">
        <el-cascader
                v-model="currentContextSituation"
                :options="contextSituationTreeData"
                :show-all-levels="false" expand-trigger="hover" filterable
                :placeholder="$t('injection_mapping.context_situation')"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-button type="success" @click="save">{{ $t('injection_mapping.save') }}</el-button>
  </div>
</template>

<script>
import InjectionMapping from '@/models/injectionMapping'
import InjectionMappingService from '@/services/injectionMapping'

/*
 * @vuese
 * @group Components
 *
 * A Component to edit an Injection Mapping
 */
export default {
  name: 'InjectionMapping',
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
        const cS = this.injectionData.contextSituation
        if (!cS) return []
        let result = [undefined, undefined]
        for (let tag of this.contextSituationTreeData) {
          result[0] = tag.value
          const res = tag.children.find(c => c.key === cS.id)
          if (res) {
            result[1] = res.value
            break
          }
        }
        if (!result[1]) {
          result = []
        }
        return result
      },
      set(value) {
        this.injectionData.contextSituation = value[1]
      }
    },
    contextSituationTreeData() {
      return this.$store.getters['contextSituation/contextSituationsByTags']
    }
  },

  methods: {
    save() {
      this.$refs.injectionForm.validate((valid) => {
        if (valid) {
          InjectionMappingService.update(InjectionMapping.create(this.injectionData))
        }
      })
    }
  }
}

</script>

<style lang="scss">
.injection-mapping-form {

}
</style>
