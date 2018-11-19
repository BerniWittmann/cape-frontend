import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Tag from '@/components/Tag.vue'

describe('Components', () => {
  describe('Tag', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        tag: {
          id: '142',
          name: 'My Tag',
          color: '#FF0000'
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(Tag, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
    })

    it('renders the name', () => {
      expect(cmp.text()).toEqual('My Tag')
    })

    it('renders the color', () => {
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
      expect(tagComponent.attributes('style')).toEqual('background-color: rgba(255, 0, 0, 0.1); color: rgb(255, 0, 0);')
      expect(tagComponent.attributes('type')).toEqual('info')
    })

    it('can handle an undefined color', () => {
      cmp.setProps({
        tag: {
          id: '123',
          name: 'My Tag'
        }
      })
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
      expect(tagComponent.attributes('style')).toEqual('')
      expect(tagComponent.attributes('type')).toEqual('info')
    })

    it('passes the size', () => {
      cmp.setProps({
        size: 'mini'
      })
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
      expect(tagComponent.props('size')).toEqual('mini')
    })

    it('is not closeable by default', () => {
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
      expect(tagComponent.props('closable')).toEqual(false)
    })

    it('can be closable', () => {
      cmp.setProps({
        closable: true
      })
      const tagComponent = cmp.find('eltag-stub')
      expect(tagComponent.exists())
      expect(tagComponent.props('closable')).toEqual(true)
    })

    it('emits a close event on close', () => {
      cmp.setProps({
        closable: true
      })
      expect(cmp.emitted().close).toBeFalsy()

      cmp.vm.emitClose()

      expect(cmp.emitted().close).toBeTruthy()
    })
  })
})
