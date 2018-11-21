import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import EmptyRouterView from '@/layouts/EmptyRouterView.vue'
import EmptySlotComponent from '../EmptySlotComponent.vue'

describe('Layouts', () => {
  describe('EmptyRouterView', () => {
    it('renders', () => {
      const wrapper = shallowMount(EmptyRouterView, {
        i18n,
        stubs: {
          'router-view': EmptySlotComponent
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
