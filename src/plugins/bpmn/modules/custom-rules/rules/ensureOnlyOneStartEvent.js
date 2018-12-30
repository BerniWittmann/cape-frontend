/**
 * Prevent StartEvents from being created multiple Times
 */

import { START_EVENT_TYPE } from '../../constants'

import EnsureOnlyOneEventOfTypeRule from './abstract-rules/ensureOnlyOneEventOfType'

export default class EnsureOnlyOneStartEventRule extends EnsureOnlyOneEventOfTypeRule {
  get type() {
    return START_EVENT_TYPE
  }
}
