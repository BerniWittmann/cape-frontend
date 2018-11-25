import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import Modeler from 'bpmn-js/lib/Modeler'
import ProcessModeler from '@/components/process/ProcessModeler.vue'
import BPMNModules from '@/plugins/bpmn/modules'
import defaultProcessTemplate from '@/assets/defaultProcessTemplate'

jest.mock('bpmn-js/lib/Modeler', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      importXML: jest.fn().mockImplementation((xml, cb) => {
        if (xml.includes('####')) return cb(new Error('Invalid XML'))
        return cb(undefined)
      }),
      saveXML: jest.fn().mockImplementation((cb) => {
        return cb(undefined, '<xml></xml>')
      }),
      saveSVG: jest.fn().mockImplementation((cb) => {
        return cb(undefined, '<svg></svg>')
      }),
      get: jest.fn().mockImplementation(() => {
        return { zoom: jest.fn() }
      })
    }
  })
})

describe('Components', () => {
  describe('ProcessModeler', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        value: {
          xml: undefined,
          svg: undefined
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ProcessModeler, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('sets up the modeler', () => {
      expect(Modeler).toHaveBeenCalledWith({
        container: '#canvas',
        additionalModules: BPMNModules
      })
    })

    it('sets up the change event listeners', () => {
      expect(cmp.vm.modeler.on).toHaveBeenCalledWith('element.changed', expect.any(Function))
      expect(cmp.vm.modeler.on).toHaveBeenCalledWith('commandStack.changed', expect.any(Function))
    })
    it('updates the svg on change event', () => {
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      fn()
      expect(cmp.vm.value.svg).toEqual('<svg></svg>')
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].svg).toEqual('<svg></svg>')
    })
    it('updates the xml on change event', () => {
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      fn()
      expect(cmp.vm.value.xml).toEqual('<xml></xml>')
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].xml).toEqual('<xml></xml>')
    })
    it('handles errors in change event for svg', () => {
      cmp.vm.modeler.saveSVG = jest.fn().mockImplementation((cb) => {
        return cb(new Error('Test Error'))
      })
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      fn()
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].svg).toEqual(undefined)
    })
    it('handles errors in change event for xml', () => {
      cmp.vm.modeler.saveXML = jest.fn().mockImplementation((cb) => {
        return cb(new Error('Test Error'))
      })
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      fn()
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].xml).toEqual(undefined)
    })
    it('handles not setup modeler in change event for svg', () => {
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      cmp.vm.modeler = undefined
      fn()
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].svg).toEqual(undefined)
    })
    it('handles not setup modeler in change event for xml', () => {
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      cmp.vm.modeler = undefined
      fn()
      expect(cmp.emitted('input')).toBeTruthy()
      expect(cmp.emitted('input')[0][0].xml).toEqual(undefined)
    })
    it('imports the defaultXMLTemplate on empty process', () => {
      propsData.value.xml = undefined
      render()

      expect(cmp.vm.modeler.importXML).toHaveBeenCalledWith(defaultProcessTemplate, expect.any(Function))
    })
    it('imports the correct xml', () => {
      propsData.value.xml = '<xml></xml>'
      render()

      expect(cmp.vm.modeler.importXML).toHaveBeenCalledWith('<xml></xml>', expect.any(Function))
    })
    it('handles error on xml import', () => {
      console.error = jest.fn()
      propsData.value.xml = '<xml>####</xml>'
      expect(() => {
        render()
      }).toThrow()
    })
  })
})
