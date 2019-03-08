import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import moment from 'moment'
import { Button, Dialog } from 'element-ui'

import ExtensionAreaEditDialog from '@/dialogs/ExtensionAreaEditDialog.vue'
import InjectionMapping from '@/components/InjectionMapping'

describe('Dialogs', () => {
  describe('Extension Area Edit Dialog', () => {
    let store
    let cmp

    const date = moment(moment().utc())
    const router = {
      back: jest.fn(),
      push: jest.fn()
    }
    const route = {
      params: {
        processID: 42,
        extensionAreaID: 'EA_1',
        title: 'My Title'
      }
    }
    let injections = []
    beforeEach(() => {
      injections = [{
        id: '1',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar',
        injectedProcess: {
          id: 'p1',
          name: 'Process 1'
        },
        contextSituation: {
          id: 'cs1',
          name: 'Context Situation 1'
        }
      }, {
        id: '2',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar2',
        injectedProcess: {
          id: 'p2',
          name: 'Process 2'
        },
        contextSituation: {
          id: 'cs2',
          name: 'Context Situation 2'
        }
      }]
      store = {
        state: {
          process: {
            activeProcess: {
              id: '1',
              name: 'My Process',
              createdAt: date.clone().subtract(14, 'days'),
              lastEditedAt: date.clone().subtract(2, 'days'),
              svg: 'text height="30" more text="even more Text"',
              description: 'My Description',
              xml: '<?xml version="1.0" encoding="UTF-8"?><bpmn:Process>Test Process</bpmn:Process>',
              tags: [{
                id: '42',
                name: 'First Tag',
                color: '#FF0000'
              }, {
                id: '43',
                name: 'Second Tag',
                color: '#FFFF00'
              }]
            }
          }
        },
        getters: {
          'injectionMapping/getInjectionMappings': jest.fn().mockReturnValue(injections)
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ExtensionAreaEditDialog, {
        i18n,
        mocks: {
          $store: store,
          $router: router,
          $route: route
        },
        stubs: {
          ElButton: Button,
          ElDialog: Dialog,
          ElCollapseItem: '<div class="el-collapse-item"><div class="title"><slot name="title"></slot></div><div class="content"><slot></slot></div></div>'
        }
      })
    }

    it('can render', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('can be closed', () => {
      expect(cmp.html()).toMatchSnapshot()
      cmp.find('.el-dialog__header button').trigger('click')
      expect(router.back).toHaveBeenCalled()
    })

    it('displays the title from the route params', () => {
      expect(cmp.find('.el-dialog__title').text()).toEqual('My Title')
    })

    it('displays a fallback if title is not given via route params', () => {
      route.params.title = undefined
      render()
      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.find('.el-dialog__title').text()).toEqual('extension_area.title')
    })

    it('renders the injection mappings', () => {
      expect(store.getters['injectionMapping/getInjectionMappings']).toHaveBeenCalledWith(42, 'EA_1')
      const ims = cmp.findAll(InjectionMapping)
      expect(ims.length).toEqual(2)
      expect(ims.at(0).props('injectionMapping')).toEqual({
        id: '1',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar',
        injectedProcess: {
          id: 'p1',
          name: 'Process 1'
        },
        contextSituation: {
          id: 'cs1',
          name: 'Context Situation 1'
        }
      })
      expect(ims.at(1).props('injectionMapping')).toEqual({
        id: '2',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar2',
        injectedProcess: {
          id: 'p2',
          name: 'Process 2'
        },
        contextSituation: {
          id: 'cs2',
          name: 'Context Situation 2'
        }
      })
    })

    it('renders a title for the injection mappings', (done) => {
      let items = cmp.findAll('.el-collapse-item')
      expect(items.length).toEqual(2)
      expect(items.at(0).find('.title').text()).toEqual('Context Situation 1  Process 1')
      expect(items.at(1).find('.title').text()).toEqual('Context Situation 2  Process 2')

      injections.push({
        id: '3',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar2',
        injectedProcess: undefined,
        contextSituation: undefined
      })
      injections.push({
        id: '4',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar2',
        injectedProcess: {
          id: 'p2',
          name: 'Process 2'
        },
        contextSituation: undefined
      })
      injections.push({
        id: '5',
        processID: '1',
        extensionAreaID: 'EA_1',
        foo: 'bar2',
        injectedProcess: undefined,
        contextSituation: {
          id: 'cs2',
          name: 'Context Situation 2'
        }
      })
      render()

      cmp.vm.$nextTick(() => {
        items = cmp.findAll('.el-collapse-item')
        expect(items.length).toEqual(5)
        expect(items.at(2).find('.title').text()).toEqual('injection_mapping.undefined_contextSituation  injection_mapping.undefined_injectedProcess')
        expect(items.at(3).find('.title').text()).toEqual('injection_mapping.undefined_contextSituation  Process 2')
        expect(items.at(4).find('.title').text()).toEqual('Context Situation 2  injection_mapping.undefined_injectedProcess')
        done()
      })
    })
  })
})
