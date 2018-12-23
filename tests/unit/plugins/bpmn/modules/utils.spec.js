import * as utils from '@/plugins/bpmn/modules/utils'
import {
  NO_CONNECTIONS_DISALLOWED_OBJECTS,
  SEQUENCE_FLOW_TYPE,
  MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES,
  CONNECTION_RULE_ENFORCED_ELEMENTS
} from '@/plugins/bpmn/modules/constants'

const sequenceFlow = { businessObject: { $type: SEQUENCE_FLOW_TYPE } }
const dataFlow = { businessObject: { $type: 'bpmn:DataFlow' } }

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('utils', () => {
        it('provides the necessary helper functions', () => {
          const keys = Object.keys(utils)

          expect(keys).toMatchSnapshot()
          expect.assertions(keys.length + 1)
          keys.forEach((key) => {
            expect(utils[key]).toEqual(expect.any(Function))
          })
        })

        describe('shapeIsType', () => {
          it('if no shape given it returns false', () => {
            expect(utils.shapeIsType(undefined, 'my-type')).toBeFalsy()
          })
          it('if shape has no business object it returns false', () => {
            expect(utils.shapeIsType({}, 'my-type')).toBeFalsy()
          })
          it('if shape has incorrect Type it returns false', () => {
            expect(utils.shapeIsType({ businessObject: { $type: 'other' } }, 'my-type')).toBeFalsy()
          })
          it('if shape has correct Type it returns true', () => {
            expect(utils.shapeIsType({ businessObject: { $type: 'my-type' } }, 'my-type')).toBeTruthy()
          })
        })

        describe('shapeHasType', () => {
          it('if no shape given it returns false', () => {
            expect(utils.shapeHasType(undefined, ['my-type'])).toBeFalsy()
          })
          it('if shape has no business object it returns false', () => {
            expect(utils.shapeHasType({}, ['my-type'])).toBeFalsy()
          })
          it('if shape has incorrect Type it returns false', () => {
            expect(utils.shapeHasType({ businessObject: { $type: 'wrong' } }, ['my-type', 'other-type'])).toBeFalsy()
          })
          it('if shape has correct Type it returns true', () => {
            expect(utils.shapeHasType({ businessObject: { $type: 'my-type' } }, ['other-type', 'my-type', 'third-type'])).toBeTruthy()
          })
        })

        describe('getElementsByType', () => {
          it('filters all elements by type', () => {
            const arr = [{ businessObject: { $type: 'my-type' } }, { businessObject: { $type: 'wron' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getElementsByType(arr, 'my-type')).toEqual([arr[0], arr[2]])
          })
        })

        describe('getStartEventCount', () => {
          it('returns 0 if no start event is available', () => {
            const arr = [{ businessObject: { $type: 'my-type' } }, { businessObject: { $type: 'bpmn:EndEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getStartEventCount(arr)).toEqual(0)
          })
          it('returns 1 if one start event is available', () => {
            const arr = [{ businessObject: { $type: 'my-type' } }, { businessObject: { $type: 'bpmn:StartEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getStartEventCount(arr)).toEqual(1)
          })
          it('returns 2 if two start event is available', () => {
            const arr = [{ businessObject: { $type: 'bpmn:StartEvent' } }, { businessObject: { $type: 'bpmn:StartEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getStartEventCount(arr)).toEqual(2)
          })
        })

        describe('getEndEventCount', () => {
          it('returns 0 if no end event is available', () => {
            const arr = [{ businessObject: { $type: 'my-type' } }, { businessObject: { $type: 'bpmn:StartEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getEndEventCount(arr)).toEqual(0)
          })
          it('returns 1 if one end event is available', () => {
            const arr = [{ businessObject: { $type: 'my-type' } }, { businessObject: { $type: 'bpmn:EndEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getEndEventCount(arr)).toEqual(1)
          })
          it('returns 2 if two end event is available', () => {
            const arr = [{ businessObject: { $type: 'bpmn:EndEvent' } }, { businessObject: { $type: 'bpmn:EndEvent' } }, { businessObject: { $type: 'my-type' } }]
            expect(utils.getEndEventCount(arr)).toEqual(2)
          })
        })

        describe('hasUnconnectedActivities', () => {
          it('returns false if there are no entitites', () => {
            expect(utils.hasUnconnectedActivities([])).toBeFalsy()
          })

          it('does not care about entities that can be unconnected', () => {
            const arr = [{ businessObject: { $type: 'bpmn:DataObjectReference' } }, { businessObject: { $type: 'bpmn:DataStorageReference' } }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('does not care about labels', () => {
            const arr = [{ type: 'label', businessObject: { $type: 'bpmn:Task' }, incoming: [], outgoing: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('does not care about end events having only incoming edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:EndEvent' }, incoming: [sequenceFlow], outgoing: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('does not care about start events having only outgoing edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:StartEvent' }, outgoing: [sequenceFlow], incoming: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('recognizes a End event with no incoming edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:EndEvent' }, incoming: [], outgoing: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
          })

          it('recognizes a Start event with no outgoing edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:StartEvent' }, outgoing: [], incoming: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
          })

          it('ignores Data flows for Start Events', () => {
            const arr = [{ businessObject: { $type: 'bpmn:StartEvent' }, incoming: [], outgoing: [dataFlow] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
          })

          it('ignores Data flows for End Events', () => {
            const arr = [{ businessObject: { $type: 'bpmn:EndEvent' }, incoming: [dataFlow], outgoing: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
          })

          describe('it checks the necessary types', () => {
            NO_CONNECTIONS_DISALLOWED_OBJECTS.forEach((type) => {
              describe('it does not allow unconnected ' + type, () => {
                it('no connections results in true', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [],
                    incoming: []
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                })

                it('ignores Data Flows', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [dataFlow],
                    incoming: [dataFlow]
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                })

                it('only incoming connections results in true', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [],
                    incoming: [sequenceFlow]
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:EndEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('ignores Data Flows for incoming connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: [dataFlow]
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:StartEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('ignores Data Flows for outgoing connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [dataFlow],
                    incoming: [sequenceFlow]
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:EndEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('only outgoing connections results in true', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: []
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:StartEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('at least one incoming and one outgoing connection results in false', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: [sequenceFlow]
                  }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                })
              })
            })
          })
        })

        describe('hasExceedingConnectionCountElements', () => {
          it('returns false if there are no entitites', () => {
            expect(utils.hasExceedingConnectionCountElements([])).toBeFalsy()
          })

          describe('it ignores elements that can have multiple connections', () => {
            MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES.forEach((type) => {
              it('ignores too high connection count for ' + type, () => {
                const arr = [{
                  businessObject: { $type: type },
                  outgoing: [sequenceFlow, sequenceFlow],
                  incoming: [sequenceFlow, sequenceFlow]
                }]
                expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
              })
            })
          })
          describe('it ignores elements that do not enforce the connection rule', () => {
            ['bpmn:Process', 'bpmn:SequenceFlow', 'bpmn:DataFlow'].forEach((type) => {
              it('ignores too high connection count for ' + type, () => {
                const arr = [{
                  businessObject: { $type: type },
                  outgoing: [sequenceFlow, sequenceFlow],
                  incoming: [sequenceFlow, sequenceFlow]
                }]
                expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
              })
            })
          })
          describe('it handles a Start Event', () => {
            it('ignores incoming Connections of a start event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:StartEvent' },
                outgoing: [sequenceFlow],
                incoming: [sequenceFlow, sequenceFlow]
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
            it('correctly checks outgoing Connections of a start event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:StartEvent' },
                outgoing: [sequenceFlow],
                incoming: []
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
            it('results in false for too many outgoing Connections of a start event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:StartEvent' },
                outgoing: [sequenceFlow, sequenceFlow],
                incoming: []
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
            })
            it('ignores DataFlows for Connections of a start event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:StartEvent' },
                outgoing: [sequenceFlow, dataFlow],
                incoming: []
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
          })
          describe('it handles a End Event', () => {
            it('ignores outgoing Connections of a end event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:EndEvent' },
                outgoing: [sequenceFlow, sequenceFlow],
                incoming: [sequenceFlow]
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
            it('correctly checks incoming Connections of a end event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:EndEvent' },
                outgoing: [],
                incoming: [sequenceFlow]
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
            it('results in false for too many incoming Connections of a end event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:EndEvent' },
                outgoing: [],
                incoming: [sequenceFlow, sequenceFlow]
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
            })
            it('ignores DataFlows for Connections of a end event', () => {
              const arr = [{
                businessObject: { $type: 'bpmn:EndEvent' },
                outgoing: [],
                incoming: [sequenceFlow, dataFlow]
              }]
              expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
            })
          })
          describe('it checks for elements having too many connections', () => {
            CONNECTION_RULE_ENFORCED_ELEMENTS.forEach((type) => {
              describe('it does not allow too many connections for ' + type, () => {
                it('it results in true if a element has too many incoming connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: [sequenceFlow, sequenceFlow]
                  }]
                  if (type === 'bpmn:StartEvent') {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                  }
                })
                it('it results in true if a element has too many outgoing connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow, sequenceFlow],
                    incoming: [sequenceFlow]
                  }]
                  if (type === 'bpmn:EndEvent') {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                  }
                })
                it('it results in true if a element has too many outgoing and incoming connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow, sequenceFlow],
                    incoming: [sequenceFlow, sequenceFlow]
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                })
                it('it ignores Data Flows for incoming connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: [sequenceFlow, dataFlow]
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                })
                it('it ignores Data Flows for outgoing connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow, dataFlow],
                    incoming: [sequenceFlow]
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                })
                it('returns false for exactly 1 incoming and 1 outgoing connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: [sequenceFlow]
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                })
                it('returns true for exactly 1 incoming connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [],
                    incoming: [sequenceFlow]
                  }]
                  if (type === 'bpmn:EndEvent') {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                  }
                })
                it('returns true for exactly 1 outgoing connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [sequenceFlow],
                    incoming: []
                  }]
                  if (type === 'bpmn:StartEvent') {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                  }
                })
                it('returns true for no connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [],
                    incoming: []
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                })
                it('ignores data flows no connections', () => {
                  const arr = [{
                    businessObject: { $type: type },
                    outgoing: [dataFlow, dataFlow],
                    incoming: [dataFlow, dataFlow]
                  }]
                  expect(utils.hasExceedingConnectionCountElements(arr)).toBeTruthy()
                })
              })
            })
          })
        })
      })
    })
  })
})
