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
      expect(cFService.getAll).toEqual(expect.any(Function))
      expect(cFService.get).toEqual(expect.any(Function))
      expect(cFService.update).toEqual(expect.any(Function))
      expect(cFService.remove).toEqual(expect.any(Function))
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

    describe('get', () => {
      it('should load a single contextFactor', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 200,
          response: cFData
        })

        const onFulfilled = jest.fn()
        cFService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextFactor/update', new ContextFactor(cFData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_factors.single.get.failed.title',
            message: 'notifications.context_factors.single.get.failed.message'
          })
          done()
        })
      })
    })

    describe('update', () => {
      it('should update a single context Factor', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 200,
          response: cFData
        })

        const onFulfilled = jest.fn()
        cFService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextFactor/update', new ContextFactor(cFData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_factors.single.put.failed.title',
            message: 'notifications.context_factors.single.put.failed.message'
          })
          done()
        })
      })

      it('should show notification on success', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 200
        })

        const onFulfilled = jest.fn()
        cFService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.success).toHaveBeenCalledWith({
            title: 'notifications.context_factors.single.put.success.title',
            message: 'notifications.context_factors.single.put.success.message'
          })
          done()
        })
      })
    })

    describe('create', () => {
      it('should create a context factor', (done) => {
        moxios.stubRequest('/context_factors', {
          status: 200,
          response: cFData
        })

        const onFulfilled = jest.fn()
        cFService.create({ name: 'Test' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextFactor/add', new ContextFactor(cFData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_factors', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_factors', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_factors.all.post.failed.title',
            message: 'notifications.context_factors.all.post.failed.message'
          })
          done()
        })
      })

      it('should show notification on success', (done) => {
        moxios.stubRequest('/context_factors', {
          status: 200,
          response: cFData
        })

        const onFulfilled = jest.fn()
        cFService.create({ name: 'Test' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.success).toHaveBeenCalledWith({
            title: 'notifications.context_factors.all.post.success.title',
            message: 'notifications.context_factors.all.post.success.message'
          })
          done()
        })
      })
    })
    describe('remove', () => {
      it('should remove a contextFactor', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 200,
          response: undefined
        })
        const onFulfilled = jest.fn()
        cFService.remove({ id: '42', name: 'Test' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextFactor/remove', { id: '42', name: 'Test' })
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_factors/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        cFService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_factors.single.delete.failed.title',
            message: 'notifications.context_factors.single.delete.failed.message'
          })
          done()
        })
      })
    })
  })
})
