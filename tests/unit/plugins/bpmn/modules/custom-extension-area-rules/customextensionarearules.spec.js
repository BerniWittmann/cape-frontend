import CustomExtensionAreaRules from '@/plugins/bpmn/modules/custom-extension-area-rules/customRules'
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

jest.mock('inherits', () => {
  return jest.fn()
})

jest.mock('diagram-js/lib/features/rules/RuleProvider', () => {
  return {
    call: jest.fn(),
    prototype: {
      _needsId: jest.fn()
    }
  }
})

let object
const allowedTargets = ['bpmn:Process', 'bpmn:Participant', 'bpmn:Collaboration', 'bpmn:SequenceFlow']

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Extension Area Rules', () => {
        beforeEach(() => {
          object = {
            $type: 'cape:ExtensionArea',
            businessObject: {
              $type: 'cape:ExtensionArea'
            }
          }
        })
        const eventBus = jest.fn()
        it('can be instantiated', () => {
          expect(CustomExtensionAreaRules).toEqual(expect.any(Function))
          CustomExtensionAreaRules.call({}, eventBus)
          expect(RuleProvider.call).toHaveBeenCalledWith({}, eventBus)
        })

        it('has the correct modules injected', () => {
          expect(CustomExtensionAreaRules.$inject).toMatchSnapshot()
        })

        it('has an init method', () => {
          expect(CustomExtensionAreaRules.prototype.init).toEqual(expect.any(Function))
        })

        describe('it adds a Rule for shape.create', () => {
          let rule
          beforeEach(() => {
            const addRule = jest.fn()
            CustomExtensionAreaRules.prototype.init.call({
              addRule
            })

            rule = addRule.mock.calls[0]
          })
          it('has the correct config', () => {
            expect(rule[0]).toEqual('shape.create')
            expect(rule[1]).toEqual(expect.any(Number))
            expect(rule[2]).toEqual(expect.any(Function))
          })
          it('does not judge about non custom elements', () => {
            object.$type = 'bpmn:Process'
            expect(rule[2]({
              shape: object,
              target: {}
            })).toBeUndefined()
          })

          allowedTargets.forEach((target) => {
            it('returns true if target is a ' + target, () => {
              expect(rule[2]({
                shape: object,
                target: {
                  $type: target,
                  businessObject: {
                    $type: target
                  }
                }
              })).toBeTruthy()
            })
          })

          it('returns false for other targets', () => {
            expect(rule[2]({
              shape: object,
              target: {
                $type: 'bpmn:Task',
                businessObject: {
                  $type: 'bpmn:Task'
                }
              }
            })).toBeFalsy()
          })
        })

        describe('it adds a Rule for shape.resize', () => {
          let rule
          beforeEach(() => {
            const addRule = jest.fn()
            CustomExtensionAreaRules.prototype.init.call({
              addRule
            })

            rule = addRule.mock.calls[1]
          })
          it('has the correct config', () => {
            expect(rule[0]).toEqual('shape.resize')
            expect(rule[1]).toEqual(expect.any(Number))
            expect(rule[2]).toEqual(expect.any(Function))
          })
          it('does not judge about non custom elements', () => {
            object.$type = 'bpmn:Process'
            expect(rule[2]({
              shape: object
            })).toBeUndefined()
          })
          it('returns false for custom elements', () => {
            expect(rule[2]({
              shape: object
            })).toBeFalsy()
          })
        })
      })
    })
  })
})
