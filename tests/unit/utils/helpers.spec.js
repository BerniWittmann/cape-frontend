import {
  convertHexToRgba,
  getCookie,
  hasProcessModelerRulesEnabled,
  removeByID,
  updateAndSetActive,
  getDeep,
  scrollToTop,
  hasCommonElement,
  decodeContextSituationRuleString,
  encodeContextSituationRuleString
} from '@/utils/helpers'
import { CONTEXT_SITUATION_RULES_CONNECTORS, CONTEXT_SITUATION_RULES_PART_TYPES } from '@/utils/constants'

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

  describe('getDeep', () => {
    let obj = {
      a: {
        b: {
          c: 42
        },
        d: {}
      },
      foo: 'bar'
    }
    it('can handle empty path', () => {
      expect(getDeep(obj, '')).toBeUndefined()
      expect(getDeep(obj, undefined)).toBeUndefined()
    })
    it('can handle empty object', () => {
      expect(getDeep(undefined, 'a')).toBeUndefined()
      expect(getDeep({}, 'a')).toBeUndefined()
    })
    it('can handle single depth path', () => {
      expect(getDeep(obj, 'a')).toEqual({
        b: { c: 42 },
        d: {}
      })
      expect(getDeep({ foo: 'bar' }, 'foo')).toEqual('bar')
    })
    it('can handle undefined on first depth', () => {
      expect(getDeep(obj, 'none')).toBeUndefined()
      expect(getDeep(obj, 'none.test')).toBeUndefined()
    })
    it('can handle undefined on deeper depth', () => {
      expect(getDeep(obj, 'a.none')).toBeUndefined()
      expect(getDeep(obj, 'a.none.test')).toBeUndefined()
      expect(getDeep(obj, 'foo.none')).toBeUndefined()
    })
    it('can find value on first depth', () => {
      expect(getDeep(obj, 'a')).toEqual({
        b: { c: 42 },
        d: {}
      })
      expect(getDeep(obj, 'foo')).toEqual('bar')
    })
    it('can find value on second depth', () => {
      expect(getDeep(obj, 'a.b')).toEqual({ c: 42 })
      expect(getDeep(obj, 'a.d')).toEqual({})
    })
    it('can find value on deeper depth', () => {
      expect(getDeep(obj, 'a.b.c')).toEqual(42)
    })
  })

  describe('scrollToTop', () => {
    it('scrolls to top', () => {
      const scrollTo = jest.fn()
      document.getElementById = jest.fn().mockReturnValue({
        scrollTo
      })

      scrollToTop()

      expect(document.getElementById).toHaveBeenCalledWith('app')
      expect(scrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })

    it('does not scroll if element not found', () => {
      const scrollTo = jest.fn()
      document.getElementById = jest.fn().mockReturnValue(undefined)

      scrollToTop()

      expect(document.getElementById).toHaveBeenCalledWith('app')
      expect(scrollTo).not.toHaveBeenCalled()
    })
  })

  describe('hasCommonElement', () => {
    it('returns false if any array is empty', () => {
      expect(hasCommonElement([], [])).toBeFalsy()
      expect(hasCommonElement([1, 2, 3], [])).toBeFalsy()
      expect(hasCommonElement([], [1, 2, 3])).toBeFalsy()
    })

    it('returns false if arrays dont have elements in common', () => {
      expect(hasCommonElement([1, 2, 3], [4, 5, 6])).toBeFalsy()
      expect(hasCommonElement([1, 5, 10], [3, 7])).toBeFalsy()
      expect(hasCommonElement(['a', 'c', 'e'], ['b', 'd', 'f'])).toBeFalsy()
    })

    it('returns true if arrays have elements in common', () => {
      expect(hasCommonElement([1, 2, 3], [1, 2, 3])).toBeTruthy()
      expect(hasCommonElement([1, 5, 10], [3, 7, 99, 42, 1])).toBeTruthy()
      expect(hasCommonElement([1, 7, 10], [7])).toBeTruthy()
      expect(hasCommonElement(['a', 'c', 'e'], ['b', 'd', 'e', 'f'])).toBeTruthy()
    })
  })

  describe('decodeContextSituationRuleString', () => {
    it('returns empty array if invalid string', () => {
      expect(decodeContextSituationRuleString(undefined)).toEqual([])
      expect(decodeContextSituationRuleString('')).toEqual([])
      expect(decodeContextSituationRuleString('Invalid String')).toEqual([])
      expect(decodeContextSituationRuleString('&& 5c758837bcf6fd47f203a8e5.5c758838bcf6fd47f203a8e6')).toEqual([])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5 12 5c758837bcf6fd47f203a8e5. te ')).toEqual([])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5.???? - 5c758837bcf6fd47f203a8e5.!!!')).toEqual([])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5 && 5c758838bcf6fd47f203a8e7')).toEqual([])
    })
    it('parses a single argument', () => {
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5.5c758838bcf6fd47f203a8e6')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e5', '5c758838bcf6fd47f203a8e6', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5.test')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e5', 'test', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e5.test_129aTE')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e5', 'test_129aTE', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('!5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e2')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e2', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
    })
    it('parses multiple arguments connected with connectors', () => {
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e1 && 5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e2')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e2', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('!5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e1 && !5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e2')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e1', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e2', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e1 || 5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e2')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.OR,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e2', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
      expect(decodeContextSituationRuleString('!5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e1 || !5c758837bcf6fd47f203a8e1.5c758838bcf6fd47f203a8e2')).toEqual([{
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e1', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.OR,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e1', '5c758838bcf6fd47f203a8e2', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])
    })
  })

  describe('encodeContextSituationRuleString', () => {
    it('returns an empty string if invalid array given', () => {
      expect(encodeContextSituationRuleString(undefined)).toEqual('')
      expect(encodeContextSituationRuleString([])).toEqual('')
      expect(encodeContextSituationRuleString({ foo: 'bar' })).toEqual('')
      expect(encodeContextSituationRuleString('invalid')).toEqual('')
    })
    it('can parse single arguments', () => {
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'HEAT', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.HEAT')
    })
    it('can handle negations', () => {
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('!5c758837bcf6fd47f203a8e1.TEST')
    })
    it('can parse multiple arguments connected with connectors', () => {
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST && !5c758837bcf6fd47f203a8e3.TEST1')
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.OR,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', true
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST || !5c758837bcf6fd47f203a8e3.TEST1')
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST && 5c758837bcf6fd47f203a8e3.TEST1')
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.OR,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST || 5c758837bcf6fd47f203a8e3.TEST1')
    })
    it('can handle undefined types', () => {
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: CONTEXT_SITUATION_RULES_CONNECTORS.AND,
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: { foo: 'bar' },
        type: 'invalid'
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST && 5c758837bcf6fd47f203a8e3.TEST1')
      expect(encodeContextSituationRuleString([{
        data: [
          '5c758837bcf6fd47f203a8e1', 'TEST', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }, {
        data: 'other_connector',
        type: CONTEXT_SITUATION_RULES_PART_TYPES.CON
      }, {
        data: [
          '5c758837bcf6fd47f203a8e3', 'TEST1', false
        ],
        type: CONTEXT_SITUATION_RULES_PART_TYPES.ARG
      }])).toEqual('5c758837bcf6fd47f203a8e1.TEST 5c758837bcf6fd47f203a8e3.TEST1')
    })
  })
})
