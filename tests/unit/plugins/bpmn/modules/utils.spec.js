import * as utils from '@/plugins/bpmn/modules/utils'
import { NO_CONNECTIONS_DISALLOWED_OBJECTS } from '@/plugins/bpmn/modules/constants'

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

        describe('hasUnconnectedActivities', () => {
          it('returns false if there are no entitites', () => {
            expect(utils.hasUnconnectedActivities([])).toBeFalsy()
          })

          it('does not care about entities that can be unconnected', () => {
            const arr = [{ businessObject: { $type: 'bpmn:DataObjectReference' } }, { businessObject: { $type: 'bpmn:DataStorageReference' } }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('does not care about end events having only incoming edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:EndEvent' }, incoming: [{}], outgoing: [] }]
            expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
          })

          it('does not care about start events having only outgoing edges', () => {
            const arr = [{ businessObject: { $type: 'bpmn:StartEvent' }, outgoing: [{}], incoming: [] }]
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

          describe('it checks the necessary types', () => {
            NO_CONNECTIONS_DISALLOWED_OBJECTS.forEach((type) => {
              describe('it does not allow unconnected ' + type, () => {
                it('no connections results in true', () => {
                  const arr = [{ businessObject: { $type: type }, outgoing: [], incoming: [] }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                })

                it('only incoming connections results in true', () => {
                  const arr = [{ businessObject: { $type: type }, outgoing: [], incoming: [{}] }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:EndEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('only outgoing connections results in true', () => {
                  const arr = [{ businessObject: { $type: type }, outgoing: [{}], incoming: [] }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  if (type === 'bpmn:StartEvent') {
                    expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                  } else {
                    expect(utils.hasUnconnectedActivities(arr)).toBeTruthy()
                  }
                })

                it('at least one incoming and one outgoing connection results in false', () => {
                  const arr = [{ businessObject: { $type: type }, outgoing: [{}], incoming: [{}] }, { businessObject: { $type: 'bpmn:DataObjectReference' } }]
                  expect(utils.hasUnconnectedActivities(arr)).toBeFalsy()
                })
              })
            })
          })
        })
      })
    })
  })
})
