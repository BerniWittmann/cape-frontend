<template>
  <el-tag class="tag" type="info" :style="style" :closable="closable" :size="size" @close="emitClose">{{ tag.name }}</el-tag>
</template>

<script>
import { convertHexToRgba } from '@/utils/helpers'

/*
 * @vuese
 * @group Components
 *
 * A Component to view a single Tag
 */
export default {
  name: 'Tag',
  props: {
    // The Tag object
    tag: {
      type: Object,
      required: true
    },

    // Option whether the tag should be deleteable or not
    closable: {
      type: Boolean,
      default: false
    },

    // Size of the Tag
    size: {
      // `'medium'` / `'small'` / `'mini'`
      type: String
    }
  },

  computed: {
    style() {
      if (!this.tag.color) return {}

      return {
        backgroundColor: convertHexToRgba(this.tag.color, 0.1),
        borderColor: convertHexToRgba(this.tag.color, 0.2),
        color: convertHexToRgba(this.tag.color, 1)
      }
    }
  },

  methods: {
    emitClose() {
      // Emitted when the close button is clicked
      this.$emit('close')
    }
  }
}

</script>

<style lang="scss">
.tag {
  margin-right: 5px;
  &:last-of-type {
    margin-right: 0;
  }

  .el-tag__close {
    color: inherit !important;
    &:hover {
      background-color: inherit !important;
      color: #fff;
    }
  }
}
</style>
