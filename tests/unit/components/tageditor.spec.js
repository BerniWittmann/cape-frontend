import { shallowMount, config, TransitionStub } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import { Select, Option, Button } from 'element-ui'

import TagEditor from '@/components/TagEditor.vue'
import Tag from '@/components/Tag.vue'

describe('Components', () => {
  describe('TagEditor', () => {
    let propsData
    let cmp
    let state
    config.stubs.transition = TransitionStub

    beforeEach(() => {
      propsData = {
        tags: [{
          id: '142',
          name: 'My Tag',
          color: '#FF0FF0'
        }, {
          id: '666',
          name: 'Tag From Hell',
          color: '#FF0000'
        }]
      }
      state = {
        tag: {
          tags: [{
            id: '142',
            name: 'My Tag',
            color: '#FF0FF0'
          }, {
            id: '666',
            name: 'Tag From Hell',
            color: '#FF0000'
          }, {
            id: '999',
            name: 'Last Tag',
            color: '#F0F0F0'
          }, {
            id: '1',
            name: 'First Tag',
            color: '#F1F300'
          }]
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(TagEditor, {
        i18n,
        propsData,
        mocks: {
          $store: {
            state
          }
        },
        stubs: {
          'ElSelect': Select,
          'ElOption': Option
        }
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders the tags', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)

      for (let i = 0; i < 2; i++) {
        const tag = tags.at(i)
        expect(tag.props('tag')).toEqual(propsData.tags[i])
        expect(tag.props('closable')).toEqual(true)
      }
    })

    it('if no tags sets it renders no tags', () => {
      cmp.setProps({ tags: [] })
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(0)
    })

    it('can remove a tag', () => {
      const expected = [propsData.tags[0]]
      const tag = cmp.findAll(Tag).at(1)
      console.error = jest.fn()
      tag.vm.$emit('close')
      console.error.mockRestore()

      expect(cmp.emitted().change).toBeTruthy()
      expect(cmp.emitted().change[0]).toEqual([expected])

      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(1)
      expect(tags.at(0).props('tag')).toEqual(expected[0])
    })

    describe('it can add a tag', () => {
      jest.useFakeTimers()

      it('it has a button to add tags', () => {
        expect(cmp.contains(Button)).toBeTruthy()
      })

      it('can show the option on new tag button click', (done) => {
        const btn = cmp.find(Button)
        btn.vm.$emit('click')

        expect.assertions(2)
        cmp.vm.$nextTick(() => {
          expect(cmp.vm.tagInputVisible).toBeTruthy()
          expect(cmp.html()).toMatchSnapshot()
          done()
        })
      })
      it('only shows available tags', (done) => {
        const btn = cmp.find(Button)
        btn.vm.$emit('click')

        cmp.vm.$nextTick(() => {
          const options = cmp.findAll('.el-select-dropdown__item')
          expect(options.length).toEqual(2)
          for (let i = 0; i < 2; i++) {
            const tag = options.at(i).find(Tag)
            expect(tag.exists()).toBeTruthy()
            expect(tag.props('tag')).toEqual(state.tag.tags[2 + i])
          }
          done()
        })
      })
      it('adds the new tag on click', (done) => {
        const btn = cmp.find(Button)
        btn.vm.$emit('click')

        cmp.vm.$nextTick(() => {
          const option = cmp.findAll('.el-select-dropdown__item').at(1)
          expect(option.exists()).toBeTruthy()
          option.trigger('click')

          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            done()
          })
        })
      })
      it('adds a tag', () => {
        cmp.vm.$refs.tagSelect = { blur: jest.fn() }
        const expected = [state.tag.tags[0], state.tag.tags[1], state.tag.tags[3]]
        cmp.vm.newTag = state.tag.tags[3]
        cmp.vm.addTag()
        expect(cmp.vm.selectedTags).toEqual(expected)
        expect(cmp.html()).toMatchSnapshot()
        expect(cmp.findAll(Tag).at(2).props('tag')).toEqual(state.tag.tags[3])
        expect(cmp.emitted().change).toBeTruthy()
        expect(cmp.emitted().change[0][0]).toEqual(expected)
        expect(cmp.vm.$refs.tagSelect.blur).toHaveBeenCalled()
      })
      it('adds a tag just once', () => {
        cmp.vm.newTag = cmp.vm.tags[0]
        cmp.vm.addTag()
        expect(cmp.vm.tags.length).toEqual(2)
        expect(cmp.emitted().change).toBeFalsy()
      })
      it('closes the dropdown after adding A Tag', (done) => {
        const btn = cmp.find(Button)
        btn.vm.$emit('click')

        cmp.vm.$nextTick(() => {
          const select = cmp.find(Select)
          select.vm.$emit('blur')

          jest.runOnlyPendingTimers()

          cmp.vm.$nextTick(() => {
            expect(cmp.html()).toMatchSnapshot()
            done()
          })
        })
      })
    })
    it('hides the add tag button if no tags are available', () => {
      state.tag.tags = [state.tag.tags[0], state.tag.tags[1]]
      render()

      expect(cmp.contains(Button)).toBeFalsy()
    })
  })
})
