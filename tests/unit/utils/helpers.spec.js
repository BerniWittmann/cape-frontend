import { convertHexToRgba } from '@/utils/helpers'

describe('Helpers', () => {
  describe('convertHexToRgba', () => {
    it('can convert a hex color to rgba', () => {
      expect(convertHexToRgba('#F3FF00')).toEqual('rgba(243, 255, 0, 1)')
      expect(convertHexToRgba('#F78F00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#F78F00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#FF0810')).toEqual('rgba(255, 8, 16, 1)')
    })

    it('can handle hex colors indifferent to case', () => {
      expect(convertHexToRgba('#f3ff00')).toEqual('rgba(243, 255, 0, 1)')
      expect(convertHexToRgba('#F78F00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#F78f00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#bF0810')).toEqual('rgba(191, 8, 16, 1)')
    })

    it('can specify the desired opacity', () => {
      expect(convertHexToRgba('#F3FF00', 0.3)).toEqual('rgba(243, 255, 0, 0.3)')
      expect(convertHexToRgba('#F78F00', 1)).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#F78F00', 0.5)).toEqual('rgba(247, 143, 0, 0.5)')
      expect(convertHexToRgba('#FF0810', 0)).toEqual('rgba(255, 8, 16, 0)')
    })
  })
})
