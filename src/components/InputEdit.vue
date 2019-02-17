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
/* ============
 * Input Edit Component
 * ============
 *
 * A component to edit aa text but hidden behind a text with an edit button
 */

export default {
  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    value: {
      type: String,
      required: true
    },
    rules: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'normal'
    },
    placeholder: {
      type: String,
      default: undefined
    },
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
    showInput() {
      this.isEditing = true
      this.$nextTick(() => {
        try {
          this.$refs.inputField.$refs.input.focus()
        } catch (e) {}
      })
    },

    hideInput() {
      this.$refs.textForm.validate((valid) => {
        if (valid) {
          this.isEditing = false
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

.input {
  width: 300px;
}

.tag-space {
  margin-left: 5px;
}
</style>
