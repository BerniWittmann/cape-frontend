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
        }
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

    it('renders an input field for the name', () => {
      const input = cmp.find('input')
      expect(input.exists()).toBeTruthy()
      input.setValue('My new Name')
      expect(cmp.vm.data.name).toEqual('My new Name')
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
    describe('it can add a tag', () => {
      it('has a addTag Button', () => {
        const addButton = cmp.find('.button-new-tag')
        expect(addButton.exists()).toBeTruthy()
      })
      it('can shows the option on new tag button click', (done) => {
        cmp.find('.button-new-tag').trigger('click')
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
        cmp.find('.button-new-tag').trigger('click')
        cmp.vm.$nextTick(() => {
          cmp.find('.el-select-dropdown li').trigger('click')
          expect(propsData.process.tags.length).toEqual(3)
          expect(propsData.process.tags[2]).toEqual(store.state.tag.tags[2])
          done()
        })
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
