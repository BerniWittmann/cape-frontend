import ProcessService from '@/services/process'

import reloadProcesses from '@/services/websocket/reloadProcesses'

describe('WebSocketService', () => {
  describe('Message Handlers', () => {
    describe('reloadProcesses', () => {
      it('reloads the Processes', () => {
        ProcessService.getAll = jest.fn()

        reloadProcesses()

        expect(ProcessService.getAll).toHaveBeenCalled()
      })
    })
  })
})
