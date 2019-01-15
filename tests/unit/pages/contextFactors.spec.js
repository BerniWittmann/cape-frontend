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
        state: {
          contextFactor: {
            contextFactors: [{
              attributes: [],
              id: '5c3c83a5a0983a6a94272513',
              name: 'Pizza Donalds',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272514',
              name: 'Oven',
              parentID: '5c3c83a5a0983a6a94272513',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272515',
              name: 'Fryer',
              parentID: '5c3c83a5a0983a6a94272513',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272516',
              name: 'Telephone',
              parentID: '5c3c83a5a0983a6a94272513',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272517',
              name: 'Temperature Sensor',
              parentID: '5c3c83a5a0983a6a94272514',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272518',
              name: 'Serial Number',
              parentID: '5c3c83a5a0983a6a94272514',
              __v: 0
            }, {
              attributes: [],
              id: '5c3c83a5a0983a6a94272519',
              name: 'Ventilator',
              parentID: '5c3c83a5a0983a6a94272514',
              __v: 0
            }]
          }
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

    it('renders', () => {
      expect(cmp.html()).toMatchSnapshot()
    })
  })
})
