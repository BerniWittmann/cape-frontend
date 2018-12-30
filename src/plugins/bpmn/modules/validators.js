import { PROCESS_VALIDATION_ERRORS } from '@/utils/constants'
import {
  hasUnconnectedActivities,
  getStartEventCount,
  getEndEventCount,
  hasExceedingConnectionCountElements
} from './utils'

export function validateUnconnectedActivities(elementRegistry) {
  if (hasUnconnectedActivities(elementRegistry)) {
    throw new Error(PROCESS_VALIDATION_ERRORS.UNCONNECTED_ENTITIES)
  }
}

function validateEventCountExactlyOne(count, type) {
  if (count === 0) {
    throw new Error(PROCESS_VALIDATION_ERRORS['NO_' + type.toUpperCase() + '_EVENT'])
  }
  if (count > 1) {
    throw new Error(PROCESS_VALIDATION_ERRORS['TOO_MANY_' + type.toUpperCase() + '_EVENTS'])
  }
}

export function validateStartEventCount(elementRegistry) {
  validateEventCountExactlyOne(getStartEventCount(elementRegistry), 'start')
}

export function validateEndEventCount(elementRegistry) {
  validateEventCountExactlyOne(getEndEventCount(elementRegistry), 'end')
}

export function validateExceedingConnectionCount(elementRegistry) {
  if (hasExceedingConnectionCountElements(elementRegistry)) {
    throw new Error(PROCESS_VALIDATION_ERRORS.ELEMENT_CONNECTIONS_EXCEEDED)
  }
}

export default [validateUnconnectedActivities, validateStartEventCount, validateEndEventCount, validateExceedingConnectionCount]
