import PreventMultipleOutgoingConnectionReconnectRule
  from '@/plugins/bpmn/modules/custom-rules/rules/preventMultipleOutgoingConnectionReconnect'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Prevent Multiple Outgoing Connection Reconnect Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new PreventMultipleOutgoingConnectionReconnectRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return false if no source', () => {
            const res = rule.handler({
              context: {
                hover: undefined
              }
            })
            expect(res).toBeFalsy()
            expect(res).not.toBeUndefined()
          })
          it('does return nothing if source allowed to have multiple connections', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:ExclusiveGateway' }, outgoing: [{}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if source has no outgoing connections yet', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:Task' }, outgoing: [] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('returns false if source already has an outgoing connection', () => {
            const res = rule.handler({
              context: {
                hover: { businessObject: { $type: 'bpmn:Task' }, outgoing: [{}] }
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
