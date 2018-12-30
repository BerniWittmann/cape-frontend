import valArr, * as validators from '@/plugins/bpmn/modules/validators'

import { PROCESS_VALIDATION_ERRORS } from '@/utils/constants'

import * as utils from '@/plugins/bpmn/modules/utils'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Validators', () => {
        let context
        let validator

        beforeEach(() => {
          utils.hasUnconnectedActivities = jest.fn().mockReturnValue(false)
          utils.getStartEventCount = jest.fn().mockReturnValue(1)
          utils.getEndEventCount = jest.fn().mockReturnValue(1)
          utils.hasExceedingConnectionCountElements = jest.fn().mockReturnValue(false)

          context = {
            elementRegistry: [],
            eventBus: { name: 'eventBus', on: jest.fn() },
            commandStack: { undo: jest.fn() }
          }
        })

        it('returns an array of validators', () => {
          const length = valArr.length
          expect(length).toEqual(4)
          expect.assertions(length + 1)
          valArr.forEach(validator => {
            expect(validator).toEqual(expect.any(Function))
          })
        })
        describe('checks for unconnected entities', () => {
          beforeEach(() => {
            validator = validators.validateUnconnectedActivities.bind(undefined, [context.elementRegistry])
          })

          it('returns an error there are unconnected entities', () => {
            utils.hasUnconnectedActivities = jest.fn().mockReturnValue(true)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES))
          })
          it('returns no error if there are no unconnected entities', () => {
            expect(validator).not.toThrow()
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES))
          })
        })
        describe('checks for correct start event count', () => {
          beforeEach(() => {
            validator = validators.validateStartEventCount.bind(undefined, [context.elementRegistry])
          })
          it('returns an error there are no Start events', () => {
            utils.getStartEventCount = jest.fn().mockReturnValue(0)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.NO_START_EVENT))
          })
          it('returns an error if there is more than one start event', () => {
            utils.getStartEventCount = jest.fn().mockReturnValue(2)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_START_EVENTS))
          })
          it('returns no error if there is exactly one start event', () => {
            utils.getStartEventCount = jest.fn().mockReturnValue(1)
            expect(validator).not.toThrow()
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.NO_START_EVENT))
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_START_EVENTS))
          })
        })
        describe('checks for correct end event count', () => {
          beforeEach(() => {
            validator = validators.validateEndEventCount.bind(undefined, [context.elementRegistry])
          })
          it('returns an error there are no End events', () => {
            utils.getEndEventCount = jest.fn().mockReturnValue(0)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.NO_END_EVENT))
          })
          it('returns an error if there is more than one end event', () => {
            utils.getEndEventCount = jest.fn().mockReturnValue(2)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_END_EVENTS))
          })
          it('returns no error if there is exactly one end event', () => {
            utils.getEndEventCount = jest.fn().mockReturnValue(1)
            expect(validator).not.toThrow()
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.NO_END_EVENT))
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_END_EVENTS))
          })
        })
        describe('checks for entities with too many connections', () => {
          beforeEach(() => {
            validator = validators.validateExceedingConnectionCount.bind(undefined, [context.elementRegistry])
          })
          it('returns an error if there are entities with too many connections', () => {
            utils.hasExceedingConnectionCountElements = jest.fn().mockReturnValue(true)
            expect(validator).toThrowError(new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED))
          })
          it('returns no error if there are no entities with too many connections', () => {
            expect(validator).not.toThrow()
            expect(validator).not.toThrowError(new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED))
          })
        })
      })
    })
  })
})
