import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import DefaultLayout from '@/layouts/Default.vue'

import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'

describe('Layouts', () => {
  describe('Default', () => {
    it('renders the navigation', () => {
      const wrapper = shallowMount(DefaultLayout, {
        i18n
      })
      expect(wrapper.contains(Navigation)).toBeTruthy()
    })
    it('renders the footer', () => {
      const wrapper = shallowMount(DefaultLayout, {
        i18n
      })
      expect(wrapper.contains(Footer)).toBeTruthy()
    })
    it('renders the content', () => {
      const wrapper = shallowMount(DefaultLayout, {
        i18n,
        slots: {
          default: '<div class="test">hello</div>'
        }
      })
      expect(wrapper.html()).toContain('<div class="test">hello</div>')
    })
  })
})
