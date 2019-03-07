import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import InjectionMapping from '@/components/InjectionMapping.vue'

describe('Components', () => {
  describe('InjectionMapping', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        injectionMapping: {
          id: '142',
          processID: '42',
          extensionAreaID: 'EA_1',
          injectedProcess: undefined,
          contextSituation: undefined
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(InjectionMapping, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })
  })
})
