import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import moment from 'moment'
import { Button, Dialog } from 'element-ui'

import Tag from '@/components/Tag.vue'
import ProcessPreviewDialog from '@/dialogs/ProcessPreviewDialog.vue'
import ProcessService from '@/services/process'

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

    describe('can be deleted', () => {
      beforeEach(() => {
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: (arg) => {
            return {
              catch: () => {}
            }
          }
        }))
        ProcessService.remove = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        cmp.vm.$message = jest.fn()
      })
      it('show as confirmation dialog', () => {
        expect(cmp.html()).toMatchSnapshot()
        const button = cmp.findAll('elrow-stub button').at(1)
        expect(button.exists()).toBeTruthy()
        button.trigger('click')
        expect(cmp.vm.$confirm).toHaveBeenCalledWith('process.delete.message', 'process.delete.warning',
          {
            'cancelButtonText': 'process.delete.cancel',
            'confirmButtonText': 'process.delete.ok',
            'type': 'warning',
            'cancelButtonClass': 'is-plain el-button--info',
            'confirmButtonClass': 'el-button--danger'
          })
      })
      it('deletes the process on confirm  ', () => {
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: (arg) => {
            arg()
            return {
              catch: () => {
              }
            }
          }
        }))
        cmp.findAll('elrow-stub button').at(1).trigger('click')
        expect(ProcessService.remove).toHaveBeenCalledWith(store.state.process.activeProcess)
        expect(cmp.vm.$message).toHaveBeenCalledWith({ 'message': 'process.delete.confirmation', 'type': 'success' })
        expect(router.back).toHaveBeenCalled()
      })
      it('deletes the process on confirm  ', () => {
        cmp.vm.$confirm = jest.fn().mockImplementation(() => ({
          then: () => {
            return {
              catch: (arg) => {
                arg()
              }
            }
          }
        }))
        cmp.findAll('elrow-stub button').at(1).trigger('click')
        expect(cmp.vm.$message).toHaveBeenCalledWith({ 'message': 'process.delete.cancellation', 'type': 'info' })
      })
    })
  })
})
