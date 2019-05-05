<template>
  <el-form :model="data" :rules="rules" ref="inputTypeForm" :size="size">
    <el-form-item prop="value" v-if="isBoolean" class="select-group">
      <el-select v-model="data.type" :placeholder="typePlaceholder" @change="handleChange" v-if="showTypeSelect" :size="size">
        <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                   :value="option.value"></el-option>
      </el-select>
      <el-select v-model="data.value" :placeholder="placeholder" @change="handleChange" :size="size">
        <el-option
                v-for="item in booleanOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value">
        </el-option>
        <el-option
                :value="$t('context_factor.none')"
                :label="$t('context_factor.none')"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="value" v-else>
      <el-input :placeholder="placeholder" v-model="data.value" class="input-with-select" @change="handleChange" :size="size">
        <el-select v-model="data.type" slot="prepend" :placeholder="typePlaceholder" @change="handleChange" v-if="showTypeSelect" :size="size">
          <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                     :value="option.value"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
/*
 * @vuese
 * @group Components
 *
 * A component to edit a value and it's type
 */
export default {
  name: 'InputType',
  model: {
    prop: 'data',
    event: 'change'
  },

  props: {
    // The Value of the input field
    value: {
      type: String,
      default: ''
    },
    // The Type of the input field
    type: {
      type: String,
      default: 'String'
    },
    // Size of the controls
    size: {
      // `'medium'` / `'small'` / `'mini'`
      type: String,
      default: 'normal'
    },
    // The Placeholder for the input field
    placeholder: {
      type: String,
      default: undefined
    },
    // The Placeholder for the type field
    typePlaceholder: {
      type: String,
      default: undefined
    },
    // Display the select to change the type
    showTypeSelect: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      data: {
        value: undefined,
        type: undefined
      },
      typeOptions: [{
        value: 'String',
        label: this.$t('types.string')
      }, {
        value: 'Number',
        label: this.$t('types.number')
      }, {
        value: 'Boolean',
        label: this.$t('types.boolean')
      }],
      booleanOptions: [{
        value: 'TRUE'
      }, {
        value: 'FALSE'
      }],
      rules: {
        value: [{
          validator: this.validateValue, trigger: 'blur'
        }]
      }
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (newValue) {
        this.data.value = newValue
      }
    },
    type: {
      deep: true,
      immediate: true,
      handler: function (newValue) {
        this.data.type = newValue
      }
    }
  },

  computed: {
    isBoolean() {
      return this.data.type === 'Boolean'
    }
  },

  methods: {
    handleChange(selected) {
      if (this.isBoolean && selected === this.$t('context_factor.none')) this.data.value = ''
      this.$refs.inputTypeForm.validate((valid) => {
        if (valid) {
          // Emitted when the input value or type is changed
          // @arg data object with value and type
          this.$emit('change', this.data)
        }
      })
    },

    // @vuese
    // validates the form
    // @arg Callback function with the result as boolean
    validate(cb) {
      this.$refs.inputTypeForm.validate(cb)
    },

    validateValue(rule, value, callback) {
      if (value && this.data.type === 'Number') {
        if (isNaN(value)) return callback(new Error(this.$t('input_type.number')))
      } else if (value && this.data.type === 'Boolean') {
        if (!['TRUE', 'FALSE'].includes(value)) return callback(new Error(this.$t('input_type.boolean')))
      }

      callback()
    }
  }
}

</script>

<style lang="scss">

.input-with-select {
  .el-select .el-input {
    width: 100px;
  }
}

.select-group {
  .el-form-item__content {
    display: flex !important;
  }
  .el-select:first-of-type {
    width: 100px;
    flex-basis: 100px;
    flex-shrink: 0;
    .el-input__inner {
      background-color: #f5f7fa;
      color: #909399;
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border: 1px solid #dcdfe6;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }
  }
  .el-select:last-of-type {
    .el-input__inner {
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
