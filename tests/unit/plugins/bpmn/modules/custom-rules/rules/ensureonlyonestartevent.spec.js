import EnsureOnlyOneStartEventRule from '@/plugins/bpmn/modules/custom-rules/rules/ensureOnlyOneStartEvent'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Ensure Only One Start Event Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new EnsureOnlyOneStartEventRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return nothing if shape is no Start Event', () => {
            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:Task' } } } })
            expect(res).toBeUndefined()
          })
          it('does return nothing if it doesnt has an Start Event', () => {
            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:StartEvent' } } } })
            expect(res).toBeUndefined()
          })
          it('returns false if it already has an Start Event', () => {
            context.elementRegistry = [{ businessObject: { $type: 'bpmn:Task' } }, { businessObject: { $type: 'bpmn:StartEvent' } }]
            rule = new EnsureOnlyOneStartEventRule(context)

            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:StartEvent' } } } })
            expect(res).toBeFalsy()
            expect(res).not.toBeUndefined()
          })
        })
      })
    })
  })
})
