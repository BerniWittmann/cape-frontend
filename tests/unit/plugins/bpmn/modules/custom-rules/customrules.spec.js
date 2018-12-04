import CustomRules from '@/plugins/bpmn/modules/custom-rules/customRules'
import setupRules from '@/plugins/bpmn/modules/custom-rules/rules'

jest.mock('@/plugins/bpmn/modules/custom-rules/rules', () => {
  return jest.fn()
})

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('CustomRules', () => {
          const context = {
            eventBus: { name: 'eventBus' },
            elementRegistry: { name: 'elementRegistry' },
            commandStack: { name: 'commandStack' }
          }
          beforeEach(() => {
            // eslint-disable-next-line no-new
            new CustomRules(context.eventBus, context.elementRegistry, context.commandStack)
          })
          it('setups the rules', () => {
            expect(setupRules).toHaveBeenCalledWith(context)
          })
        })
      })
    })
  })
})
