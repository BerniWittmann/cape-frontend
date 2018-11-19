<template>
  <el-tag class="tag" type="info" :style="style" :closable="closable" :size="size" @close="emitClose">{{ tag.name }}</el-tag>
</template>

<script>
/* ============
 * Tag Component
 * ============
 *
 * A component to view a single Tag
 */

import { convertHexToRgba } from '@/utils/helpers'

export default {
  props: {
    tag: {
      type: Object,
      required: true
    },

    closable: {
      type: Boolean,
      default: false
    },

    size: {
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
      this.$emit('close')
    }
  }
}

</script>

<style scoped lang="scss">
.tag {
  margin-right: 5px;
  &:last-of-type {
    margin-right: 0;
  }
}
</style>
