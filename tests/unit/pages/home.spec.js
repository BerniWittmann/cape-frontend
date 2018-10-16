import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Home from '@/pages/Home.vue'

import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Pages', () => {
  describe('Home.vue', () => {
    it('renders', () => {
      const wrapper = shallowMount(Home, {
        i18n,
        stubs: {
          'v-layout': EmptySlotComponent
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
