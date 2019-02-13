<template>
  <el-card class="process-info" :body-style="{ width: '100%' }">
    <el-form ref="processForm" :model="data" label-position="top" :rules="rules" status-icon inline class="use-space"
             @submit.native.prevent>
      <el-form-item class="use-space">
        <el-button type="text" icon="el-icon-arrow-left" @click="$emit('router-back')" class="right-space">{{
          $t('process.edit.back' )}}
        </el-button>
        <el-button v-if="!isNewProcess" @click.native="$emit('reset-process')" type="danger" plain class="right-space">
          {{ $t('process.edit.reset') }}
        </el-button>
        <span class="title left-space right-space">
          <span v-if="isNewProcess">{{ $t('process.add.title')}}</span>
          <span v-else>{{ $t('process.edit.title')}} </span>
        </span>
        <span class="right-space">
          <span class="title" v-if="!nameInputVisible">{{ data.name }}</span>
          <span v-else>
            <el-form-item prop="name">
              <el-input
                      v-model="data.name"
                      ref="nameInput"
                      size="mini"
                      :placeholder="$t('process.edit.name')"
                      @blur="hideInput"
                      @keyup.enter.native="hideInput"
                      @submit.native.prevent="hideInput"
                      class="use-space input-width"
              >
              </el-input>
            </el-form-item>
          </span>
          <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="showInput"
                  v-if="!nameInputVisible"
                  class="black-color tag-space"
          ></el-button>
        </span>
        <el-button type="success" @click.native="$emit('submit-process')" class="submit-button right-space">{{
          $t('process.edit.save') }}
        </el-button>
      </el-form-item>
      <br>
      <el-collapse v-model="activeProperty">
        <el-collapse-item :title="$t('process.edit.properties')" name="1">
          <el-form-item prop="tags" class="use-space">
            <tag-editor  v-model="data.tags" @change="() => {}"></tag-editor>
          </el-form-item>
          <br>
          <el-form-item class="use-space">
            <el-input type="textarea" v-model="data.description" :autosize="{ minRows: 2 }"
                      :placeholder="$t('process.edit.description')">
            </el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-card>
</template>

<script>
/* ============
 * Process Info Form
 * ============
 *
 * A Form which shows information's about a process and allows to edit them
 * Requires:
 *  props:
 *    process - The Process to show and edit
 *    isNewProcess - Boolean, whether it's for a new Process
 *  methods which are emitted:
 *    router-back - if back is pressed
 *    submit - if submit is pressed
 *    reset - if reset is pressed
 */

import TagEditor from '@/components/TagEditor.vue'

export default {
  components: {
    TagEditor
  },

  props: {
    process: {
      type: Object,
      required: true
    },
    isNewProcess: {
      type: Boolean,
      required: true
    }
  },

  watch: {
    process: {
      deep: true,
      handler: function () {
        this.data = {
          name: this.process.name,
          tags: this.process.tags,
          description: this.process.description
        }
      }
    }
  },

  data() {
    return {
      data: {
        name: undefined,
        tags: []
      },
      rules: {
        name: [
          { required: true, message: this.$t('process.edit.validation.name.required'), trigger: 'blur' }
        ]
      },
      nameInputVisible: false,
      description: undefined,
      activeProperty: [] // ['1'] - in case that it should be open
    }
  },

  methods: {
    submit(cb) {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          return cb(this.data)
        } else {
          return cb()
        }
      })
    },

    setFormPristine() {
      this.$refs.processForm.resetFields()
    },

    showInput() {
      this.nameInputVisible = true
      this.$nextTick(_ => {
        this.$refs.nameInput.$refs.input.focus()
      })
    },

    hideInput() {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          this.nameInputVisible = false
        }
      })
    }
  },

  beforeMount() {
    this.data = {
      name: this.process.name,
      tags: this.process.tags,
      description: this.process.description
    }
    if (!this.data.name) this.nameInputVisible = true
  }
}

</script>

<style scoped lang="scss">

.process-info {
  display: flex;
  align-items: center;
  padding: 10px 10px;
}

.use-space {
  width: 100%;
}

.left-space {
  margin-left: 20px;
}

.right-space {
  margin-right: 10px;
}

.input-width {
  width: 300px;
}

.title {
  font-size: large;
  font-weight: bold;
}

.submit-button {
  float: right;
}

.black-color {
  color: #000000;
}

</style>
