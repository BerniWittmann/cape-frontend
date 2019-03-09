import { mount } from '@vue/test-utils'
import { i18n, monkeyPatchTransitions } from '../setupPlugins'

monkeyPatchTransitions()

import InjectionMapping from '@/components/InjectionMapping.vue'
import InjectionMappingService from '@/services/injectionMapping'
import InjectionMappingModel from '@/models/injectionMapping'

describe('Components', () => {
  describe('InjectionMapping', () => {
    let propsData
    let cmp
    let store
    InjectionMappingService.update = jest.fn()
    console.warn = jest.fn()

    beforeEach(() => {
      propsData = {
        injectionMapping: {
          id: '142',
          processID: '42',
          extensionAreaID: 'EA_1',
          injectedProcess: {
            id: 'p1',
            name: 'Injected Process',
            svg: '<svg>p1</svg>'
          },
          contextSituation: {
            id: 'c1',
            name: 'My Context Situation 1'
          }
        }
      }
      store = {
        getters: {
          'contextSituation/contextSituationsByTags': [{
            value: '0',
            label: 'untagged',
            children: []
          }, {
            value: 't1',
            label: 'Tag 1',
            children: [{
              key: 'c1',
              label: 'My Context Situation 1',
              value: {
                id: 'c1',
                name: 'My Context Situation 1'
              }
            }, {
              key: 'c2',
              label: 'My Context Situation 2',
              value: {
                id: 'c2',
                name: 'My Context Situation 2'
              }
            }]
          }],
          'process/processesByTags': [{
            value: '0',
            label: 'untagged',
            children: []
          }, {
            value: 't1',
            label: 'Tag 1',
            children: [{
              key: 'p1',
              label: 'Injected Process 1',
              value: {
                id: 'p1',
                name: 'Injected Process 1',
                svg: '<svg>p1</svg>'
              }
            }, {
              key: 'p2',
              label: 'Injected Process 2',
              value: {
                id: 'p2',
                name: 'Injected Process 2',
                svg: '<svg>p2</svg>'
              }
            }]
          }]
        }
      }
      render()
    })

    function render() {
      cmp = mount(InjectionMapping, {
        i18n,
        propsData,
        mocks: {
          $store: store
        },
        stubs: {
          ProcessPreview: '<div class="process-preview-stub"></div>'
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    describe('it can handle a context situation', () => {
      let baseCmp
      beforeEach(() => {
        baseCmp = cmp
        cmp = cmp.findAll('.el-form-item').at(1)
      })

      it('renders a cascader for the context situation', () => {
        expect(cmp.contains('.el-cascader')).toBeTruthy()
      })

      it('preselects the context situation in the cascader', () => {
        expect(baseCmp.vm.currentContextSituation).toEqual(['t1', { 'id': 'c1', 'name': 'My Context Situation 1' }])
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('My Context Situation 1')
      })

      it('can change the context situation', () => {
        const cascader = cmp.find('.el-cascader')
        cascader.trigger('click')

        expect(cmp.html()).toMatchSnapshot()
        baseCmp.vm.currentContextSituation = ['0', {
          id: 'c2',
          name: 'My Context Situation 2'
        }]
        expect(cmp.html()).toMatchSnapshot()
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('My Context Situation 2')
      })

      describe('it has no context Situation', () => {
        beforeEach(() => {
          propsData.injectionMapping.contextSituation = undefined
          jest.clearAllMocks()
          render()
          baseCmp = cmp
          cmp = cmp.findAll('.el-form-item').at(1)
        })

        it('does not select the context Situation', () => {
          expect(baseCmp.vm.currentContextSituation).toEqual([])
          const input = cmp.find('.el-cascader__label')
          expect(input.text()).toEqual('')
        })

        it('shows a required error on save', () => {
          const button = baseCmp.find('.el-button--success')
          button.trigger('click')

          expect(InjectionMappingService.update).not.toHaveBeenCalled()
          expect(cmp.html()).toMatchSnapshot()
          const err = cmp.find('.el-form-item__error')
          expect(err.exists()).toBeTruthy()
          expect(err.text()).toEqual('injection_mapping.validation.context_situation.required')
        })

        it('does not find the context Situation', () => {
          propsData.injectionMapping.contextSituation = {
            id: 'c999',
            name: 'My not found CS'
          }
          render()
          baseCmp = cmp
          cmp = cmp.findAll('.el-form-item').at(1)

          expect(baseCmp.vm.currentContextSituation).toEqual([])
          const input = cmp.find('.el-cascader__label')
          expect(input.text()).toEqual('')
        })
      })
    })

    describe('it can handle a injected process', () => {
      let baseCmp
      beforeEach(() => {
        baseCmp = cmp
        cmp = cmp.findAll('.el-form-item').at(3)
      })

      it('renders a cascader for the injected process', () => {
        expect(cmp.contains('.el-cascader')).toBeTruthy()
      })

      it('preselects the injected process in the cascader', () => {
        expect(baseCmp.vm.currentInjectedProcess).toEqual(['t1', { 'id': 'p1', 'name': 'Injected Process 1', 'svg': '<svg>p1</svg>' }])
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('Injected Process 1')
      })

      it('renders a process preview', () => {
        const preview = baseCmp.find('.process-preview-stub')
        expect(preview.exists()).toBeTruthy()
        expect(preview.props('process')).toEqual({
          id: 'p1',
          name: 'Injected Process 1',
          svg: '<svg>p1</svg>'
        })
      })

      it('can change the injected process', () => {
        const cascader = cmp.find('.el-cascader')
        cascader.trigger('click')

        expect(cmp.html()).toMatchSnapshot()
        baseCmp.vm.currentInjectedProcess = ['0', {
          id: 'p2',
          name: 'Injected Process 2',
          svg: '<svg>p2</svg>'
        }]
        expect(cmp.html()).toMatchSnapshot()
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('Injected Process 2')
        const preview = baseCmp.find('.process-preview-stub')
        expect(preview.exists()).toBeTruthy()
        expect(preview.props('process')).toEqual({
          id: 'p2',
          name: 'Injected Process 2',
          svg: '<svg>p2</svg>'
        })
      })

      describe('it has no injected process', () => {
        beforeEach(() => {
          propsData.injectionMapping.injectedProcess = undefined
          jest.clearAllMocks()
          render()
          baseCmp = cmp
          cmp = cmp.findAll('.el-form-item').at(3)
        })

        it('does not select the injected process', () => {
          expect(baseCmp.vm.currentInjectedProcess).toEqual([])
          const input = cmp.find('.el-cascader__label')
          expect(input.text()).toEqual('')
        })

        it('does not render a process preview', () => {
          const preview = baseCmp.find('.process-preview-stub')
          expect(preview.exists()).toBeFalsy()
        })

        it('shows a required error on save', () => {
          const button = baseCmp.find('.el-button--success')
          button.trigger('click')

          expect(InjectionMappingService.update).not.toHaveBeenCalled()
          expect(cmp.html()).toMatchSnapshot()
          const err = cmp.find('.el-form-item__error')
          expect(err.exists()).toBeTruthy()
          expect(err.text()).toEqual('injection_mapping.validation.injected_process.required')
        })

        it('does not find the context Situation', () => {
          propsData.injectionMapping.currentInjectedProcess = {
            id: 'p999',
            name: 'My not found Process'
          }
          render()
          baseCmp = cmp
          cmp = cmp.findAll('.el-form-item').at(3)

          expect(baseCmp.vm.currentInjectedProcess).toEqual([])
          const input = cmp.find('.el-cascader__label')
          expect(input.text()).toEqual('')
        })
      })
    })

    it('has a save button', () => {
      expect(cmp.contains('.el-button--success')).toBeTruthy()
    })

    it('can save the injection specification', () => {
      const button = cmp.find('.el-button--success')
      button.trigger('click')

      expect(InjectionMappingService.update).toHaveBeenCalledWith(new InjectionMappingModel({
        '_id': '142',
        'context_situation': { '_id': 'c1', 'name': 'My Context Situation 1', 'rules': undefined, 'tags': [] },
        'extension_area_id': 'EA_1',
        'injected_process': {
          '_id': 'p1',
          'description': undefined,
          'name': 'Injected Process',
          'svg': '<svg>p1</svg>',
          'tags': [],
          'xml': undefined
        },
        'process_id': '42'
      }))
    })

    describe('can be deleted', () => {
      beforeEach(() => {
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: (arg) => {
            return {
              catch: () => {
              }
            }
          }
        }))
        InjectionMappingService.remove = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.$message = jest.fn()
      })
      InjectionMappingService.getByExtensionArea = jest.fn().mockImplementation(() => ({}
      ))
      it('deletes the active Injection Mapping', () => {
        InjectionMappingService.getAll = jest.fn().mockImplementation(() => {
        })
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: (arg) => {
            arg()
            return {
              catch: () => {
              }
            }
          }
        }))
        cmp.findAll('.el-button--danger').at(0).trigger('click')
        expect(InjectionMappingService.remove).toHaveBeenCalledWith(propsData.injectionMapping)
        expect(InjectionMappingService.getByExtensionArea).toHaveBeenCalled()
      })
      it('show as confirmation dialog', () => {
        expect(cmp.html()).toMatchSnapshot()
        const button = cmp.findAll('.el-button--danger').at(0)
        expect(button.exists()).toBeTruthy()
        button.trigger('click')
        expect(cmp.vm.$confirm).toHaveBeenCalledWith('injection_mapping.delete.message', 'injection_mapping.delete.warning',
          {
            'cancelButtonText': 'injection_mapping.delete.cancel',
            'confirmButtonText': 'injection_mapping.delete.ok',
            'type': 'warning',
            'cancelButtonClass': 'is-plain el-button--info',
            'confirmButtonClass': 'el-button--danger'
          })
      })
      it('does not delete the Injection mapping if canceled', () => {
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: () => {
            return {
              catch: (arg) => {
                arg()
              }
            }
          }
        }))
        cmp.findAll('.el-button--danger').at(0).trigger('click')
        expect(cmp.vm.$message).toHaveBeenCalledWith({
          'message': 'injection_mapping.delete.cancellation',
          'type': 'info'
        })
        expect(InjectionMappingService.remove).not.toHaveBeenCalled()
      })
    })
  })
})
