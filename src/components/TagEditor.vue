<template>
  <div>
    <tag v-for="tag in selectedTags" :tag="tag" :key="tag.id" closable @close="removeTag(tag)"></tag>
    <el-select
            v-if="tagInputVisible"
            v-model="newTag"
            size="small"
            ref="tagSelect"
            @keyup.enter.native="addTag"
            @change="addTag"
            @blur="hideTagInput"
            filterable
            class="tag-space"
    >
      <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag">
        <tag :tag="tag" size="mini"></tag>
      </el-option>
    </el-select>
    <el-button v-if="!tagInputVisible && availableTags.length > 0" class="tag-space" size="small"
               @click="showTagInput" icon="el-icon-plus">{{$t('process.edit.add_tag') }}
    </el-button>
  </div>
</template>

<script>
import Tag from '@/components/Tag.vue'

/*
 * @vuese
 * @group Components
 *
 * A Component to edit a list of tags
 */
export default {
  name: 'TagEditor',
  model: {
    prop: 'tags',
    event: 'change'
  },

  props: {
    // The Array of Tag Objects
    tags: {
      type: Array,
      required: true
    }
  },

  components: {
    Tag
  },

  data() {
    return {
      selectedTags: [],
      tagInputVisible: false,
      newTag: undefined
    }
  },

  watch: {
    tags: {
      deep: true,
      immediate: true,
      handler: function (newTags) {
        this.selectedTags = newTags
      }
    }
  },

  computed: {
    allTags() {
      return this.$store.state.tag.tags
    },

    usedTagIDs() {
      return this.selectedTags.map((t) => t.id)
    },

    availableTags() {
      return this.allTags.filter(t => !this.usedTagIDs.includes(t.id))
    }
  },

  methods: {
    // @vuese
    // remove a tag
    // @arg the tag to be removes
    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id)
      // Fired when the tag array changes
      // @arg The new tag array
      this.$emit('change', this.selectedTags)
    },

    // @vuese
    // adds a new tag
    addTag() {
      if (!this.selectedTags.includes(this.newTag)) {
        this.selectedTags.push(this.newTag)
        // Fired when the tag array changes
        // @arg The new tag array
        this.$emit('change', this.selectedTags)
        this.$refs.tagSelect.blur()
      }
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
.tag-space {
  margin-left: 5px;
}
</style>
