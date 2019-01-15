import { shallowMount } from '@vue/test-utils'
import { i18n } from '../setupPlugins'

import ContextFactors from '@/pages/ContextFactors.vue'

describe('Pages', () => {
  describe('ContextFactors.vue', () => {
    let store
    let router
    let message
    let cmp

    beforeEach(() => {
      router = {
        push: jest.fn()
      }
      message = {
        error: jest.fn()
      }
      store = {
        getters: {
          'contextFactor/contextFactorsTree': [
            {
              label: 'Pizza Donalds',
              contextFactor: {
                attributes: [],
                id: '5c3c83a5a0983a6a94272513',
                name: 'Pizza Donalds',
                __v: 0
              },
              children: [
                {
                  label: 'Oven',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272514',
                    name: 'Oven',
                    parentID: '5c3c83a5a0983a6a94272513',
                    __v: 0
                  },
                  children: [{
                    label: 'Telephone',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272516',
                      name: 'Telephone',
                      parentID: '5c3c83a5a0983a6a94272513',
                      __v: 0
                    },
                    children: []
                  }, {
                    label: 'Temperature Sensor',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272517',
                      name: 'Temperature Sensor',
                      parentID: '5c3c83a5a0983a6a94272514',
                      __v: 0
                    },
                    children: []
                  }, {
                    label: 'Serial Number',
                    contextFactor: {
                      attributes: [],
                      id: '5c3c83a5a0983a6a94272518',
                      name: 'Serial Number',
                      parentID: '5c3c83a5a0983a6a94272514',
                      __v: 0
                    },
                    children: []
                  }]
                }, {
                  label: 'Fryer',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272515',
                    name: 'Fryer',
                    parentID: '5c3c83a5a0983a6a94272513',
                    __v: 0
                  },
                  children: []
                }, {
                  label: 'Ventilator',
                  contextFactor: {
                    attributes: [],
                    id: '5c3c83a5a0983a6a94272519',
                    name: 'Ventilator',
                    parentID: '5c3c83a5a0983a6a94272514',
                    __v: 0
                  },
                  children: []
                }
              ]
            }
          ]
        }
      }
      render()
    })

    function render() {
      cmp = shallowMount(ContextFactors, {
        i18n,
        mocks: {
          $store: store,
          $router: router,
          $message: message
        }
      })
    }

    it('renders the tree', () => {
      expect(cmp.html()).toMatchSnapshot()
      expect(cmp.contains('eltree-stub')).toBeTruthy()
    })

    it('renders all contextFactors', () => {
      const data = cmp.find('eltree-stub').props('data')
      expect(data).toEqual(expect.any(Array))
      expect(data.length).toBeGreaterThan(0)
    })

    it('has an edit button', () => {
      cmp.vm.edit(store.getters['contextFactor/contextFactorsTree'][0])
      expect(router.push).toHaveBeenCalledWith({
        name: 'context_factors.edit',
        params: {
          contextFactorID: '5c3c83a5a0983a6a94272513'
        }
      })
    })
  })
})
