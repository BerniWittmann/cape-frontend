import iMService from '@/services/injectionMapping'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import InjectionMapping from '@/models/injectionMapping'

store.dispatch = jest.fn().mockImplementation(() => ({
  then: (arg) => arg()
}))
const iMData = { _id: '12', extension_area_id: 'EA_1' }

describe('Services', () => {
  describe('Injection Mapping', () => {
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
      expect(iMService.getAll).toEqual(expect.any(Function))
      expect(iMService.getByExtensionArea).toEqual(expect.any(Function))
      expect(iMService.update).toEqual(expect.any(Function))
    })

    describe('getAll', () => {
      it('should load all Injection Mappings', (done) => {
        moxios.stubRequest('/injection_mappings', {
          status: 200,
          response: [iMData]
        })

        const onFulfilled = jest.fn()
        iMService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('injectionMapping/store', [new InjectionMapping(iMData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/injection_mappings', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/injection_mappings', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.injection_mappings.all.get.failed.title',
            message: 'notifications.injection_mappings.all.get.failed.message'
          })
          done()
        })
      })
    })

    describe('getByExtensionArea', () => {
      it('should load all matching Injection Mappings', (done) => {
        moxios.stubRequest('/injection_mappings?process_id=1&extension_area_id=EA_1', {
          status: 200,
          response: [iMData]
        })

        const onFulfilled = jest.fn()
        iMService.getByExtensionArea('1', 'EA_1').then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('injectionMapping/store', [new InjectionMapping(iMData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/injection_mappings', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/injection_mappings', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.injection_mappings.all.get.failed.title',
            message: 'notifications.injection_mappings.all.get.failed.message'
          })
          done()
        })
      })
    })

    describe('update', () => {
      it('should update a single injection Mapping', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 200,
          response: iMData
        })

        const onFulfilled = jest.fn()
        iMService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('injectionMapping/update', new InjectionMapping(iMData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.injection_mappings.single.put.failed.title',
            message: 'notifications.injection_mappings.single.put.failed.message'
          })
          done()
        })
      })

      it('should show notification on success', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 200
        })

        const onFulfilled = jest.fn()
        iMService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.success).toHaveBeenCalledWith({
            title: 'notifications.injection_mappings.single.put.success.title',
            message: 'notifications.injection_mappings.single.put.success.message'
          })
          done()
        })
      })
    })
    describe('remove', () => {
      it('should remove a Injection Mapping', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 200,
          response: undefined
        })
        const onFulfilled = jest.fn()
        iMService.remove({ id: '42', name: 'Test' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('injectionMapping/remove', { id: '42', name: 'Test' })
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/injection_mappings/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        iMService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.injection_mappings.single.delete.failed.title',
            message: 'notifications.injection_mappings.single.delete.failed.message'
          })
          done()
        })
      })
    })
  })
})
