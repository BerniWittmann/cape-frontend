import { mount } from '@vue/test-utils'
import { i18n } from '../../setupPlugins'
import { ColorPicker } from 'element-ui'

import TagSettings from '@/components/settings/TagSettings.vue'
import Tag from '@/components/Tag.vue'

import tagService from '@/services/tag'

describe('Components', () => {
  describe('TagSettings', () => {
    let store
    let cmp

    tagService.remove = jest.fn()
    tagService.create = jest.fn().mockImplementation(() => ({
      then: (arg) => arg()
    }))

    beforeEach((done) => {
      store = {
        state: {
          tag: {
            tags: [{
              id: '142',
              name: 'My Tag',
              color: '#FF0000'
            }, {
              id: '3',
              name: 'My Second Tag',
              color: '#FF00FF'
            }]
          }
        }
      }
      render(done)
    })

    function render(done) {
      cmp = mount(TagSettings, {
        i18n,
        mocks: {
          $store: store
        },
        sync: false
      })
      cmp.vm.$nextTick(done)
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })

    it('renders the available Tags', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)
      expect(tags.at(0).props('tag')).toEqual(store.state.tag.tags[0])
      expect(tags.at(1).props('tag')).toEqual(store.state.tag.tags[1])
    })
    it('the existing tags can be deleted', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)
      expect(tags.at(0).props('closable')).toBeTruthy()
      expect(tags.at(1).props('tag')).toBeTruthy()

      tags.at(1).vm.$emit('close')

      expect(tagService.remove).toHaveBeenCalledWith(store.state.tag.tags[1])
    })
    it('does not display the tag preview if no name given', () => {
      const tags = cmp.findAll(Tag)
      expect(tags.length).toEqual(2)
    })
    it('displays a preview of the tag', (done) => {
      cmp.find('input').setValue('My Name')
      cmp.vm.tag.color = '#FFFF00'

      cmp.vm.$nextTick(() => {
        const tags = cmp.findAll(Tag)
        expect(tags.length).toEqual(3)
        expect(tags.at(2).props('tag')).toEqual({
          color: '#FFFF00',
          name: 'My Name'
        })
        done()
      })
    })
    it('shows an error if no name given on submit', (done) => {
      console.warn = jest.fn()
      cmp.vm.submit()

      cmp.vm.$nextTick(() => {
        const warning = cmp.find('.el-form-item__error')
        expect(warning.exists()).toBeTruthy()
        expect(warning.text()).toContain('settings.tag.validation.name.required')
        done()
      })
    })
    it('shows an error if no color given on submit', (done) => {
      console.warn = jest.fn()
      cmp.find('input').setValue('My Name')
      cmp.vm.tag.color = undefined
      cmp.vm.submit()

      cmp.vm.$nextTick(() => {
        const warning = cmp.find('.el-form-item__error')
        expect(warning.exists()).toBeTruthy()
        expect(warning.text()).toContain('settings.tag.validation.color.required')
        done()
      })
    })
    it('shows a color picker', () => {
      expect(cmp.contains(ColorPicker)).toBeTruthy()
    })
    it('validates the form on submit', (done) => {
      cmp.vm.submit()

      cmp.vm.$nextTick(() => {
        expect(cmp.contains('.el-form-item__error')).toBeTruthy()
        done()
      })
    })
    it('the form has a submit and a cancel button', () => {
      expect(cmp.findAll('.el-form-item > .el-form-item__content > .el-button').length).toEqual(2)
    })
    it('the form can be reset', () => {
      cmp.find('input').setValue('My Name')
      cmp.vm.tag.color = '#FFF000'
      expect(cmp.vm.tag.name).toEqual('My Name')

      cmp.vm.reset()

      expect(cmp.vm.tag.name).toEqual(undefined)
      expect(cmp.vm.tag.color).toEqual('#6CC9E8')
    })
    it('the form can be submitted', (done) => {
      cmp.find('input').setValue('My new Name')
      cmp.vm.tag.color = '#FFF000'
      cmp.vm.submit()

      cmp.vm.$nextTick(() => {
        expect(tagService.create).toHaveBeenCalledWith({
          _id: undefined,
          color: '#FFF000',
          name: 'My new Name'
        })
        done()
      })
    })
    it('the form is reset after submitting', (done) => {
      cmp.find('input').setValue('My new Name')
      cmp.vm.tag.color = '#FFF000'
      cmp.vm.submit()

      cmp.vm.$nextTick(() => {
        expect(cmp.vm.tag.color).toEqual('#6CC9E8')
        expect(cmp.vm.tag.name).toEqual(undefined)
        done()
      })
    })
  })
})
