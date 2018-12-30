import BaseRule from '@/plugins/bpmn/modules/custom-rules/rules/abstract-rules/baseRule'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Base Rule', () => {
          let br
          const context = {
            commandStack: { name: 'commandStack' },
            eventBus: { name: 'eventBus', on: jest.fn() }
          }
          beforeEach(() => {
            jest.clearAllMocks()
            br = new BaseRule(context)
          })
          it('has a priority', () => {
            expect(br.priority).toBeGreaterThan(0)
          })
          it('has an event array', () => {
            expect(br.events).toEqual([])
          })
          it('has a handler', () => {
            expect(br.handler).toEqual(expect.any(Function))
            expect(br.handler).toThrow()
          })
          it('registers the event listener on construction', () => {
            expect(br.eventBus.on).toHaveBeenCalledWith(br.events, br.priority, expect.any(Function))
          })
          it('binds the context to the handler on construction', () => {
            const handler = br.eventBus.on.mock.calls[0][2]
            expect(handler).toEqual(expect.any(Function))
          })
        })
      })
    })
  })
})
