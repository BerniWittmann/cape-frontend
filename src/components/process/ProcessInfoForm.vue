<template>
  <el-card class="process-info">
    <h4>{{ $t('process.edit.info')}}</h4>
    <el-form ref="processForm" :model="process" label-position="top" :rules="rules">
      <el-form-item :label="$t('process.edit.name')" prop="name">
        <el-input v-model="process.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('process.edit.tags')" prop="tags">
        <tag v-for="tag in process.tags" :tag="tag" :key="tag.id" closable @close="removeTag(tag)"></tag>
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
        <el-button v-if="!tagInputVisible && availableTags.length > 0" class="button-new-tag" size="small" @click="showTagInput" icon="el-icon-plus">{{
          $t('process.edit.add_tag') }}
        </el-button>
      </el-form-item>
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

  data() {
    return {
      rules: {
        name: [
          { required: true, message: this.$t('process.edit.validation.name.required'), trigger: 'blur' }
        ]
      },
      newTag: undefined,
      tagInputVisible: false
    }
  },

  computed: {
    allTags() {
      return this.$store.state.tag.tags
    },

    usedTagIDs() {
      return this.process.tags.map((t) => t.id)
    },

    availableTags() {
      return this.allTags.filter(t => !this.usedTagIDs.includes(t.id))
    }
  },

  methods: {
    submit(cb) {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          return cb(this.process)
        } else {
          return cb()
        }
      })
    },

    setFormPristine() {
      this.$refs.processForm.resetFields()
    },

    removeTag(tag) {
      this.process.tags = this.process.tags.filter((t) => t.id !== tag.id)
    },

    addTag() {
      this.process.tags.push(this.newTag)
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
