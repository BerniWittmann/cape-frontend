<template>
  <el-form :model="data" :rules="rules" ref="inputTypeForm" :size="size">
    <el-form-item prop="value">
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

  methods: {
    handleChange() {
      this.$refs.inputTypeForm.validate((valid) => {
        if (valid) {
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
      if (!value || value.length === 0) return callback(new Error(this.$t('input_type.required')))

      if (this.data.type === 'Number') {
        if (isNaN(value)) return callback(new Error(this.$t('input_type.number')))
      } else if (this.data.type === 'Boolean') {
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
</style>
