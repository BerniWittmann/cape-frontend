<template>
  <div class="input-edit">
    <span v-if="!isEditing">{{ data.text }}</span>
    <span v-else>
      <el-form ref="textForm" :model="data" label-position="top" :rules="validationRules" status-icon inline :size="size"
               @submit.native.prevent="hideInput" class="form">
        <el-form-item :prop="propName">
          <el-input
                  v-model="data.text"
                  ref="inputField"
                  :size="size"
                  :placeholder="placeholder"
                  @blur="hideInput"
                  @keyup.enter.native="hideInput"
                  @submit.native.prevent="hideInput"
                  class="input"
          ></el-input>
        </el-form-item>
      </el-form>
    </span>
    <el-button
            type="text"
            icon="el-icon-edit"
            @click="showInput"
            v-if="!isEditing"
            class="black-color tag-space"
    ></el-button>
  </div>
</template>

<script>
/*
 * @vuese
 * @group Components
 *
 * A component to edit a text but hidden behind a label with an edit button
 */
export default {
  name: 'InputEdit',
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    // The Value of the input field
    value: {
      type: String,
      required: true
    },
    // The Rules array that the input field should be validated against
    rules: {
      type: Array,
      default: () => []
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
    // The name the field should be referenced with within the form
    propName: {
      type: String,
      default: 'text'
    }
  },

  data() {
    return {
      data: {
        text: undefined
      },
      isEditing: false
    }
  },

  computed: {
    validationRules() {
      return {
        [this.propName]: this.rules
      }
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (newValue) {
        this.data.text = newValue
      }
    }
  },

  methods: {
    // @vuese
    // shows the Input field
    showInput() {
      this.isEditing = true
      this.$nextTick(() => {
        try {
          this.$refs.inputField.$refs.input.focus()
        } catch (e) {}
      })
    },

    // @vuese
    // hides the Input field
    hideInput() {
      this.$refs.textForm.validate((valid) => {
        if (valid) {
          this.isEditing = false
          // Fired when the text changes
          // @arg The new text
          this.$emit('change', this.data.text)
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.input-edit {
  display: inline;
}
.form {
  margin-top: 10px;
  display: inline;
}
.black-color {
  color: #000000;
}

.tag-space {
  margin-left: 5px;
}
</style>
