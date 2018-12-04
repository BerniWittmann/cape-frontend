/**
 * Prevent Elements from having multiple outgoing connections when reconnecting a connection start
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../utils'
import { MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleOutgoingConnectionReconnectRule extends BaseRule {
  get events() {
    return ['commandStack.connection.reconnectStart.canExecute']
  }

  handler({ context }) {
    const source = context.hover
    if (!source) return false

    // Elements can have one outgoing connection at max
    if (!shapeHasType(source, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && source.outgoing.length > 0) {
      return false
    }
  }
}
