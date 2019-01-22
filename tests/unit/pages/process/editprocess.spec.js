import { shallowMount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'
import moment from 'moment'
import EditProcess from '@/pages/process/EditProcess.vue'
import ProcessInfoForm from '@/components/process/ProcessInfoForm.vue'
import EmptySlotComponent from '../../EmptySlotComponent.vue'
import { Button } from 'element-ui'
import ProcessService from '@/services/process'
import Process from '@/models/process'

jest.mock('bpmn-js/lib/Modeler', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      importXML: jest.fn(),
      saveXML: jest.fn(),
      saveSVG: jest.fn()
    }
  })
})
jest.mock('@/plugins/bpmn/modules', () => [])
jest.mock('@/plugins/bpmn/moddleExtensions', () => [])

describe('Pages', () => {
  describe('EditProcess.vue', () => {
    let store
    let router
    let route
    let cmp

    const date = moment(moment().utc())

    beforeEach(() => {
      router = {
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn()
      }
      route = {
        name: 'process.edit',
        params: {}
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
            },
            processes: [{
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
            }, { id: '2' }]
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
          $router: router,
          $route: route
        },
        stubs: {
          'v-layout': EmptySlotComponent,
          'el-tooltip': EmptySlotComponent,
          'el-button': Button,
          ProcessModeler: '<div id="modeler"></div>'
        }
      })
      cmp.vm.$refs.processModeler.validate = jest.fn()
      cmp.vm.$refs.processModeler.reloadXML = jest.fn()
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })
    it('renders the process info form', () => {
      expect(cmp.contains(ProcessInfoForm)).toBeTruthy()
    })
    it('can reset the process', () => {
      cmp.vm.$refs.processInfoForm.setFormPristine = jest.fn()
      ProcessService.get = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      cmp.vm.reset()

      expect(ProcessService.get).toHaveBeenCalled()
      expect(cmp.vm.$refs.processInfoForm.setFormPristine).toHaveBeenCalled()
      expect(cmp.vm.$refs.processModeler.reloadXML).toHaveBeenCalled()
    })
    it('can save the process', () => {
      cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
        cb(store.state.process.activeProcess)
      })
      cmp.vm.reset = jest.fn()
      ProcessService.update = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      cmp.vm.submit()

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

      cmp.vm.submit()

      expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
      expect(ProcessService.update).not.toHaveBeenCalled()
      expect(cmp.vm.reset).not.toHaveBeenCalled()
    })

    it('validates the process structure', () => {
      cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
        cb(store.state.process.activeProcess)
      })
      cmp.vm.reset = jest.fn()
      ProcessService.update = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))
      cmp.vm.$refs.processInfoForm.$emit('submit-process')

      expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
      expect(cmp.vm.$refs.processModeler.validate).toHaveBeenCalled()
      expect(ProcessService.update).toHaveBeenCalled()
      expect(cmp.vm.reset).toHaveBeenCalled()
    })
    it('shows an error when the process structure validation fails', () => {
      cmp.vm.$message.error = jest.fn()
      cmp.vm.$refs.processModeler.validate = jest.fn().mockImplementation(() => {
        throw (new Error('my_error'))
      })
      cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
        cb(store.state.process.activeProcess)
      })
      cmp.vm.reset = jest.fn()
      ProcessService.update = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))

      cmp.vm.$refs.processInfoForm.$emit('submit-process')

      expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
      expect(cmp.vm.$refs.processModeler.validate).toHaveBeenCalled()
      expect(ProcessService.update).not.toHaveBeenCalled()
      expect(cmp.vm.reset).not.toHaveBeenCalled()
      expect(cmp.vm.$message.error).toHaveBeenCalledWith('process.edit.process_validation_errors.my_error')
    })

    it('does free the process on route Leave', () => {
      ProcessService.free = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))
      const next = jest.fn()

      expect(cmp.vm.$options.beforeRouteLeave).toEqual(expect.any(Function))
      cmp.vm.$options.beforeRouteLeave.bind({ process: { id: 12 } })({}, {}, next)

      expect(ProcessService.free).toHaveBeenCalledWith({ id: 12 })
      expect(next).toHaveBeenCalled()
    })

    describe('it can create a new process', () => {
      beforeEach(() => {
        route.name = 'process.new'
        render()
      })

      it('renders', () => {
        expect(cmp.html()).toMatchSnapshot()
      })

      it('works on an empty process', () => {
        expect(cmp.vm.process).not.toEqual(store.state.process.activeProcess)
        expect(cmp.vm.process).toEqual(new Process())
      })

      it('does not create the process if validation failed', () => {
        cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
          cb()
        })
        ProcessService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))

        cmp.vm.submit()

        expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
        expect(ProcessService.create).not.toHaveBeenCalled()
      })

      it('creates a new process', () => {
        cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb({ name: 'my new Process Name', tags: [] })
        })
        ProcessService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))

        cmp.vm.submit()

        expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
        expect(ProcessService.create).toHaveBeenCalled()
      })

      it('goes to the edit route after creating a process', () => {
        cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb({ name: 'my new Process Name', tags: [] })
        })
        ProcessService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))

        cmp.vm.submit()

        expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
        expect(router.replace).toHaveBeenCalledWith({
          name: 'process.edit',
          params: {
            processID: '2'
          }
        })
      })

      it('validates the process structure', () => {
        cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb({ name: 'my new Process Name', tags: [] })
        })
        ProcessService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))

        cmp.vm.$refs.processInfoForm.$emit('submit-process')

        expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
        expect(cmp.vm.$refs.processModeler.validate).toHaveBeenCalled()
        expect(ProcessService.create).toHaveBeenCalled()
      })
      it('shows an error when the process structure validation fails', () => {
        cmp.vm.$message.error = jest.fn()
        cmp.vm.$refs.processModeler.validate = jest.fn().mockImplementation(() => {
          throw (new Error('my_error'))
        })
        cmp.vm.$refs.processInfoForm.submit = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb({ name: 'my new Process Name', tags: [] })
        })
        ProcessService.create = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))

        cmp.vm.$refs.processInfoForm.$emit('submit-process')

        expect(cmp.vm.$refs.processInfoForm.submit).toHaveBeenCalled()
        expect(cmp.vm.$refs.processModeler.validate).toHaveBeenCalled()
        expect(ProcessService.create).not.toHaveBeenCalled()
        expect(cmp.vm.$message.error).toHaveBeenCalledWith('process.edit.process_validation_errors.my_error')
      })

      it('if it has route data it initializes the process with the route data', () => {
        route.params.processData = {
          name: 'My Name!',
          xml: '<xml>My Process!</xml>'
        }
        render()
        expect(cmp.vm.name).toEqual('My Name!')
        expect(cmp.vm.processData.xml).toEqual('<xml>My Process!</xml>')
        expect(cmp.vm.process.name).toEqual('My Name!')
        expect(cmp.vm.process.xml).toEqual('<xml>My Process!</xml>')
      })

      it('does not free the process on route Leave', () => {
        ProcessService.free = jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
        const next = jest.fn()

        expect(cmp.vm.$options.beforeRouteLeave).toEqual(expect.any(Function))
        cmp.vm.$options.beforeRouteLeave.bind({ process: {} })({}, {}, next)

        expect(ProcessService.free).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
      })
    })
  })
})
