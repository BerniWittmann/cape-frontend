import Vue from 'vue'
import WebSocketService from '@/services/websocket'

const ws = {
  close: jest.fn(),
  isWSConnection: true
}
const listeners = ['onopen', 'onmessage', 'onclose', 'onerror']
let messageHandlerContext
const messageHandlers = {
  'reload_processes': jest.fn().mockImplementation(function () { messageHandlerContext = this }),
  'reload_process': jest.fn().mockImplementation(function () { messageHandlerContext = this }),
  'ping': jest.fn().mockImplementation(function () { messageHandlerContext = this })
}

global.WebSocket = jest.fn().mockImplementation(() => ws)

jest.useFakeTimers()

describe('WebSocketService', () => {
  let websocket
  beforeEach(() => {
    messageHandlerContext = undefined
    Vue.$message = jest.fn()
    Vue.i18n = {
      t: key => key
    }
    jest.clearAllMocks()
    websocket = new WebSocketService()
  })

  describe('it can connect to the WebSocket server', () => {
    it('connnects to the server', () => {
      expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:10010/api/')
      expect(websocket.connection).not.toEqual(undefined)
      expect(websocket.connection).toEqual(ws)
      expect(websocket.reconnectInterval).toEqual(1000)
    })

    listeners.forEach((name) => {
      it('the ' + name + ' listener is defined', () => {
        expect(websocket.connection[name]).toEqual(expect.any(Function))
      })
    })
  })

  describe('it can close the connection', () => {
    it('has a close function', () => {
      expect(websocket.close).toEqual(expect.any(Function))
    })

    it('closes the connection', () => {
      websocket.close()
      expect(ws.close).toHaveBeenCalled()
    })

    it('does not close the connection if connection already closed', () => {
      websocket.connection = undefined
      websocket.close()
      expect(ws.close).not.toHaveBeenCalled()
    })
  })

  describe('handles the onopen event', () => {
    it('logs a message', () => {
      console.log = jest.fn()
      websocket.onopen()
      expect(console.log).toHaveBeenCalledWith('WebSocket Connection opened')
    })

    it('resets the reconnectInterval', () => {
      websocket.reconnectInterval = 30000
      websocket.onopen()
      expect(websocket.reconnectInterval).toEqual(1000)
    })

    it('hides the closed Connection Message', () => {
      const msg = { close: jest.fn() }
      websocket.closedMessage = msg

      websocket.onopen()

      expect(msg.close).toHaveBeenCalled()
      expect(websocket.closedMessage).toEqual(undefined)
    })
  })
  describe('handles the onmessage event', () => {
    it('logs an error if message cant be parsed', () => {
      console.error = jest.fn()
      const message = { data: 'Invalid Format' }
      websocket.onmessage(message)
      expect(console.error).toHaveBeenCalledWith('Invalid Websocket Message received', {
        error: expect.any(Error),
        message
      })
    })
    it('logs a warning if message type is unkown', () => {
      console.warn = jest.fn()
      console.error = jest.fn()
      const message = {
        data: JSON.stringify({
          type: 'unkown_type',
          msg: 'This message has an unkown type'
        })
      }
      websocket.onmessage(message)
      expect(console.error).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalledWith('WebSocket received unkown message type', JSON.parse(message.data))
    })
    it('logs a warning if message has no type', () => {
      console.warn = jest.fn()
      console.error = jest.fn()
      const message = {
        data: JSON.stringify({
          msg: 'This message has no type'
        })
      }
      websocket.onmessage(message)
      expect(console.error).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalledWith('WebSocket received unkown message type', JSON.parse(message.data))
    })
    describe('handles the message by type', () => {
      it('can handle different types', () => {
        expect(Object.keys(websocket.messageHandlers)).toEqual(Object.keys(messageHandlers))
      })

      Object.keys(messageHandlers).forEach(type => {
        describe('handles messages of type ' + type, () => {
          const message = {
            data: JSON.stringify({
              type: type,
              msg: 'This message has an unkown type',
              data: {
                foo: 'bar'
              }
            })
          }
          beforeEach(() => {
            websocket.messageHandlers = messageHandlers
          })

          it('calls the correct message handler', () => {
            websocket.onmessage(message)

            expect(messageHandlers[type]).toHaveBeenCalledWith(JSON.parse(message.data))
          })

          it('binds the connection to the message handler', () => {
            websocket.onmessage(message)

            expect(messageHandlerContext).toEqual(websocket.connection)
          })
        })
      })
    })
  })

  describe('handles the onclose event', () => {
    beforeEach(() => {
      websocket.reconnectInterval = 1750
      websocket.connect = jest.fn()
    })
    let event = {}
    describe('the exit was clean', () => {
      beforeEach(() => {
        event.wasClean = true
      })
      it('logs a message', () => {
        console.log = jest.fn()
        websocket.onclose(event)
        expect(console.log).toHaveBeenCalledWith('WebSocket Connection closed.')
      })
      it('does not reconnect', () => {
        websocket.onclose(event)
        jest.runOnlyPendingTimers()
        expect(websocket.connect).not.toHaveBeenCalled()
      })
      it('does not show a message', () => {
        websocket.onclose(event)
        expect(Vue.$message).not.toHaveBeenCalled()
      })
    })

    describe('the exit was not clean', () => {
      beforeEach(() => {
        event.wasClean = false
      })
      it('logs a message', () => {
        console.log = jest.fn()
        websocket.onclose(event)
        expect(console.log).toHaveBeenCalledWith('WebSocket Connection closed. Reconnecting in 1750ms.')
      })

      it('reconnects after timeout', () => {
        websocket.onclose(event)

        jest.advanceTimersByTime(1500) // not enough time elapsed yet
        expect(websocket.connect).not.toHaveBeenCalled()

        jest.advanceTimersByTime(250) // enough time elapsed
        expect(websocket.connect).toHaveBeenCalled()
      })

      it('increases the reconnectInterval', () => {
        websocket.onclose(event)

        jest.advanceTimersByTime(1750)

        expect(websocket.reconnectInterval).toBeGreaterThan(1750)
      })

      it('does not increase the reconnectInterval beyond a maximum value', () => {
        websocket.reconnectInterval = 30000

        websocket.onclose(event)

        jest.advanceTimersByTime(30000)

        expect(websocket.reconnectInterval).toEqual(30000)
      })

      it('shows a message', () => {
        websocket.onclose(event)
        expect(Vue.$message).toHaveBeenCalledWith({
          duration: 0,
          message: 'websocket.connection_closed',
          showClose: true,
          type: 'error'
        })
      })

      it('does not show the message, if its already visisble', () => {
        websocket.closedMessage = {}
        websocket.onclose(event)
        expect(Vue.$message).not.toHaveBeenCalled()
      })
    })
  })

  describe('handles the onerror event', () => {
    it('logs a message', () => {
      const err = new Error('Test')
      console.error = jest.fn()
      websocket.onerror(err)
      expect(console.error).toHaveBeenCalledWith('WebSocket errored: ', err)
    })

    it('closes the connection', () => {
      websocket.onerror(new Error('Test'))
      expect(ws.close).toHaveBeenCalled()
    })
  })
})
