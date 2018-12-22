import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ContextType from '@/components/ContextType.vue'

// TODO add .toBe(true) to exists

describe('Components', () => {
  describe('ContextType', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        contextType: {
          id: '142',
          name: 'My ContextType',
          icon: 'fa-heart'
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ContextType, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
      const contextTypeComponent = cmp.find('.context-type')
      expect(contextTypeComponent.exists()).toBeTruthy()
    })

    it('renders the name', () => {
      expect(cmp.text()).toEqual('My ContextType')
    })

    it('renders the icon', () => {
      expect(cmp.find('.context-type').exists()).toBeTruthy()
      expect(cmp.find('.fa').exists()).toBeTruthy()
      expect(cmp.find('.fa-lg').exists()).toBeTruthy()
      expect(cmp.find('.fa-heart').exists()).toBeTruthy()
    })

    it('can handle an undefined icon', () => {
      cmp.setProps({
        contextType: {
          id: '123',
          name: 'My ContextType'
        }
      })
      expect(cmp.find('.context-type').exists()).toBeTruthy()
      expect(cmp.find('.fa').exists()).toBeTruthy()
      expect(cmp.find('.fa-lg').exists()).toBeTruthy()
    })

    it('is not closeable by default', () => {
      const tagComponent = cmp.find('div')
      expect(tagComponent.exists()).toBeTruthy()
      expect(tagComponent.props('closable')).toEqual(false)
    })

    it('can be closable', () => {
      cmp.setProps({
        closable: true
      })
      expect(cmp.find('.el-icon-close').exists()).toBeTruthy()
      const tagComponent = cmp.find('div')
      expect(tagComponent.exists()).toBeTruthy()
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
