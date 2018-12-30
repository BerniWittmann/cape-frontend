import EnsureOnlyOneEventOfTypeRule
  from '@/plugins/bpmn/modules/custom-rules/rules/abstract-rules/ensureOnlyOneEventOfType'
import { END_EVENT_TYPE, START_EVENT_TYPE } from '@/plugins/bpmn/modules/constants'

const types = [END_EVENT_TYPE, START_EVENT_TYPE, 'bpmn:Process']

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('EnsureOnlyOneEventOfType', () => {
          let br
          const context = {
            elementRegistry: [{ businessObject: { $type: 'bpmn:Task' } }],
            commandStack: { name: 'commandStack' },
            eventBus: { name: 'eventBus', on: jest.fn() }
          }
          beforeEach(() => {
            jest.clearAllMocks()
          })
          it('throws a not implemented Error, when accessing the abstract type', () => {
            expect.assertions(1)
            const r = new EnsureOnlyOneEventOfTypeRule(context)
            try {
              expect(r.type).not.toBeUndefined()
            } catch (e) {
              expect(e).toEqual(new Error('Not Implemented'))
            }
          })
          types.forEach(type => {
            describe('it checks for exactly one elemet of type ' + type, () => {
              beforeEach(() => {
                class TestRule extends EnsureOnlyOneEventOfTypeRule {
                  get type() {
                    return type
                  }
                }

                br = new TestRule(context)
              })
              it('has a priority', () => {
                expect(br.priority).toBeGreaterThan(0)
              })
              it('has an event array', () => {
                expect(br.events.length).toBeGreaterThan(0)
              })
              it('has a handler', () => {
                expect(br.handler).toEqual(expect.any(Function))
              })
              it('has a type', () => {
                expect(br.type).toEqual(type)
              })
              it('does return nothing if shape is no Event of type', () => {
                const res = br.handler({ context: { shape: { businessObject: { $type: 'bpmn:Task' } } } })
                expect(res).toBeUndefined()
              })
              it('does return nothing if it doesnt has an Event of type', () => {
                const res = br.handler({ context: { shape: { businessObject: { $type: type } } } })
                expect(res).toBeUndefined()
              })
              it('returns false if it already has an Event of type', () => {
                context.elementRegistry = [{ businessObject: { $type: 'bpmn:Task' } }, { businessObject: { $type: type } }]
                class TestRule extends EnsureOnlyOneEventOfTypeRule {
                  get type() {
                    return type
                  }
                }
                br = new TestRule(context)

                const res = br.handler({ context: { shape: { businessObject: { $type: type } } } })
                expect(res).toBeFalsy()
                expect(res).not.toBeUndefined()
              })
            })
          })
        })
      })
    })
  })
})
