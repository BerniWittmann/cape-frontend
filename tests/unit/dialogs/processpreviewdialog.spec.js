import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import moment from 'moment'
import { Button, Dialog } from 'element-ui'

import Tag from '@/components/Tag.vue'
import ProcessPreviewDialog from '@/dialogs/ProcessPreviewDialog.vue'

describe('Dialogs', () => {
  describe('Process Preview Dialog', () => {
    let store
    let cmp

    const date = moment(moment().utc())
    const router = {
      back: jest.fn(),
      push: jest.fn()
    }
    const route = {
      params: {
        processID: 42
      }
    }
    beforeEach(() => {
      store = {
        state: {
          process: {
            activeProcess: {
              id: '1',
              name: 'My Process',
              createdAt: date.clone().subtract(14, 'days'),
              lastEditedAt: date.clone().subtract(2, 'days'),
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
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ProcessPreviewDialog, {
        i18n,
        mocks: {
          $store: store,
          $router: router,
          $route: route
        },
        stubs: {
          ElButton: Button,
          ElDialog: Dialog
        }
      })
    }

    it('can render', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('can render tags', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)
      expect(tags.at(0).props('tag')).toEqual(store.state.process.activeProcess.tags[0])
      expect(tags.at(1).props('tag')).toEqual(store.state.process.activeProcess.tags[1])
    })

    it('can show the name', () => {
      expect(cmp.find('.el-dialog__title').text()).toEqual(store.state.process.activeProcess.name)
    })

    it('can be closed', () => {
      expect(cmp.html()).toMatchSnapshot()
      cmp.find('.el-dialog__header button').trigger('click')
      expect(router.back).toHaveBeenCalled()
    })

    it('can be edited', () => {
      expect(cmp.html()).toMatchSnapshot()
      const button = cmp.find('elrow-stub button')
      expect(button.exists()).toBeTruthy()
      button.trigger('click')
      expect(router.push).toHaveBeenCalledWith({
        name: 'process.edit',
        params: route.params
      })
    })
  })
})
