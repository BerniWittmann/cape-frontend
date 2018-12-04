import PreventUnconnectedElementsRule
  from '@/plugins/bpmn/modules/custom-rules/rules/preventUnconnectedElements'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Prevent Unconnected Elements Rule', () => {
          jest.useFakeTimers()

          let context
          let rule
          beforeEach(() => {
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' }, incoming: [{}], outgoing: [{}] }],
              eventBus: { name: 'eventBus', on: jest.fn() },
              commandStack: { undo: jest.fn() }
            }
            jest.clearAllMocks()
            rule = new PreventUnconnectedElementsRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('does nothing if there are no unconnected entities', () => {
            rule.handler()
            jest.runAllTimers()

            expect(context.commandStack.undo).not.toHaveBeenCalled()
          })
          it('reverts the last command there are unconnected entities', () => {
            context.elementRegistry[0].incoming = []
            rule = new PreventUnconnectedElementsRule(context)

            rule.handler()
            jest.runAllTimers()

            expect(context.commandStack.undo).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
