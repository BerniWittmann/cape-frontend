/**
 * Prevent Elements from having multiple incoming or outgoing connections when reconnecting a connection end/start
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../../utils'
import { MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleIncomingConnectionReconnectOfTypeRule extends BaseRule {
  get events() {
    throw new Error('Not Implemented')
  }

  get type() {
    throw new Error('Not Implemented')
  }

  handler({ context }) {
    const el = context.hover
    if (!el) return false

    // Elements can have one incoming/outgoing connection at max
    if (!shapeHasType(el, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && el[this.type].length > 0) {
      return false
    }
  }
}
