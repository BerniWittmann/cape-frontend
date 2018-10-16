import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import About from '@/pages/About.vue'

import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Pages', () => {
  describe('About', () => {
    it('renders', () => {
      const wrapper = shallowMount(About, {
        i18n,
        stubs: {
          'v-layout': EmptySlotComponent
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
