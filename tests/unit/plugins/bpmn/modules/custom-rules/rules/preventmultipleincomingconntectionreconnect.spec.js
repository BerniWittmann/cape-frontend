import PreventMultipleIncomingConnectionReconnectRule
  from '@/plugins/bpmn/modules/custom-rules/rules/preventMultipleIncomingConnectionReconnect'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Prevent Multiple Incoming Connection Reconnect Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new PreventMultipleIncomingConnectionReconnectRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return false if no target', () => {
            const res = rule.handler({
              context: {
                hover: undefined
              }
            })
            expect(res).toBeFalsy()
            expect(res).not.toBeUndefined()
          })
          it('does return nothing if target allowed to have multiple connections', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:ExclusiveGateway' }, incoming: [{}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if target has no incoming connections yet', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:Task' }, incoming: [] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('returns false if target already has an incoming connection', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:Task' }, incoming: [{}] }
              }
            })
            expect(res).toBeFalsy()
            expect(res).not.toBeUndefined()
          })
        })
      })
    })
  })
})
