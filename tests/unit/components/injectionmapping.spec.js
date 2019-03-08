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
          injectedProcess: undefined,
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
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders a cascader for the context situation', () => {
      expect(cmp.contains('.el-cascader')).toBeTruthy()
    })

    it('preselects the context situation in the cascader', () => {
      expect(cmp.vm.currentContextSituation).toEqual(['t1', { 'id': 'c1', 'name': 'My Context Situation 1' }])
      const input = cmp.find('.el-cascader__label')
      expect(input.text()).toEqual('My Context Situation 1')
    })

    it('can change the context situation', () => {
      const cascader = cmp.find('.el-cascader')
      cascader.trigger('click')

      expect(cmp.html()).toMatchSnapshot()
      cmp.vm.currentContextSituation = ['0', {
        id: 'c2',
        name: 'My Context Situation 2'
      }]
      expect(cmp.html()).toMatchSnapshot()
      const input = cmp.find('.el-cascader__label')
      expect(input.text()).toEqual('My Context Situation 2')
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
          '_id': undefined,
          'description': undefined,
          'name': undefined,
          'svg': undefined,
          'tags': [],
          'xml': undefined
        },
        'process_id': '42'
      }))
    })

    describe('it has no context Situation', () => {
      beforeEach(() => {
        propsData.injectionMapping.contextSituation = undefined
        jest.clearAllMocks()
        render()
      })

      it('does not select the context Situation', () => {
        expect(cmp.vm.currentContextSituation).toEqual([])
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('')
      })

      it('shows a required error on save', () => {
        const button = cmp.find('.el-button--success')
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

        expect(cmp.vm.currentContextSituation).toEqual([])
        const input = cmp.find('.el-cascader__label')
        expect(input.text()).toEqual('')
      })
    })
  })
})
