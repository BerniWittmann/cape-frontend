import PreventUnconnectedElementCreationRule
  from '@/plugins/bpmn/modules/custom-rules/rules/preventUnconnectedElementCreation'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Prevent Unconnected Element Creation Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new PreventUnconnectedElementCreationRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return nothing if shape is allowed to have no connections', () => {
            const res = rule.handler({
              context: {
                shape: { businessObject: { $type: 'bpmn:DataObjectReference' }, outgoing: [{}] }
              }
            })
            expect(res).toBeUndefined()
          })
          it('does return nothing if dragged on a connection', () => {
            const res = rule.handler({
              context: {
                shape: { businessObject: { $type: 'bpmn:Task' } },
                target: { businessObject: { $type: 'bpmn:SequenceFlow' } }
              }
            })
            expect(res).toBeUndefined()
          })
          it('returns false if dragged on the Process', () => {
            const res = rule.handler({
              context: {
                shape: { businessObject: { $type: 'bpmn:Task' } },
                target: { businessObject: { $type: 'bpmn:Process' } }
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
