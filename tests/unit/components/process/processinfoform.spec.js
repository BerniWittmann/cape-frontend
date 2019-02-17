import moment from 'moment'
import { mount, config } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import InputEdit from '@/components/InputEdit.vue'
import ProcessInfoForm from '@/components/process/ProcessInfoForm.vue'
import TagEditor from '@/components/TagEditor.vue'

describe('Components', () => {
  describe('ProcessInfoForm', () => {
    let store
    let propsData
    let cmp
    config.stubs.transition = false

    const date = moment(moment().utc())
    console.warn = jest.fn()

    // mock the random function to get always the same id for working snapshots
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.5
    global.Math = mockMath

    beforeEach((done) => {
      jest.useRealTimers()
      store = {
        state: {
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
            }, {
              id: '45',
              name: 'Fourth Tag',
              color: '#00FFF0'
            }]
          }
        },
        dispatch: jest.fn().mockImplementation(() => ({
          then: (arg) => arg()
        }))
      }
      propsData = {
        process: {
          id: '1',
          name: 'My Process',
          description: 'My Description',
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
        isNewProcess: false
      }
      render(done)
    })

    function render(done) {
      cmp = mount(ProcessInfoForm, {
        i18n,
        propsData,
        mocks: {
          $store: store
        },
        sync: false
      })
      cmp.vm.$nextTick(() => {
        done()
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })
    it('renders the correct title', () => {
      expect(cmp.find('.title span').find('span').exists()).toBeTruthy()
      expect(cmp.find('.title span').find('span').text()).toEqual('process.edit.title')
    })
    it('renders an input field for the description', () => {
      const input = cmp.find('textarea')
      expect(input.exists()).toBeTruthy()
      input.setValue('My new Name')
      expect(cmp.vm.data.description).toEqual('My new Name')
    })
    it('renders the tag editor', () => {
      expect(cmp.contains(TagEditor)).toBeTruthy()
    })
    it('renders the input edit component for the name', () => {
      const input = cmp.find(InputEdit)
      expect(input.exists()).toBeTruthy()
    })
    it('allows to edit the input for the title', (done) => {
      const editTitleButton = cmp.find('button.black-color')
      expect(editTitleButton.exists).toBeTruthy()
      editTitleButton.trigger('click')
      cmp.vm.$nextTick(() => {
        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.find('.el-input__inner').exists).toBeTruthy()
        done()
      })
    })
    it('hides the input after editing title', (done) => {
      const editTitleButton = cmp.find('button.black-color')
      expect(editTitleButton.exists).toBeTruthy()

      editTitleButton.trigger('click')
      cmp.vm.$nextTick(() => {
        expect(cmp.html()).toMatchSnapshot()
        const input = cmp.find('.el-input__inner')
        input.setValue('My new Process Name')
        input.trigger('keyup', { key: 'Enter' })
        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
      })
    })
    it('does not the input after editing the title to an invalid state', (done) => {
      const editTitleButton = cmp.find('button.black-color')
      expect(editTitleButton.exists).toBeTruthy()

      editTitleButton.trigger('click')
      cmp.vm.$nextTick(() => {
        expect(cmp.html()).toMatchSnapshot()
        const input = cmp.find('.el-input__inner')
        input.setValue('My new Process Name')
        input.trigger('keyup', { key: 'Enter' })
        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
      })
    })
    it('checks the input to not be empty', (done) => {
      const editTitleButton = cmp.find('button.black-color')

      editTitleButton.trigger('click')
      cmp.vm.$nextTick(() => {
        expect(cmp.html()).toMatchSnapshot()
        const input = cmp.find('.el-input__inner')
        input.setValue('')
        input.trigger('keypress', { key: 'Enter' })
        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.find('.el-input__inner').exists).toBeTruthy()
        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
      })
    })
    describe('works in edit mode as expected', () => {
      it('renders correct title prefix', () => {
        expect(cmp.findAll('.title').at(1).exists()).toBeTruthy()
        expect(cmp.findAll('.title').at(1).text()).toEqual(propsData.process.name)
      })
      it('has back, reset and save button', () => {
        const buttons = cmp.findAll('button.right-space')
        expect(buttons.length).toEqual(3)

        expect(buttons.at(0).text()).toContain('back')
        expect(buttons.at(1).text()).toContain('reset')
        expect(buttons.at(2).text()).toContain('save')
      })
    })
    describe('works in new process as expected', () => {
      it('renders correct title prefix', (done) => {
        propsData.process.name = ''
        propsData.isNewProcess = true
        render(() => {
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
        expect(cmp.vm.nameInputVisible).toBeTruthy()
        expect(cmp.find('.title span').find('span').exists()).toBeTruthy()
        expect(cmp.find('.title span').find('span').text()).toEqual('process.add.title')
      })
      it('has back and save button but no reset button', (done) => {
        propsData.isNewProcess = true
        render(() => {
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
        const buttons = cmp.findAll('button.right-space')
        expect(buttons.length).toEqual(2)

        expect(buttons.at(0).text()).toContain('back')
        expect(buttons.at(1).text()).toContain('save')
      })
    })
    describe('has a function to validate the form', () => {
      it('has the function defined', () => {
        expect(cmp.vm.submit).toEqual(expect.any(Function))
      })
      it('submits the result if valid', () => {
        cmp.vm.$refs.processForm.validate = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb(true)
        })
        cmp.vm.submit((result) => {
          expect(result).toEqual({
            'name': 'My Process',
            'description': 'My Description',
            'tags': [{
              'color': '#FF0000',
              'id': '42',
              'name': 'First Tag'
            }, {
              'color': '#FFFF00',
              'id': '43',
              'name': 'Second Tag'
            }]
          })
        })
      })
      it('does not submit if its not valid', () => {
        cmp.vm.$refs.processForm.validate = jest.fn().mockImplementation((cb) => {
          // eslint-disable-next-line standard/no-callback-literal
          cb(false)
        })
        cmp.vm.submit((result) => {
          expect(result).toEqual(undefined)
        })
      })
    })
    describe('has a function to reset the form validation state', () => {
      it('has the function defined', () => {
        expect(cmp.vm.setFormPristine).toEqual(expect.any(Function))
      })
      it('resets the Form', () => {
        cmp.vm.$refs.processForm.resetFields = jest.fn()
        cmp.vm.setFormPristine()
        expect(cmp.vm.$refs.processForm.resetFields).toHaveBeenCalled()
      })
    })
    it('handles a change from the external process', (done) => {
      cmp.setProps({
        process: {
          name: 'New Prop Name',
          description: 'My Description',
          tags: []
        }
      })
      cmp.vm.$nextTick(() => {
        expect(cmp.vm.data.name).toEqual('New Prop Name')
        expect(cmp.vm.data.tags).toEqual([])
        expect(cmp.vm.data.description).toEqual('My Description')
        done()
      })
    })
  })
})
