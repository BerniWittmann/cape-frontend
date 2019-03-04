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
import Modeler from 'bpmn-js/lib/Modeler'
import BPMNModules from '@/plugins/bpmn/modules'
import BPMNModdleExtensions from '@/plugins/bpmn/moddleExtensions'

import defaultProcessTemplate from '@/assets/defaultProcessTemplate'

/*
 * @vuese
 * @group Components
 *
 * A Component which allows the process itself to be edited. This is a wrapper for the bpmn-io library
 */
export default {
  name: 'ProcessModeler',
  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    // The value object containing the keys `xml`, `svg`, `extensionAreas`
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
      if (!this.modeler) return
      const elementRegistry = this.modeler.get('elementRegistry')
      if (!elementRegistry) return

      const s = this.modeler.get('selection').get()
      this.modeler.get('selection').select(null)

      this.value.extensionAreas = elementRegistry
        .filter(obj => obj.type === 'cape:ExtensionArea')
        .map(o => o.businessObject)
      this.getXML(() => {
        this.getSVG(() => {
          // Fired when the data changed
          // @arg The new value object with `svg`, `xml`and `extensionAreas`
          this.$emit('input', this.value)
        })
      })
      this.modeler.get('selection').select(s)
    },

    handleKeyPress(e) {
      const ev = window.event ? event : e
      if (ev.key === 'z' && (ev.ctrlKey || ev.metaKey)) {
        this.modeler.get('commandStack').undo()
      }
    },

    // @vuese
    // Validate the Process Model
    validate() {
      const error = this.modeler.get('eventBus').fire('validate')
      if (error) throw error
    },

    // @vuese
    // Reload the XML data into the modeler
    reloadXML() {
      if (!this.modeler) return
      this.modeler.importXML(this.value.xml, (err) => {
        if (err) throw err

        const canvas = this.modeler.get('canvas')
        canvas.zoom('fit-viewport')
      })
    },

    openExtensionArea(event, extensionArea) {
      this.$router.push({
        name: 'process.edit.extension-area',
        params: {
          ...this.$route.params,
          extensionAreaID: extensionArea.id,
          title: extensionArea.name
        }
      })
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
      if (err) {
        this.$message.error(this.$t('process.edit.error_xml_load'))
        this.$router.back()
        throw err
      }

      const canvas = this.modeler.get('canvas')
      canvas.zoom('fit-viewport')

      this.isLoaded = true
    })

    this.modeler.on('element.changed', this.updateValues)
    this.modeler.on('commandStack.changed', this.updateValues)
    this.modeler.on('element.out', this.updateValues)

    const eventBus = this.modeler.get('eventBus')
    eventBus.on('extensionAreaEdit', this.openExtensionArea)

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

  .djs-minimap {
    .toggle {
      font-family: element-icons !important;
    }

    &.open .toggle:before {
      content: "\E621";
    }

    &:not(.open) .toggle:before {
      content: "\E625";
    }
  }
}

.el-card.modeler-properties {
  background-color: #f8f8f8;
  border-radius: 5px;
  margin-bottom: 20px;
}

#canvas, #canvas-properties {
  height: 65vh;
}

#canvas-properties {
  overflow: auto;
}
</style>
