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
/*
 * @vuese
 * @group Components
 *
 * Renders a Single Context Type
 */
export default {
  name: 'ContextType',
  props: {
    // The Context Type Object
    contextType: {
      type: Object,
      required: true
    },

    // Option whether the Context Type can be deleted or not
    closable: {
      type: Boolean,
      default: false
    }
  },

  computed: {},

  methods: {
    emitClose() {
      // Fired when the close button of the Context Type was clicked
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
