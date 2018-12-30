/**
 * Validates the BPMN Model manually
 */

import BaseRule from './abstract-rules/baseRule'

import validators from '../../validators'

export default class ValidationRule extends BaseRule {
  get events() {
    return ['validate']
  }

  handler() {
    try {
      validators.forEach(val => val(this.elementRegistry))
    } catch (e) {
      return e
    }
  }
}
