<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card class="modeler">
        <div id="canvas"></div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="modeler-properties">
        <div id="canvas-properties"></div>
      </el-card>
    </el-col>
  </el-row>

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
import BPMNModdleExtensions from '@/plugins/bpmn/moddleExtensions'

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
      const s = this.modeler === undefined ? undefined : this.modeler.get('selection').get()
      if (this.modeler !== undefined) this.modeler.get('selection').select(null)
      this.getXML(() => {
        this.getSVG(() => {
          this.$emit('input', this.value)
        })
      })
      if (this.modeler !== undefined) this.modeler.get('selection').select(s)
    },

    handleKeyPress(e) {
      const ev = window.event ? event : e
      if (ev.key === 'z' && (ev.ctrlKey || ev.metaKey)) {
        this.modeler.get('commandStack').undo()
      }
    }
  },

  mounted() {
    this.modeler = new Modeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#canvas-properties'
      },
      additionalModules: BPMNModules,
      moddleExtensions: BPMNModdleExtensions
    })

    const xml = this.value.xml ? this.value.xml : defaultProcessTemplate

    this.modeler.importXML(xml, (err) => {
      if (err) throw err

      const canvas = this.modeler.get('canvas')
      canvas.zoom('fit-viewport')

      this.isLoaded = true
    })

    this.modeler.on('element.changed', this.updateValues)
    this.modeler.on('commandStack.changed', this.updateValues)
    this.modeler.on('element.out', this.updateValues)

    // Listen for Undo Keycode
    document.onkeypress = this.handleKeyPress
  }
}

</script>

<style lang="scss">
.modeler {
  border-radius: 5px;
  background-color: white;
  margin-bottom: 20px;
}

.el-card.modeler-properties {
  background-color: #f8f8f8;
  border-radius: 5px;
  margin-bottom: 20px;
}

#canvas {
  height: 65vh;
}
</style>
