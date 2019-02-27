<template>
  <div>
    <p>{{ $t('context_situation.rules.title') }}</p>
    <el-form inline ref="contextSituationRuleForm" :model="data">
      <div>
        <span v-for="(part, idx) in data.parts" :key="'part_' + idx">
          <template v-if="isArgument(part)">
            <el-form-item :prop="'parts.' + idx + '.data'" :rules="rulesArg">
              <el-cascader popper-class="select--argument__cascader"
                      expand-trigger="hover" :class="selectArgumentClass(part.data)"
                      :options="availableArguments" :show-all-levels="false" filterable
                      v-model="part.data" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </template>
          <template v-else-if="isConnector(part)">
            <el-form-item :prop="'parts.' + idx" :rules="rulesCon">
              <el-select class="select--connector" v-model="part.data" @change="handleChange">
                <el-option :value="opt.value" v-for="opt in allowedConnectors" :key="opt.value" :label="opt.label">{{ opt.label }}</el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>{{ part.data }}</template>
        </span>
      </div>
      <el-form-item>
        <el-tooltip content="Remove Last Condition" v-if="canRemove">
          <el-button size="mini" icon="el-icon-minus" @click="remove()" type="danger" plain></el-button>
        </el-tooltip>
        <el-tooltip content="Add Condition">
          <el-button size="mini" icon="el-icon-plus" @click="add()" type="success" plain></el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { CONTEXT_SITUATION_RULES_CONNECTORS, CONTEXT_SITUATION_RULES_PART_TYPES } from '@/utils/constants'
import { encodeContextSituationRuleString, decodeContextSituationRuleString } from '@/utils/helpers'
/*
 * @vuese
 * @group Components
 *
 * A Component for modelling the Rules of a Context Situation
 */
export default {
  name: 'ContextSituationRules',

  props: {
    // The Context Situation Rules String
    value: {
      type: String,
      default: ''
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (str) {
        this.data.parts = decodeContextSituationRuleString(str)
      }
    }
  },

  data() {
    const validateArgument = (rule, val, cb) => {
      if (!val || val.length !== 3) return cb(new Error(this.$t('context_situation.rules.required')))
      if (val[0].length === 0 || val[1].length === 0) return cb(new Error(this.$t('context_situation.rules.required')))
      cb()
    }
    return {
      data: {
        parts: []
      },
      allowedConnectors: [{
        value: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        label: this.$t('context_situation.rules.connectors.and')
      }, {
        value: CONTEXT_SITUATION_RULES_CONNECTORS.OR,
        label: this.$t('context_situation.rules.connectors.or')
      }],
      rulesArg: [{
        validator: validateArgument, message: 'context_situation.rules.required', trigger: 'blur'
      }],
      rulesCon: [{
        required: true, message: 'context_situation.rules.required', trigger: 'blur'
      }]
    }
  },

  computed: {
    availableArguments() {
      return this.availableContextFactors.map(cF => {
        return {
          value: cF.id,
          label: cF.name,
          // TODO Relate to Context Factor States instead of Attributes
          children: cF.attributes.map(attr => ({
            value: attr.id,
            label: attr.key,
            children: [{
              value: false,
              label: `${cF.name} - ${attr.key}`
            }, {
              value: true,
              label: `! ${cF.name} - ${attr.key}`
            }]
          }))
        }
      })
    },

    availableContextFactors() {
      return this.$store.state.contextFactor.contextFactors
    },

    canRemove() {
      return this.data.parts.length > 0
    },

    evaluationString() {
      return encodeContextSituationRuleString(this.data.parts)
    }
  },

  methods: {
    add() {
      if (this.data.parts.length > 0) {
        this.data.parts.push({
          type: CONTEXT_SITUATION_RULES_PART_TYPES.CON,
          data: CONTEXT_SITUATION_RULES_CONNECTORS.AND
        })
      }
      this.data.parts.push({
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG,
        data: []
      })
    },
    remove() {
      this.data.parts.pop()
      this.data.parts.pop()
      this.$nextTick(() => {
        this.handleChange()
      })
    },

    selectArgumentClass(argument) {
      if (!argument || argument.length === 0) return 'select--argument'
      return {
        'select--argument': true,
        'select--argument--negated': argument[2],
        'select--argument--not-negated': !argument[2]
      }
    },

    isArgument(part) {
      return part.type === CONTEXT_SITUATION_RULES_PART_TYPES.ARG
    },

    isConnector(part) {
      return part.type === CONTEXT_SITUATION_RULES_PART_TYPES.CON
    },

    handleChange() {
      this.$refs.contextSituationRuleForm.validate((valid) => {
        if (valid) {
          // Fired when the rule changes
          // @arg The new rule string
          this.$emit('change', this.evaluationString)
        }
      })
    },

    // @vuese
    // Resets the Rules to the Rule String
    reset() {
      this.data.parts = decodeContextSituationRuleString(this.value)
      this.$refs.contextSituationRuleForm.resetFields()
    }
  }
}

</script>

<style lang="scss">
.select--argument, .select--connector {
  margin: 5px;
}

.select--connector {
  width: 80px;
}

.select--argument {
  width: 18em;

  &--negated {
    .el-input__icon {
      color: #f56c6c;
    }

    .el-input__inner {
      background-color: rgba(#f56c6c, 0.1);
    }
  }

  &--not-negated {
    .el-input__icon {
      color: #67c23a;
    }

    .el-input__inner {
      background-color: rgba(#67c23a, 0.1);
    }
  }
}
</style>
