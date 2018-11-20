import processService from '@/services/process'
import moxios from 'moxios'
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import store from '@/vuex/store'
import Process from '@/models/process'

store.dispatch = jest.fn()

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
  })
})
