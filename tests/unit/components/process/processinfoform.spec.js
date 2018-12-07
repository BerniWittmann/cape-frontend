import moment from 'moment'
import { mount, config, TransitionStub } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'

import ProcessInfoForm from '@/components/process/ProcessInfoForm.vue'
import Tag from '@/components/Tag.vue'

describe('Components', () => {
  describe('ProcessInfoForm', () => {
    let store
    let propsData
    let cmp
    config.stubs.transition = false

    const date = moment(moment().utc())
    console.warn = jest.fn()

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

    function renderWithoutSelect() {
      config.stubs.transition = TransitionStub
      cmp = mount(ProcessInfoForm, {
        i18n,
        propsData,
        stubs: {
          'el-select': '<div></div>'
        },
        mocks: {
          $store: store
        }
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
    it('renders the tags', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)
      expect(tags.at(0).props('tag')).toEqual(propsData.process.tags[0])
      expect(tags.at(1).props('tag')).toEqual(propsData.process.tags[1])
    })
    it('allows to edit the input for the title', (done) => {
      // cmp.setMethods({ showInput: jest.fn() })
      const editTitleButton = cmp.find('button.black-color')
      expect(cmp.vm.nameInputVisible).not.toBeTruthy()
      expect(editTitleButton.exists).toBeTruthy()
      editTitleButton.trigger('click')
      expect(cmp.vm.nameInputVisible).toBeTruthy()
      // expect(cmp.vm.showInput).toHaveBeenCalled()
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
        expect(cmp.vm.data.name).toEqual('My new Process Name')
        expect(cmp.vm.nameInputVisible).toBeTruthy()
        input.trigger('keyup', { key: 'Enter' })
        expect(cmp.vm.nameInputVisible).not.toBeTruthy()
        done()
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
        done()
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
        propsData.process.name = undefined
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
    describe('it can add a tag', () => {
      it('has a addTag Button', () => {
        const addButton = cmp.find('.tag-space')
        expect(addButton.exists()).toBeTruthy()
      })
      it('can shows the option on new tag button click', (done) => {
        cmp.findAll('.tag-space').at(1).trigger('click')
        cmp.vm.$nextTick(() => {
          expect(cmp.html()).toMatchSnapshot()
          const options = cmp.findAll('.el-select-dropdown li')
          expect(options.length).toEqual(2)
          expect(options.at(0).text()).toEqual(store.state.tag.tags[2].name)
          expect(options.at(1).text()).toEqual(store.state.tag.tags[3].name)
          done()
        })
      })
      it('adds the new tag on click', (done) => {
        cmp.findAll('.tag-space').at(1).trigger('click')
        cmp.vm.$nextTick(() => {
          cmp.find('.el-select-dropdown li').trigger('click')
          expect(propsData.process.tags.length).toEqual(3)
          expect(propsData.process.tags[2]).toEqual(store.state.tag.tags[2])
          done()
        })
      })
      it('adds a tag just once', () => {
        expect(cmp.vm.process.tags.length).toEqual(2)
        cmp.vm.newTag = cmp.vm.process.tags[0]
        cmp.vm.addTag()
        expect(cmp.vm.process.tags.length).toEqual(2)
      })
      it('closes the dropdown after adding A Tag', (done) => {
        cmp.vm.tagInputVisible = true
        cmp.vm.$nextTick(() => {
          jest.useFakeTimers()

          cmp.vm.hideTagInput()

          jest.runOnlyPendingTimers()

          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            done()
          })
        })
      })
    })
    it('can remove a tag', () => {
      renderWithoutSelect()
      const tag = cmp.findAll(Tag).at(1)
      tag.vm.$emit('close')

      expect(cmp.vm.data.tags.length).toEqual(1)
    })
    it('hides the add tag button if no tags are available', (done) => {
      store.state.tag.tags = [store.state.tag.tags[0], store.state.tag.tags[1]]
      render(() => {
        expect(cmp.html()).toMatchSnapshot()
        done()
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
