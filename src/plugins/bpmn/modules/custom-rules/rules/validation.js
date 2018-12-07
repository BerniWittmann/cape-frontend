/**
 * Validates the BPMN Model manually
 */

import { PROCESS_VALIDATION_ERRORS } from '@/utils/constants'
import { hasUnconnectedActivities, getStartEventCount, getEndEventCount, hasExceedingConnectionCountElements } from '../../utils'

import BaseRule from './baseRule'

export default class ValidationRule extends BaseRule {
  get events() {
    return ['validate']
  }

  handler() {
    if (hasUnconnectedActivities(this.elementRegistry)) {
      return new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES)
    }

    const countStartEvents = getStartEventCount(this.elementRegistry)
    if (countStartEvents === 0) {
      return new Error(PROCESS_VALIDATION_ERRORS.NO_START_EVENT)
    }
    if (countStartEvents > 1) {
      return new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_START_EVENTS)
    }

    const countEndEvents = getEndEventCount(this.elementRegistry)
    if (countEndEvents === 0) {
      return new Error(PROCESS_VALIDATION_ERRORS.NO_END_EVENT)
    }
    if (countEndEvents > 1) {
      return new Error(PROCESS_VALIDATION_ERRORS.TOO_MANY_END_EVENTS)
    }

    if (hasExceedingConnectionCountElements(this.elementRegistry)) {
      return new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED)
    }
  }
}
