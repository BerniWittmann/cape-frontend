import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Settings from '@/pages/Settings.vue'

import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Pages', () => {
  describe('Settings', () => {
    it('renders', () => {
      const wrapper = shallowMount(Settings, {
        i18n,
        stubs: {
          'v-layout': EmptySlotComponent
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
