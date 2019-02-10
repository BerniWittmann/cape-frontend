import cSService from '@/services/contextSituation'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import ContextSituation from '@/models/contextSituation'

store.dispatch = jest.fn().mockImplementation(() => ({
  then: (arg) => arg()
}))
const cSData = { name: 'My Context Situation' }

describe('Services', () => {
  describe('Context Situation', () => {
    console.error = jest.fn()
    const notification = {
      error: jest.fn(),
      success: jest.fn()
    }
    beforeEach(() => {
      moxios.install()
      notification.error = jest.fn()
      Vue.$notify = notification
      Vue.$message = jest.fn()
      Vue.$http = axios
      Vue.i18n = {
        t: key => key
      }
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('exports all functions', () => {
      expect(cSService.getAll).toEqual(expect.any(Function))
      expect(cSService.get).toEqual(expect.any(Function))
    })

    describe('getAll', () => {
      it('should load all Context Situations', (done) => {
        moxios.stubRequest('/context_situations', {
          status: 200,
          response: [cSData]
        })

        const onFulfilled = jest.fn()
        cSService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextSituation/store', [new ContextSituation(cSData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_situations', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cSService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_situations', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cSService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_situations.all.get.failed.title',
            message: 'notifications.context_situations.all.get.failed.message'
          })
          done()
        })
      })
    })

    describe('get', () => {
      it('should load a single contextSituation', (done) => {
        moxios.stubRequest('/context_situations/42', {
          status: 200,
          response: cSData
        })

        const onFulfilled = jest.fn()
        cSService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextSituation/update', new ContextSituation(cSData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_situations/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cSService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_situations/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cSService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_situations.single.get.failed.title',
            message: 'notifications.context_situations.single.get.failed.message'
          })
          done()
        })
      })
    })
  })
})
