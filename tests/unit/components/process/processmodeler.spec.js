import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import Modeler from 'bpmn-js/lib/Modeler'
import ProcessModeler from '@/components/process/ProcessModeler.vue'
import BPMNModules from '@/plugins/bpmn/modules'
import BPMNModdleExtensions from '@/plugins/bpmn/moddleExtensions'
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
        return { zoom: jest.fn(), get: jest.fn(), select: jest.fn(), undo: jest.fn(), eventBus: jest.fn() }
      })
    }
  })
})

jest.mock('@/plugins/bpmn/modules', () => [])
jest.mock('@/plugins/bpmn/moddleExtensions', () => [])

describe('Components', () => {
  describe('ProcessModeler', () => {
    let propsData
    let cmp
    const router = {
      back: jest.fn()
    }
    const message = {
      error: jest.fn()
    }
    const route = {
      params: {

      }
    }

    beforeEach(() => {
      route.params = {}
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
        propsData,
        mocks: {
          $router: router,
          $message: message,
          $route: route
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('sets up the modeler', () => {
      expect(Modeler).toHaveBeenCalledWith({
        container: '#canvas',
        additionalModules: BPMNModules,
        moddleExtensions: BPMNModdleExtensions,
        propertiesPanel: { parent: '#canvas-properties' }
      })
    })

    it('sets up the change event listeners', () => {
      expect(cmp.vm.modeler.on).toHaveBeenCalledWith('element.changed', expect.any(Function))
      expect(cmp.vm.modeler.on).toHaveBeenCalledWith('commandStack.changed', expect.any(Function))
      expect(cmp.vm.modeler.on).toHaveBeenCalledWith('element.out', expect.any(Function))
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
      expect(cmp.emitted('input')).not.toBeTruthy()
    })
    it('handles not setup modeler in change event for xml', () => {
      const fn = cmp.vm.modeler.on.mock.calls[0][1]
      cmp.vm.modeler = undefined
      fn()
      expect(cmp.emitted('input')).not.toBeTruthy()
    })
    it('handles not setup modeler in getSvg', () => {
      const cb = jest.fn()
      const fn = cmp.vm.getSVG
      cmp.vm.modeler = undefined
      fn(cb)
      expect(cb).toHaveBeenCalledWith()
    })
    it('handles not setup modeler in getXml', () => {
      const cb = jest.fn()
      const fn = cmp.vm.getXML
      cmp.vm.modeler = undefined
      fn(cb)
      expect(cb).toHaveBeenCalledWith()
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
      expect(message.error).toHaveBeenCalledWith('process.edit.error_xml_load')
      expect(router.back).toHaveBeenCalled()
    })
    describe('can revert a modelling step when pressing a key combination', () => {
      it('reverts a modelling step on Ctrl Z', () => {
        const handler = document.onkeypress
        expect(handler).toEqual(expect.any(Function))
        handler({
          key: 'z',
          ctrlKey: true
        })
        expect(cmp.vm.modeler.get).toHaveBeenCalledWith('commandStack')
        expect(cmp.vm.modeler.get.mock.results[1].value.undo).toHaveBeenCalled()
      })
      it('reverts a modelling step on Meta Z', () => {
        const handler = document.onkeypress
        expect(handler).toEqual(expect.any(Function))
        handler({
          key: 'z',
          metaKey: true
        })
        expect(cmp.vm.modeler.get).toHaveBeenCalledWith('commandStack')
        expect(cmp.vm.modeler.get.mock.results[1].value.undo).toHaveBeenCalled()
      })
      it('does not revert a modelling step on another combination', () => {
        const handler = document.onkeypress
        expect(handler).toEqual(expect.any(Function))
        handler({
          key: 'x',
          ctrlKey: false
        })
        expect(cmp.vm.modeler.get).not.toHaveBeenCalledWith('commandStack')
      })
      it('can work on the window object', () => {
        const handler = document.onkeypress
        expect(handler).toEqual(expect.any(Function))
        window.event = {}
        // eslint-disable-next-line no-global-assign
        event = {
          key: 'z',
          ctrlKey: true
        }
        handler()
        expect(cmp.vm.modeler.get).toHaveBeenCalledWith('commandStack')
        expect(cmp.vm.modeler.get.mock.results[1].value.undo).toHaveBeenCalled()
      })

      describe('it has a validation method', () => {
        let eventFireFn
        it('has a validate method', () => {
          expect(cmp.vm.validate).toEqual(expect.any(Function))
        })

        it('throws an error if the validation fails', () => {
          const err = (new Error('my_error'))
          eventFireFn = jest.fn().mockImplementation(() => {
            return err
          })
          cmp.vm.modeler.get = jest.fn().mockReturnValue({ fire: eventFireFn })

          expect(cmp.vm.validate).toThrow(err)
          expect(eventFireFn).toHaveBeenCalled()
        })

        it('throws no error if the validation succeeds', () => {
          eventFireFn = jest.fn().mockImplementation(() => {})
          cmp.vm.modeler.get = jest.fn().mockReturnValue({ fire: eventFireFn })

          expect(cmp.vm.validate).not.toThrow()
          expect(eventFireFn).toHaveBeenCalled()
        })
      })
      describe('it has a reloadXML method', () => {
        it('has a reloadXML method', () => {
          expect(cmp.vm.reloadXML).toEqual(expect.any(Function))
        })

        it('throws an error if import Fails', () => {
          console.error = jest.fn()
          propsData.value.xml = '<xml>####</xml>'
          expect(cmp.vm.reloadXML).toThrow()
        })

        it('does nothing if modeler not defined', () => {
          cmp.setProps({
            value: {
              xml: '<xml>Reloaded</xml>'
            }
          })
          cmp.vm.modeler = undefined
          expect(cmp.vm.reloadXML).not.toThrow()
        })

        it('reloads the xml', () => {
          cmp.setProps({
            value: {
              xml: '<xml>Reloaded</xml>'
            }
          })
          cmp.vm.reloadXML()

          expect(cmp.vm.modeler.importXML).toHaveBeenCalledWith('<xml>Reloaded</xml>', expect.any(Function))
        })
      })
    })
  })
})
