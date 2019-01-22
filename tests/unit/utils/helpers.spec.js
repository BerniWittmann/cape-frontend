import { convertHexToRgba, getCookie, hasProcessModelerRulesEnabled, removeByID, updateAndSetActive } from '@/utils/helpers'

describe('Helpers', () => {
  describe('convertHexToRgba', () => {
    it('can convert a hex color to rgba', () => {
      expect(convertHexToRgba('#F3FF00')).toEqual('rgba(243, 255, 0, 1)')
      expect(convertHexToRgba('#F78F00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#F78F00')).toEqual('rgba(247, 143, 0, 1)')
      expect(convertHexToRgba('#FF0810')).toEqual('rgba(255, 8, 16, 1)')
      expect(convertHexToRgba('#FFFFFF')).toEqual('rgba(255, 255, 255, 1)')
      expect(convertHexToRgba('#000000')).toEqual('rgba(0, 0, 0, 1)')
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

  describe('getCookie', () => {
    beforeEach(() => {
      // Unset Cookies
      document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      document.cookie = 'other=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      document.cookie = 'wrong=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    })
    it('can get a cookie by name', () => {
      document.cookie = 'test=my_value'
      expect(getCookie('test')).toEqual('my_value')
    })
    it('can get correct cookie by name', () => {
      document.cookie = 'other=foo;'
      document.cookie = 'test=my_value;'
      document.cookie = 'wrong=bar;'
      expect(getCookie('test')).toEqual('my_value')
    })
    it('returns nothing if no cookies available', () => {
      expect(getCookie('test')).toEqual(undefined)
    })
    it('returns nothing if cookie is not available', () => {
      document.cookie = 'other=foo;'
      document.cookie = 'wrong=bar;'
      expect(getCookie('test')).toEqual(undefined)
    })
  })

  describe('hasProcessModelerRulesEnabled', () => {
    beforeEach(() => {
      // Unset Cookies
      document.cookie = 'enableProcessValidation=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    })
    it('returns true if cookie is set to true', () => {
      document.cookie = 'enableProcessValidation=true;'
      expect(hasProcessModelerRulesEnabled()).toBeTruthy()
    })
    it('returns false if cookie is set to false', () => {
      document.cookie = 'enableProcessValidation=false;'
      expect(hasProcessModelerRulesEnabled()).toBeFalsy()
    })
    it('returns true if cookie is not set ', () => {
      document.cookie = 'enableProcessValidation=true;'
      expect(hasProcessModelerRulesEnabled()).toBeTruthy()
    })
  })

  describe('removeByID', () => {
    it('removes element by id', () => {
      expect(removeByID([{ id: 1 }, { id: 2 }, { id: 3 }], 2)).toEqual([{ id: 1 }, { id: 3 }])
    })
    it('removes multplie elements by id', () => {
      expect(removeByID([{ id: 1 }, { id: 2 }, { id: 1 }], 1)).toEqual([{ id: 2 }])
    })
    it('returns empty array on empty array', () => {
      expect(removeByID([], 2)).toEqual([])
    })

    it('returns array if nothing can be removed', () => {
      expect(removeByID([{ id: 1 }, { id: 2 }, { id: 3 }], 99)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
  })

  describe('updateAndSetActive', () => {
    class Test {
      constructor({ _id }) {
        this.id = _id
        this.foo = 'bar'
      }
    }
    let store = {}

    beforeEach(() => {
      store.dispatch = jest.fn().mockImplementation(() => ({
        then: (arg) => arg()
      }))
    })

    it('updates the data in the store', () => {
      updateAndSetActive(store, { _id: 12 }, Test, 'test')
      expect(store.dispatch).toHaveBeenCalledWith('test/update', new Test({ _id: 12 }))
    })

    it('sets the data active', () => {
      updateAndSetActive(store, { _id: 42 }, Test, 'other_module')
      expect(store.dispatch).toHaveBeenCalledWith('other_module/setActive', new Test({ _id: 42 }))
    })
  })
})
