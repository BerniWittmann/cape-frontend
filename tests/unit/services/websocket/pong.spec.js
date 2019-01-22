import axios from 'axios'
import pong from '@/services/websocket/pong'

describe('WebSocketService', () => {
  describe('Message Handlers', () => {
    describe('pong', () => {
      const message = {
        data: {
          clientID: 'a1b2c3'
        }
      }
      const send = jest.fn()
      let handler
      beforeEach(() => {
        axios.defaults.headers.common['Websocket-Client-ID'] = undefined
        handler = pong.bind({
          send
        })
      })

      describe('it does not already have a client id', () => {
        beforeEach(() => {
          sessionStorage.clear()
        })
        it('sends back the response with the new client id', () => {
          handler(message)

          expect(send).toHaveBeenCalledWith(JSON.stringify({
            type: 'pong',
            msg: 'Hello back from Client',
            data: {
              clientID: 'a1b2c3'
            }
          }))
        })
        it('stores the new client id', () => {
          handler(message)

          expect(sessionStorage.getItem('websocket_client_id')).toEqual('a1b2c3')
        })
        it('sets the http header', () => {
          handler(message)

          expect(axios.defaults.headers.common['Websocket-Client-ID']).toEqual('a1b2c3')
        })
      })

      describe('it does already have a client id', () => {
        beforeEach(() => {
          sessionStorage.setItem('websocket_client_id', 'z99_old_id')
        })
        it('sends back the response with the old client id', () => {
          handler(message)

          expect(send).toHaveBeenCalledWith(JSON.stringify({
            type: 'pong',
            msg: 'Hello back from Client',
            data: {
              clientID: 'z99_old_id'
            }
          }))
        })
        it('does not stores the new client id', () => {
          handler(message)

          expect(sessionStorage.getItem('websocket_client_id')).not.toEqual('a1b2c3')
          expect(sessionStorage.getItem('websocket_client_id')).toEqual('z99_old_id')
        })

        it('sets the http header', () => {
          handler(message)

          expect(axios.defaults.headers.common['Websocket-Client-ID']).toEqual('z99_old_id')
        })
      })
    })
  })
})
