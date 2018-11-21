import { makeRequest } from '@/services/base'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'

store.dispatch = jest.fn()

describe('BaseService', () => {
  describe('makeRequest', () => {
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
    describe('it can handle different methods', () => {
      const methods = ['get', 'post', 'put', 'patch', 'delete']
      methods.forEach((method) => {
        it(`can make a ${method} request to an endpoint`, (done) => {
          makeRequest({
            method: method,
            endpoint: '/test',
            name: 'test'
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            expect(request.config.method).toEqual(method)
            request.respondWith({
              status: 200,
              response: {
                foo: 'bar'
              }
            }).then(function () {
              done()
            })
          })
        })

        it(`shows an error message for ${method}`, (done) => {
          makeRequest({
            method: method,
            endpoint: '/test',
            name: 'test'
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
              status: 400
            }).then(function () {
              expect(notification.error).toHaveBeenCalledWith({
                title: `notifications.test.${method}.failed.title`,
                message: `notifications.test.${method}.failed.message`
              })
              done()
            })
          })
        })

        it(`logs the error message for ${method}`, (done) => {
          makeRequest({
            method: method,
            endpoint: '/test',
            name: 'test'
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
              status: 400
            }).then(function () {
              expect(console.error).toHaveBeenCalled()
              done()
            })
          })
        })
      })
    })

    describe('it can pass data', () => {
      const methods = ['post', 'put', 'patch']
      methods.forEach((method) => {
        it(`can make a ${method} request to an endpoint with data`, (done) => {
          makeRequest({
            method: method,
            endpoint: '/test',
            name: 'test',
            data: {
              foo: 'bar',
              id: 42
            }
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            expect(request.config.method).toEqual(method)
            expect(request.config.data).toEqual(JSON.stringify({
              foo: 'bar',
              id: 42
            }))
            done()
          })
        })
      })
    })

    it(`can pass a success function`, (done) => {
      const success = jest.fn()
      makeRequest({
        method: 'get',
        endpoint: '/test',
        name: 'test',
        success
      })

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            foo: 'bar'
          }
        }).then(function () {
          expect(success).toHaveBeenCalledWith({ foo: 'bar' }, {
            method: 'get', endpoint: '/test', name: 'test'
          })
          done()
        })
      })
    })

    it(`can pass a failed function`, (done) => {
      const failed = jest.fn()
      makeRequest({
        method: 'get',
        endpoint: '/test',
        name: 'test',
        failed
      })

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 400,
          response: {
            foo: 'bar'
          }
        }).then(function () {
          expect(failed).toHaveBeenCalledWith(new Error('Request failed with status code 400'), {
            method: 'get', endpoint: '/test', name: 'test'
          })
          done()
        })
      })
    })

    it(`can pass a failed function with no message`, (done) => {
      const failed = jest.fn()
      makeRequest({
        method: 'get',
        endpoint: '/test',
        name: 'test',
        failed
      })

      moxios.wait(function () {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 400
        }).then(function () {
          expect(failed).toHaveBeenCalledWith(new Error('Request failed with status code 400'), {
            method: 'get', endpoint: '/test', name: 'test'
          })
          done()
        })
      })
    })
  })
})
