<template>
  <el-row type="flex" justify="center">
    <el-col :span="8">
      <el-row>
        <el-col>
          <tag class="tag-row__tag" :tag="tag" v-for="tag in tags" :key="tag.id" closable @close="deleteTag(tag)"></tag>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col>
          <tag :tag="form" v-if="form.name && form.name.length > 0"></tag>
        </el-col>
      </el-row>
      <el-form ref="tagForm" :model="form" label-position="top" :rules="rules">
        <el-form-item :label="$t('settings.tag.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('settings.tag.color')" prop="color">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">{{ $t('settings.tag.submit') }}</el-button>
          <el-button @click="reset">{{ $t('settings.tag.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
/* ============
 * Tag Settings Component
 * ============
 *
 * A component to edit the Tags
 */

import { DEFAULT_TAG_COLOR } from '@/utils/constants'
import Tag from '@/models/tag'
import tagService from '@/services/tag'

import TagComponent from '@/components/Tag.vue'

export default {
  components: {
    Tag: TagComponent
  },

  data() {
    return {
      form: {
        name: undefined,
        color: DEFAULT_TAG_COLOR
      },
      rules: {
        name: [
          { required: true, message: this.$t('settings.tag.validation.name.required'), trigger: 'blur' }
        ],
        color: [
          { required: true, message: this.$t('settings.tag.validation.color.required'), trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    submit() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          const tag = new Tag(this.form)
          tagService.create(tag).then(() => {
            this.reset()
          })
        }
      })
    },

    reset() {
      this.form = {
        name: undefined,
        color: DEFAULT_TAG_COLOR
      }
      this.$refs.tagForm.resetFields()
    },

    deleteTag(tag) {
      tagService.remove(tag)
    }
  },

  computed: {
    tags() {
      return this.$store.state.tag.tags
    }
  }
}

</script>

<style scoped lang="scss">
.tag-row__tag {
  margin-bottom: 5px;
}
</style>
