/**
 * Prevent EndEvents from being created multiple Times
 */

import { END_EVENT_TYPE } from '../../constants'

import EnsureOnlyOneEventOfTypeRule from './abstract-rules/ensureOnlyOneEventOfType'

export default class EnsureOnlyOneEndEventRule extends EnsureOnlyOneEventOfTypeRule {
  get type() {
    return END_EVENT_TYPE
  }
}
