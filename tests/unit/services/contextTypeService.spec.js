import contextTypeService from '@/services/contextType'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import ContextType from '@/models/contextType'

store.dispatch = jest.fn()

const contextTypeData = {
  _id: '42',
  name: 'My ContextType',
  icon: 'fa-heart'
}

describe('Services', () => {
  describe('ContextType', () => {
    console.error = jest.fn()
    const notification = {
      error: jest.fn()
    }
    const message = {
      warning: jest.fn()
    }

    beforeEach(() => {
      moxios.install()
      notification.error = jest.fn()
      Vue.$notify = notification
      Vue.$message = message
      Vue.$http = axios
      Vue.i18n = {
        t: key => key
      }
    })

    afterEach(() => {
      moxios.uninstall()
    })

    it('exports all functions', () => {
      expect(contextTypeService.getAll).toEqual(expect.any(Function))
      expect(contextTypeService.create).toEqual(expect.any(Function))
      expect(contextTypeService.remove).toEqual(expect.any(Function))
    })

    describe('getAll', () => {
      it('should load all ContextTypes', (done) => {
        moxios.stubRequest('/context_types', {
          status: 200,
          response: [contextTypeData]
        })

        const onFulfilled = jest.fn()
        contextTypeService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextType/store', [new ContextType(contextTypeData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_types', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_types', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_types.get.failed.title',
            message: 'notifications.context_types.get.failed.message'
          })
          done()
        })
      })
    })

    describe('create', () => {
      it('should create a contextType', (done) => {
        moxios.stubRequest('/context_types', {
          status: 200,
          response: contextTypeData
        })

        const onFulfilled = jest.fn()
        contextTypeService.create({ name: 'Test', icon: 'fa-heart' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextType/add', new ContextType(contextTypeData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_types', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_types', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_type.post.failed.title',
            message: 'notifications.context_type.post.failed.message'
          })
          done()
        })
      })
    })

    describe('remove', () => {
      it('should remove a contextType', (done) => {
        moxios.stubRequest('/context_types/42', {
          status: 200,
          response: undefined
        })

        const onFulfilled = jest.fn()
        contextTypeService.remove({ id: '42', name: 'Test', icon: 'fa-heart' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('contextType/remove', { id: '42', name: 'Test', icon: 'fa-heart' })
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/context_types/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/context_types/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        contextTypeService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.context_type.delete.failed.title',
            message: 'notifications.context_type.delete.failed.message'
          })
          done()
        })
      })

      it('should handle context type in use', (done) => {
        moxios.stubRequest('/context_types/42', {
          status: 418
        })

        const onFulfilled = jest.fn()
        contextTypeService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(message.warning).toHaveBeenCalledWith('notifications.context_type.delete.not_allowed')
          done()
        })
      })
    })
  })
})
