<template>
  <div class="context-type">
    <span class="tag tag-row__tag el-tag">
      <i class="fa fa-lg fa-fw" :class="contextType.icon" id="fa-icon"></i>
      {{ contextType.name }}
      <i class="el-tag__close el-icon-close" @click="emitClose" v-if="closable"></i>
    </span>
  </div>
</template>

<script>
/* ============
 * Context Type Component
 * ============
 *
 * A component to view a single Context Type
 */

export default {
  props: {
    contextType: {
      type: Object,
      required: true
    },

    closable: {
      type: Boolean,
      default: false
    }
  },

  computed: {},

  methods: {
    emitClose() {
      this.$emit('close')
    }
  }
}

</script>

<style lang="scss">

#fa-icon {
  font-size: 1.5em;
  margin-right: 5px;
}

</style>
