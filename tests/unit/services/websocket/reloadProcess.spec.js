import ProcessService from '@/services/process'

import reloadProcess from '@/services/websocket/reloadProcess'

describe('WebSocketService', () => {
  describe('Message Handlers', () => {
    describe('reloadProcess', () => {
      it('reloads a single Process', () => {
        ProcessService.reload = jest.fn()

        reloadProcess({
          data: {
            processID: '42'
          }
        })

        expect(ProcessService.reload).toHaveBeenCalledWith({ id: '42' })
      })
    })
  })
})
