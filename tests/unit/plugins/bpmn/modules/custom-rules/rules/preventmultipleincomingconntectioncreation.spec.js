import PreventMultipleIncomingConnectionCreationRule
  from '@/plugins/bpmn/modules/custom-rules/rules/preventMultipleIncomingConnectionCreation'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Prevent Multiple Incoming Connection Creation Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new PreventMultipleIncomingConnectionCreationRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return nothing if source is a data element', () => {
            const res = rule.handler({
              context: {
                source: { businessObject: { $type: 'bpmn:DataObjectReference' }, outgoing: [{}] },
                target: { businessObject: { $type: 'bpmn:Task' }, incoming: [{}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if target is a data element', () => {
            const res = rule.handler({
              context: {
                source: { businessObject: { $type: 'bpmn:Task' }, outgoing: [{}] },
                target: { businessObject: { $type: 'bpmn:DataObjectReference' }, incoming: [{}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if target allowed to have multiple connections', () => {
            const res = rule.handler({
              context: {
                source: { businessObject: { $type: 'bpmn:Task' }, outgoing: [{}] },
                target: { businessObject: { $type: 'bpmn:ExclusiveGateway' }, incoming: [{}, {}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if target has no incoming connections yet', () => {
            const res = rule.handler({
              context: {
                source: { businessObject: { $type: 'bpmn:Task' }, outgoing: [{}] },
                target: { businessObject: { $type: 'bpmn:Task' }, incoming: [] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('returns false if target already has an incoming connection', () => {
            const res = rule.handler({
              context: {
                source: { businessObject: { $type: 'bpmn:Task' }, outgoing: [{}] },
                target: { businessObject: { $type: 'bpmn:Task' }, incoming: [{}] }
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
