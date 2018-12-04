/**
 * Prevent Elements from having multiple incoming connections when reconnecting a connection end
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../utils'
import { MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleIncomingConnectionReconnectRule extends BaseRule {
  get events() {
    return ['commandStack.connection.reconnectEnd.canExecute']
  }

  handler({ context }) {
    const target = context.hover
    if (!target) return false

    // Elements can have one incoming connection at max
    if (!shapeHasType(target, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && target.incoming.length > 0) {
      return false
    }
  }
}
