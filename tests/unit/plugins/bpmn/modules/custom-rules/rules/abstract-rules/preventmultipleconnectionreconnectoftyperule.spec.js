import PreventMultipleIncomingConnectionReconnectOfTypeRule
  from '@/plugins/bpmn/modules/custom-rules/rules/abstract-rules/preventMultipleConnectionReconnectOfType'

const types = ['incoming', 'outgoing']

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('PreventMultipleIncomingConnectionReconnectOfTypeRule', () => {
          let rule
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
            try {
              class TestRule extends PreventMultipleIncomingConnectionReconnectOfTypeRule {
                get events() {
                  return ['my-event']
                }
              }
              const r = new TestRule(context)
              expect(r.type).not.toBeUndefined()
            } catch (e) {
              expect(e).toEqual(new Error('Not Implemented'))
            }
          })
          it('throws a not implemented Error, when accessing the abstract events', () => {
            expect.assertions(1)
            try {
              const r = new PreventMultipleIncomingConnectionReconnectOfTypeRule(context)
              expect(r.events).not.toBeUndefined()
            } catch (e) {
              expect(e).toEqual(new Error('Not Implemented'))
            }
          })
          types.forEach(type => {
            describe('it checks for existing connection of type ' + type, () => {
              beforeEach(() => {
                class TestRule extends PreventMultipleIncomingConnectionReconnectOfTypeRule {
                  get type() {
                    return type
                  }

                  get events() {
                    return ['my-event']
                  }
                }

                rule = new TestRule(context)
              })
              it('has an event array', () => {
                expect(rule.events).toEqual(expect.any(Array))
                expect(rule.events.length).toBeGreaterThan(0)
              })
              it('has a handler', () => {
                expect(rule.handler).toEqual(expect.any(Function))
              })
              it('does return false if no target', () => {
                const res = rule.handler({
                  context: {
                    hover: undefined
                  }
                })
                expect(res).toBeFalsy()
                expect(res).not.toBeUndefined()
              })
              it('does return nothing if target allowed to have multiple connections', () => {
                const res = rule.handler({
                  context: {
                    hover: { businessObject: { $type: 'bpmn:ExclusiveGateway' }, [type]: [{}] }
                  }
                })
                expect(res).toBeUndefined()
              })
              it('does return nothing if target has no ' + type + ' connections yet', () => {
                const res = rule.handler({
                  context: {
                    hover: { businessObject: { $type: 'bpmn:Task' }, [type]: [] }
                  }
                })
                expect(res).toBeUndefined()
              })
              it('returns false if target already has an ' + type + ' connection', () => {
                const res = rule.handler({
                  context: {
                    hover: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] }
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
  })
})
