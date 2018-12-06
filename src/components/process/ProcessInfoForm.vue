<template>
  <el-card class="process-info">
    <h4>{{ $t('process.edit.info')}}</h4>
    <el-form ref="processForm" :model="data" label-position="top" :rules="rules">
      <el-form-item :label="$t('process.edit.name')" prop="name">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('process.edit.tags')" prop="tags">
        <tag v-for="tag in data.tags" :tag="tag" :key="tag.id" closable @close="removeTag(tag)"></tag>
        <el-select
                v-if="tagInputVisible"
                v-model="newTag"
                size="small"
                ref="tagSelect"
                @keyup.enter.native="addTag"
                @change="addTag"
                @blur="hideTagInput"
                filterable
        >
          <el-option
                  v-for="tag in availableTags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag">
            <tag :tag="tag" size="mini"></tag>
          </el-option>
        </el-select>
        <el-button v-if="!tagInputVisible && availableTags.length > 0" class="button-new-tag" size="small"
                   @click="showTagInput" icon="el-icon-plus">{{
          $t('process.edit.add_tag') }}
        </el-button>
      </el-form-item>
      <el-input type ="textarea" v-model="data.description">
      </el-input>
    </el-form>
  </el-card>
</template>

<script>
/* ============
 * Tag Settings Component
 * ============
 *
 * A component to edit the Tags
 */

import TagComponent from '@/components/Tag.vue'

export default {
  components: {
    Tag: TagComponent
  },

  props: {
    process: {
      type: Object,
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
      newTag: undefined,
      tagInputVisible: false,
      description: undefined
    }
  },

  computed: {
    allTags() {
      return this.$store.state.tag.tags
    },

    usedTagIDs() {
      return this.data.tags.map((t) => t.id)
    },

    availableTags() {
      return this.allTags.filter(t => !this.usedTagIDs.includes(t.id))
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

    removeTag(tag) {
      this.data.tags = this.data.tags.filter((t) => t.id !== tag.id)
    },

    addTag() {
      this.data.tags.push(this.newTag)
    },

    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagSelect.focus()
      })
    },

    hideTagInput() {
      setTimeout(() => {
        this.tagInputVisible = false
        this.newTag = undefined
      }, 100)
    }
  },

  beforeMount() {
    this.data = {
      name: this.process.name,
      tags: this.process.tags,
      description: this.process.description
    }
  }
}

</script>

<style scoped lang="scss">
.process-info {
  background-color: #EBEEF5;
  border-radius: 5px;
  padding: 30px 20px;
}

.button-new-tag {
  margin-left: 5px;
}
</style>
