<template>
  <iframe v-bind:style="{ height: svgHeightAdjust }" :srcdoc="processSVG" class="svg-view margin-top"></iframe>
</template>

<script>

/*
 * @vuese
 * @group Components
 *
 * A Component to preview the svg of a process
 */
export default {
  name: 'ProcessPreview',
  props: {
    // The Process object
    process: {
      type: Object,
      required: true
    }
  },

  computed: {
    // @vuese
    // adjusts the height of the iframe to to either fit or be limited
    svgHeightAdjust() {
      if (!this.process.svg) return 'auto'
      const maxHeight = 500
      const heightPos = this.process.svg.indexOf('height="') + 8
      const height = parseInt(this.process.svg.substring(heightPos, this.process.svg.indexOf('"', heightPos)))
      return height <= maxHeight ? height + 25 + 'px' : maxHeight + 'px'
    },

    // @vuese
    // either returns the svg or a text if none available
    processSVG() {
      return !this.process.svg ? this.$t('process.error_svg_preview') : this.process.svg
    }
  }
}

</script>

<style lang="scss">
.svg-view {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: none;
}
</style>
