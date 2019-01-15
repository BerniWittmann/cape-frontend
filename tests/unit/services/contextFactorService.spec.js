import cFService from '@/services/contextFactor'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import ContextFactor from '@/models/contextFactor'

store.dispatch = jest.fn().mockImplementation(() => ({
  then: (arg) => arg()
}))
const cFData = { name: 'My Context Factor' }

describe('Services', () => {
  describe('Context Factor', () => {
    console.error = jest.fn()
    const notification = {
      error: jest.fn(),
      success: jest.fn()
    }

    beforeEach(() => {
      moxios.install()
      notification.error = jest.fn()
      Vue.$notify = notification
      Vue.$http = axios
      Vue.i18n = {
        t: key => key
      }
    })

    afterEach(() => {
      moxios.uninstall()
    })
    describe('getAll', () => {
      it('should load all Context Factors', (done) => {
        moxios.stubRequest('/context_factors', {
          status: 200,
          response: [cFData]
        })

        const onFulfilled = jest.fn()
        cFService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextFactor/store', [new ContextFactor(cFData)])
          done()
        })
      })
    })
  })
})
