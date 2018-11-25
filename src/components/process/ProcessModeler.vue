<template>
  <el-card class="modeler">
    <div id="canvas"></div>
  </el-card>
</template>

<script>
/* ============
 * Process Modeler Component
 * ============
 *
 * A component to model a process. This component is a wrapper for the bpmn-io library
 */

import Modeler from 'bpmn-js/lib/Modeler'
import BPMNModules from '@/plugins/bpmn/modules'

import defaultProcessTemplate from '@/assets/defaultProcessTemplate'

export default {
  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      modeler: undefined,
      isLoaded: false
    }
  },

  methods: {
    getSVG(cb) {
      if (this.modeler) {
        return this.modeler.saveSVG((err, svg) => {
          if (err) return cb(err)

          this.value.svg = svg
          return cb(err, svg)
        })
      }
      return cb()
    },

    getXML(cb) {
      if (this.modeler) {
        return this.modeler.saveXML((err, xml) => {
          if (err) return cb(err)

          this.value.xml = xml
          return cb(err, xml)
        })
      }
      return cb()
    },

    updateValues(event) {
      this.getXML(() => {
        this.getSVG(() => {
          this.$emit('input', this.value)
        })
      })
    }
  },

  mounted() {
    this.modeler = new Modeler({ container: '#canvas', additionalModules: BPMNModules })

    const xml = this.value.xml ? this.value.xml : defaultProcessTemplate

    this.modeler.importXML(xml, (err) => {
      if (err) throw err

      const canvas = this.modeler.get('canvas')
      canvas.zoom('fit-viewport')

      this.isLoaded = true
    })

    this.modeler.on('element.changed', this.updateValues)
    this.modeler.on('commandStack.changed', this.updateValues)
  }
}

</script>

<style lang="scss">
.modeler {
  border-radius: 5px;
  background-color: white;
  margin-bottom: 20px;
}
#canvas {
  height: 530px;
}
</style>
