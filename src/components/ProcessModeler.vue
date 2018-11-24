<template>
  <div class="modeler">
    <div id="canvas"></div>
  </div>
</template>

<script>
/* ============
 * Process Modeler Component
 * ============
 *
 * A component to model a process. This component is a wrapper for the bpmn-io library
 */

import Modeler from 'bpmn-js/lib/Modeler'
import defaultProcessTemplate from '@/assets/defaultProcessTemplate'

export default {
  props: {
    value: {
      type: Object,
      required: true,
      validator: function (value) {
        return value.hasOwnProperty('xml') && value.hasOwnProperty('svg')
      }
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
    this.modeler = new Modeler({ container: '#canvas' })

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
  padding: 10px;
  background-color: white;
  border: 1px solid #909399;
  margin-bottom: 20px;
}
#canvas {
  height: 550px;
}
</style>
