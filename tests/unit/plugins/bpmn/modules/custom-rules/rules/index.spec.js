import setupRules, { rules } from '@/plugins/bpmn/modules/custom-rules/rules'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Setup Rules', () => {
          const ruleCount = Object.keys(rules).length
          let context
          beforeEach(() => {
            jest.clearAllMocks()
            context = {
              elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
              commnandStack: { undo: jest.fn() },
              eventBus: { name: 'eventBus', on: jest.fn() }
            }
            setupRules(context)
          })
          it('sets up All rules', () => {
            expect(context.eventBus.on).toHaveBeenCalledTimes(ruleCount)
          })
        })
      })
    })
  })
})
