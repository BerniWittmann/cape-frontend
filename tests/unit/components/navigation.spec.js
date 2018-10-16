import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Navigation from '@/components/Navigation.vue'

describe('Components', () => {
  describe('Navigation', () => {
    it('renders', () => {
      const wrapper = shallowMount(Navigation, {
        i18n,
        stubs: {
          RouterLink: RouterLinkStub
        },
        mocks: {
          $route: {
            name: 'home'
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
    it('loads the correct route Name', () => {
      const wrapper = shallowMount(Navigation, {
        i18n,
        stubs: {
          RouterLink: RouterLinkStub
        },
        mocks: {
          $route: {
            name: 'home'
          }
        }
      })
      expect(wrapper.vm.activeRoute).toEqual('home')
    })
  })
})
