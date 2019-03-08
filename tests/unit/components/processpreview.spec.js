import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ProcessPreview from '@/components/ProcessPreview.vue'

describe('Components', () => {
  describe('ProcessPreview', () => {
    let propsData
    let cmp

    beforeEach(() => {
      propsData = {
        process: {
          id: '142',
          name: 'My Process',
          svg: '<svg height="256px"><path d="1"></path></svg>'
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ProcessPreview, {
        i18n,
        propsData
      })
    }

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.contains('iframe')).toBeTruthy()
    })

    it('renders the svg', () => {
      const iframe = cmp.find('iframe')
      expect(iframe.attributes('srcdoc')).toEqual(propsData.process.svg)
    })

    it('adjusts the height', () => {
      const iframe = cmp.find('iframe')
      expect(iframe.attributes('style')).toEqual('height: 281px;')
    })

    describe('it has no svg', () => {
      beforeEach(() => {
        propsData.process.svg = undefined
        render()
      })
      it('shows a text', () => {
        const iframe = cmp.find('iframe')
        expect(iframe.attributes('srcdoc')).toEqual('process.error_svg_preview')
      })

      it('adjusts the height', () => {
        const iframe = cmp.find('iframe')
        expect(iframe.attributes('style')).toEqual('height: auto;')
      })
    })

    describe('it has a very high svg', () => {
      beforeEach(() => {
        propsData.process.svg = '<svg height="512px"><path d="1"></path></svg>'
        render()
      })
      it('renders the svg', () => {
        const iframe = cmp.find('iframe')
        expect(iframe.attributes('srcdoc')).toEqual(propsData.process.svg)
      })

      it('adjusts the height', () => {
        const iframe = cmp.find('iframe')
        expect(iframe.attributes('style')).toEqual('height: 500px;')
      })
    })
  })
})
