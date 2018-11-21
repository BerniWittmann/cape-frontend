import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'
import moment from 'moment'
import EditProcess from '@/pages/process/EditProcess.vue'
import ProcessInfoForm from '@/components/process/ProcessInfoForm.vue'
import EmptySlotComponent from '../../EmptySlotComponent.vue'
import { Button } from 'element-ui'
import ProcessService from '@/services/process'

describe('Pages', () => {
  describe('EditProcess.vue', () => {
    let store
    let router
    let cmp

    const date = moment(moment().utc())

    beforeEach(() => {
      router = {
        push: jest.fn(),
        back: jest.fn()
      }
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
          },
          tag: {
            tags: [{
              id: '42',
              name: 'First Tag',
              color: '#FF0000'
            }, {
              id: '43',
              name: 'Second Tag',
              color: '#FFFF00'
            }, {
              id: '44',
              name: 'Third Tag',
              color: '#0FFF00'
            }]
          }
        },
        dispatch: jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
      }
      render()
    })

    function render() {
      cmp = shallowMount(EditProcess, {
        i18n,
        mocks: {
          $store: store,
          $router: router
        },
        stubs: {
          'v-layout': EmptySlotComponent,
          'el-tooltip': EmptySlotComponent,
          'el-button': Button
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('shows the title', () => {
      const title = cmp.find('.process-edit__title')
      expect(title.exists()).toBeTruthy()
      expect(title.text()).toContain('process.edit.back process.edit.title')
    })
    it('has a back button', () => {
      const button = cmp.find('.process-edit__title button')
      expect(button.exists()).toBeTruthy()
      button.trigger('click')
      expect(router.back).toHaveBeenCalled()
    })
    it('renders the process info form', () => {
      expect(cmp.contains(ProcessInfoForm)).toBeTruthy()
    })
    it('has a save and a reset button', () => {
      const buttons = cmp.findAll('elrow-stub button')
      expect(buttons.length).toEqual(2)

      expect(buttons.at(0).text()).toContain('save')
      expect(buttons.at(1).text()).toContain('reset')
    })
    it('can reset the process', () => {
      cmp.vm.$refs.processInfoForm.setFormPristine = jest.fn()
      ProcessService.get = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      const button = cmp.findAll('elrow-stub button').at(1)
      button.trigger('click')

      expect(ProcessService.get).toHaveBeenCalled()
      expect(cmp.vm.$refs.processInfoForm.setFormPristine).toHaveBeenCalled()
    })
    it('can save the process', () => {
      cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
        cb(store.state.process.activeProcess)
      })
      cmp.vm.reset = jest.fn()
      ProcessService.update = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      const button = cmp.findAll('elrow-stub button').at(0)
      button.trigger('click')

      expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
      expect(ProcessService.update).toHaveBeenCalled()
      expect(cmp.vm.reset).toHaveBeenCalled()
    })
    it('does not save the process if validation failed', () => {
      cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
        cb()
      })
      cmp.vm.reset = jest.fn()
      ProcessService.update = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      const button = cmp.findAll('elrow-stub button').at(0)
      button.trigger('click')

      expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
      expect(ProcessService.update).not.toHaveBeenCalled()
      expect(cmp.vm.reset).not.toHaveBeenCalled()
    })
    it('unsets the active process on destroy', () => {
      cmp.destroy()

      expect(store.dispatch).toHaveBeenCalledWith('process/unsetActive')
    })
  })
})
