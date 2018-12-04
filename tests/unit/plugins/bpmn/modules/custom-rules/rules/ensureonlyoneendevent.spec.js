import EnsureOnlyOneEndEventRule from '@/plugins/bpmn/modules/custom-rules/rules/ensureOnlyOneEndEvent'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Ensure Only One End Event Rule', () => {
          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new EnsureOnlyOneEndEventRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does return nothing if shape is no End Event', () => {
            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:Task' } } } })
            expect(res).toBeUndefined()
          })
          it('does return nothing if it doesnt has an End Event', () => {
            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:EndEvent' } } } })
            expect(res).toBeUndefined()
          })
          it('returns false if it already has an End Event', () => {
            context.elementRegistry = [{ businessObject: { $type: 'bpmn:Task' } }, { businessObject: { $type: 'bpmn:EndEvent' } }]
            rule = new EnsureOnlyOneEndEventRule(context)

            const res = rule.handler({ context: { shape: { businessObject: { $type: 'bpmn:EndEvent' } } } })
            expect(res).toBeFalsy()
            expect(res).not.toBeUndefined()
          })
        })
      })
    })
  })
})
