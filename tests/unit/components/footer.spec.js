import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import Footer from '@/components/Footer.vue'

jest.mock('@/../package.json', () => ({
  version: '2.1.0'
}))

describe('Components', () => {
  describe('Footer', () => {
    it('renders', () => {
      const wrapper = shallowMount(Footer, {
        i18n,
        stubs: {
          RouterLink: RouterLinkStub
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
    it('loads the correct package version', () => {
      const wrapper = shallowMount(Footer, {
        i18n,
        stubs: {
          RouterLink: RouterLinkStub
        }
      })
      expect(wrapper.vm.version).toEqual('2.1.0')
    })
  })
})
