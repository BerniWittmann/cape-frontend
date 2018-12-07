import ValidationRule from '@/plugins/bpmn/modules/custom-rules/rules/validation'

import { PROCESS_VALIDATION_ERRORS } from '@/utils/constants'

import * as utils from '@/plugins/bpmn/modules/utils'

describe('Plugins', () => {
  describe('BPMN', () => {
    describe('Modules', () => {
      describe('Custom Rules', () => {
        describe('Validation Rule', () => {
          let context
          let rule

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
            rule = new ValidationRule(context)
          })
          it('has an event array', () => {
            expect(rule.events).toEqual(expect.any(Array))
            expect(rule.events.length).toBeGreaterThan(0)
          })
          it('has a handler', () => {
            expect(rule.handler).toEqual(expect.any(Function))
          })
          it('returns nothing if everything is correct', () => {
            expect(rule.handler()).toBeUndefined()
          })
          describe('checks for unconnected entities', () => {
            it('returns an error there are unconnected entities', () => {
              utils.hasUnconnectedActivities = jest.fn().mockReturnValue(true)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES))
            })
            it('returns no error if there are no unconnected entities', () => {
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES))
            })
          })
          describe('checks for correct start event count', () => {
            it('returns an error there are no Start events', () => {
              utils.getStartEventCount = jest.fn().mockReturnValue(0)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.NO_START_EVENT))
            })
            it('returns an error if there is more than one start event', () => {
              utils.getStartEventCount = jest.fn().mockReturnValue(2)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_START_EVENTS))
            })
            it('returns no error if there is exactly one start event', () => {
              utils.getStartEventCount = jest.fn().mockReturnValue(1)
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.NO_START_EVENT))
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_START_EVENTS))
            })
          })
          describe('checks for correct end event count', () => {
            it('returns an error there are no End events', () => {
              utils.getEndEventCount = jest.fn().mockReturnValue(0)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.NO_END_EVENT))
            })
            it('returns an error if there is more than one end event', () => {
              utils.getEndEventCount = jest.fn().mockReturnValue(2)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_END_EVENTS))
            })
            it('returns no error if there is exactly one end event', () => {
              utils.getEndEventCount = jest.fn().mockReturnValue(1)
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.NO_END_EVENT))
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_END_EVENTS))
            })
          })
          describe('checks for entities with too many connections', () => {
            it('returns an error if there are entities with too many connections', () => {
              utils.hasExceedingConnectionCountElements = jest.fn().mockReturnValue(true)
              expect(rule.handler()).toEqual(new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED))
            })
            it('returns no error if there are no entities with too many connections', () => {
              expect(rule.handler()).not.toEqual(new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED))
            })
          })
        })
      })
    })
  })
})
