import processService from '@/services/process'
import moxios from 'moxios'
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import store from '@/vuex/store'
import Process from '@/models/process'

store.dispatch = jest.fn().mockImplementation(() => ({
  then: (arg) => arg()
}))

const date = moment()

const processData = {
  _id: '42',
  name: 'My Process',
  created_at: date.clone().subtract(2, 'days').toISOString(),
  last_edited_at: date.clone().subtract(1, 'days').toISOString(),
  tags: [{
    _id: '3',
    name: 'First Tag',
    color: '#FF0000'
  }, {
    _id: '4',
    name: 'Second Tag',
    color: '#FFFF00'
  }]
}

describe('Services', () => {
  describe('Process', () => {
    console.error = jest.fn()
    const notification = {
      error: jest.fn()
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

    it('exports all functions', () => {
      expect(processService.getAll).toEqual(expect.any(Function))
      expect(processService.addTag).toEqual(expect.any(Function))
      expect(processService.get).toEqual(expect.any(Function))
      expect(processService.removeTag).toEqual(expect.any(Function))
      expect(processService.update).toEqual(expect.any(Function))
    })

    describe('getAll', () => {
      it('should load all Processes', (done) => {
        moxios.stubRequest('/processes', {
          status: 200,
          response: [processData]
        })

        const onFulfilled = jest.fn()
        processService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/store', [new Process(processData)])
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.getAll().then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.processes.get.failed.title',
            message: 'notifications.processes.get.failed.message'
          })
          done()
        })
      })
    })

    describe('get', () => {
      it('should load a single Process', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 200,
          response: processData
        })

        const onFulfilled = jest.fn()
        processService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/update', new Process(processData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.get({ id: 42 }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.get.failed.title',
            message: 'notifications.process.get.failed.message'
          })
          done()
        })
      })
    })

    describe('addTag', () => {
      it('should add a Tag to a Process', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 200,
          response: processData
        })

        const onFulfilled = jest.fn()
        processService.addTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/update', new Process(processData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.addTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.addTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.tags.post.failed.title',
            message: 'notifications.process.tags.post.failed.message'
          })
          done()
        })
      })
    })

    describe('removeTag', () => {
      it('should remove a Tag from a Process', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 200,
          response: processData
        })

        const onFulfilled = jest.fn()
        processService.removeTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/update', new Process(processData))
          expect(store.dispatch).toHaveBeenCalledWith('process/setActive', new Process(processData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.removeTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes/42/tags', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.removeTag({ id: 42 }, { name: 'test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.tags.delete.failed.title',
            message: 'notifications.process.tags.delete.failed.message'
          })
          done()
        })
      })
    })

    describe('update', () => {
      it('should update a single Process', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 200,
          response: processData
        })

        const onFulfilled = jest.fn()
        processService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/update', new Process(processData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.update({ id: 42, foo: 'bar' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.put.failed.title',
            message: 'notifications.process.put.failed.message'
          })
          done()
        })
      })
    })

    describe('create', () => {
      it('should create a process', (done) => {
        moxios.stubRequest('/processes', {
          status: 200,
          response: processData
        })

        const onFulfilled = jest.fn()
        processService.create({ name: 'Test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/add', new Process(processData))
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.create({}).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.post.failed.title',
            message: 'notifications.process.post.failed.message'
          })
          done()
        })
      })
    })

    describe('remove', () => {
      it('should remove a process', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 200,
          response: undefined
        })

        const onFulfilled = jest.fn()
        processService.remove({ id: '42', name: 'Test', color: '#FF0000' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(store.dispatch).toHaveBeenCalledWith('process/remove', { id: '42', name: 'Test', color: '#FF0000' })
          done()
        })
      })

      it('should handle fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          done()
        })
      })

      it('should show notification on fail', (done) => {
        moxios.stubRequest('/processes/42', {
          status: 400
        })

        const onFulfilled = jest.fn()
        processService.remove({ id: '42' }).then(onFulfilled)

        moxios.wait(() => {
          expect(onFulfilled).toHaveBeenCalled()
          expect(notification.error).toHaveBeenCalledWith({
            title: 'notifications.process.delete.failed.title',
            message: 'notifications.process.delete.failed.message'
          })
          done()
        })
      })
    })
  })
})
