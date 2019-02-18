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
          <input-edit class="title" ref="nameInput"
                :value="data.name" :rules="rules.name" size="mini"
                :placeholder="$t('process.edit.name')"
          ></input-edit>
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
import TagEditor from '@/components/TagEditor.vue'
import InputEdit from '@/components/InputEdit.vue'

/*
 * @vuese
 * @group Components
 *
 * A Form to show and edit basic information about a process
 */
export default {
  name: 'ProcessInfoForm',
  components: {
    TagEditor,
    InputEdit
  },

  props: {
    // The Process Object
    process: {
      type: Object,
      required: true
    },
    // Option whether this process needs to be created or updated
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
          name: this.process.name || '',
          tags: this.process.tags,
          description: this.process.description
        }
      }
    }
  },

  data() {
    return {
      data: {
        name: '',
        tags: []
      },
      rules: {
        name: [
          { required: true, message: this.$t('process.edit.validation.name.required'), trigger: 'blur' }
        ]
      },
      description: undefined,
      activeProperty: [] // ['1'] - in case that it should be open
    }
  },

  methods: {
    // @vuese
    // @arg callback with data on success or undefined if invalid
    // Submits the form and returns result on successful validation
    submit(cb) {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          return cb(this.data)
        } else {
          return cb()
        }
      })
    },

    // @vuese
    // Sets the Form Pristine
    setFormPristine() {
      this.$refs.processForm.resetFields()
    }
  },

  beforeMount() {
    this.data = {
      name: this.process.name || '',
      tags: this.process.tags,
      description: this.process.description
    }
  },

  mounted() {
    if (!this.data.name) this.$refs.nameInput.showInput()
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
