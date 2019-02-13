<template>
  <el-form ref="csRulesForm" :model="contextSituation" label-position="top" :rules="rules" status-icon inline
           @submit.native.prevent class="context-situation-rules">
    <el-form-item class="use-space">
          <span>
            <span v-if="!rulesInputVisible">{{ contextSituation.rules }}</span>
            <span v-else>
              <el-form-item prop="rules">
                <el-input
                        v-model="contextSituation.rules"
                        ref="rulesInput"
                        size="mini"
                        :placeholder="$t('context_situation.edit.rules')"
                        @blur="hideInput"
                        @keyup.enter.native="hideInput"
                        @submit.native.prevent="hideInput"
                        class="input"
                ></el-input>
              </el-form-item>
            </span>
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="showInput"
                    v-if="!rulesInputVisible"
                    class="black-color tag-space"
            ></el-button>
          </span>
    </el-form-item>
  </el-form>
</template>

<script>
/* ============
 * ContextSituationRules
 * ============
 *
 *
 */
export default {
  components: {},

  props: {
    contextSituation: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      rulesInputVisible: false,
      rules: {
        rules: [
          { required: true, message: this.$t('context_situation.edit.validation.rules.required'), trigger: 'blur' }
        ]
      }
    }
  },

  computed: {},

  methods: {
    showInput() {
      this.rulesInputVisible = true
      this.$nextTick(_ => {
        this.$refs.rulesInput.$refs.input.focus()
      })
    },

    hideInput() {
      this.$refs.csRulesForm.validate((valid) => {
        if (valid) {
          this.rulesInputVisible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

.black-color {
  color: #000000;
}

.input {
  width: 300px;
}

.tag-space {
  margin-left: 5px;
}
</style>
