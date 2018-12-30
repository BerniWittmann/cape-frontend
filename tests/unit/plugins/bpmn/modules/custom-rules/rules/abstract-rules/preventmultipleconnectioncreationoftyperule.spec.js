import PreventMultipleConnectionCreationOfTypeRule
  from '@/plugins/bpmn/modules/custom-rules/rules/abstract-rules/preventMultipleConnectionCreationOfType'
const types = ['incoming', 'outgoing']
const nodes = ['source', 'target']

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('PreventMultipleConnectionCreationOfTypeRule', () => {
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
            const r = new PreventMultipleConnectionCreationOfTypeRule(context)
            try {
              expect(r.type).not.toBeUndefined()
            } catch (e) {
              expect(e).toEqual(new Error('Not Implemented'))
            }
          })
          it('throws a not implemented Error, when accessing the abstract node', () => {
            expect.assertions(1)
            const r = new PreventMultipleConnectionCreationOfTypeRule(context)
            try {
              expect(r.node).not.toBeUndefined()
            } catch (e) {
              expect(e).toEqual(new Error('Not Implemented'))
            }
          })
          nodes.forEach(node => {
            types.forEach(type => {
              describe('it checks for existing connection for node ' + node + ' of type ' + type, () => {
                beforeEach(() => {
                  class TestRule extends PreventMultipleConnectionCreationOfTypeRule {
                    get type() {
                      return type
                    }
                    get node() {
                      return node
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
                it('does return nothing if source is a data element', () => {
                  const res = rule.handler({
                    context: {
                      target: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      source: { businessObject: { $type: 'bpmn:DataObjectReference' }, [type]: [{}] }
                    }
                  })
                  expect(res).toBeUndefined()
                })
                it('does return nothing if target is a data element', () => {
                  const res = rule.handler({
                    context: {
                      source: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      target: { businessObject: { $type: 'bpmn:DataObjectReference' }, [type]: [{}] }
                    }
                  })
                  expect(res).toBeUndefined()
                })
                it('does return nothing if ' + node + ' allowed to have multiple connections', () => {
                  const res = rule.handler({
                    context: {
                      target: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      source: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      [node]: { businessObject: { $type: 'bpmn:ExclusiveGateway' }, [type]: [{}, {}] }
                    }
                  })
                  expect(res).toBeUndefined()
                })
                it('does return nothing if ' + node + ' has no ' + type + ' connections yet', () => {
                  const res = rule.handler({
                    context: {
                      target: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      source: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      [node]: { businessObject: { $type: 'bpmn:Task' }, [type]: [] }
                    }
                  })
                  expect(res).toBeUndefined()
                })
                it('returns false if ' + node + ' already has an ' + type + ' connection', () => {
                  const res = rule.handler({
                    context: {
                      target: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      source: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] },
                      [node]: { businessObject: { $type: 'bpmn:Task' }, [type]: [{}] }
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
})
