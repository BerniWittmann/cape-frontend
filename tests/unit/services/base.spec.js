// eslint-disable no-new
import Service from '@/services/base'
import moxios from 'moxios'
import axios from 'axios'
import Vue from 'vue'
import store from '@/vuex/store'
import getRoute from '@/services/routes'

store.dispatch = jest.fn()

function makeRequest(data) {
  return new Service(data)
}

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

        it(`can make a ${method} request to an route name`, (done) => {
          makeRequest({
            method: method,
            name: 'processes.all'
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            expect(request.config.url).toEqual('/processes')
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

        it(`can make a ${method} request to an route name with routeOverrides`, (done) => {
          makeRequest({
            method: method,
            name: 'processes.single',
            routeOverrides: [12]
          })

          moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            expect(request.config.url).toEqual('/processes/12')
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
            data: undefined,
            success: expect.any(Function),
            failed: expect.any(Function),
            method: 'get',
            endpoint: '/test',
            name: 'test'
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
            data: undefined,
            success: expect.any(Function),
            failed: expect.any(Function),
            method: 'get',
            endpoint: '/test',
            name: 'test'
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
            data: undefined,
            success: expect.any(Function),
            failed: expect.any(Function),
            method: 'get',
            endpoint: '/test',
            name: 'test'
          })
          done()
        })
      })
    })
  })

  describe('Builder', () => {
    beforeEach(() => {
      moxios.install()
      Vue.$message = jest.fn()
      Vue.$notification = {
        error: jest.fn()
      }
      Vue.$http = axios
      Vue.i18n = {
        t: key => key
      }
    })
    afterEach(() => {
      moxios.uninstall()
    })

    it('provides a static builder method', () => {
      expect(Service.builder).toEqual(expect.any(Function))
    })

    const routes = ['processes', 'context_factors', 'context_types', 'tags']
    const actions = {
      getAll: { method: 'get', prefix: 'all', sendData: false },
      get: { method: 'get', prefix: 'single', sendData: false },
      create: { method: 'post', prefix: 'all', sendData: true },
      update: { method: 'put', prefix: 'single', sendData: true },
      remove: { method: 'delete', prefix: 'single', sendData: false }
    }

    routes.forEach((route) => {
      describe('it provides a builder function for route ' + route, () => {
        Object.keys(actions).forEach((actionName) => {
          const action = actions[actionName]
          describe('it provides a builder function for action ' + actionName, () => {
            let success, failed, builder
            beforeEach(() => {
              success = jest.fn()
              failed = jest.fn()
              builder = Service.builder({ name: route, success, failed })
            })
            it('has a function for it', () => {
              expect(builder[actionName]).toEqual(expect.any(Function))
            })
            it('provides the correct config', (done) => {
              builder[actionName]({ id: 99 })

              moxios.wait(function () {
                let request = moxios.requests.mostRecent()
                expect(request.config.method).toEqual(action.method)
                expect(request.config.url).toEqual(getRoute(route + '.' + action.prefix, [99]))
                done()
              })
            })

            if (action.sendData) {
              it('provides the data', (done) => {
                builder[actionName]({ id: 99, foo: 'bar' })

                moxios.wait(function () {
                  let request = moxios.requests.mostRecent()
                  expect(request.config.data).toEqual(JSON.stringify({ id: 99, foo: 'bar' }))
                  done()
                })
              })
            }

            it('provides the success function', (done) => {
              builder[actionName]({ id: 99 })

              moxios.wait(function () {
                let request = moxios.requests.mostRecent()
                request.respondWith({
                  status: 200
                }).then(function () {
                  expect(success).toHaveBeenCalled()
                  done()
                })
              })
            })

            it('provides the failed function', (done) => {
              builder[actionName]({ id: 99 })

              moxios.wait(function () {
                let request = moxios.requests.mostRecent()
                request.respondWith({
                  status: 400
                }).then(function () {
                  expect(failed).toHaveBeenCalled()
                  done()
                })
              })
            })
          })
        })
      })
    })
  })
})
