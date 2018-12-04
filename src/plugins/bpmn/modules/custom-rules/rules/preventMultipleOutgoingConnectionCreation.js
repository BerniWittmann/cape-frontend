/**
 * Prevent Elements from having multiple outgoing connections when adding a connection
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../utils'
import { DATA_OBJECT_TYPES, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleOutgoingConnectionCreationRule extends BaseRule {
  get events() {
    return ['commandStack.connection.create.canExecute']
  }

  handler({ context }) {
    // Data Elements can be references without restrictions
    if (!(shapeHasType(context.source, DATA_OBJECT_TYPES) || shapeHasType(context.target, DATA_OBJECT_TYPES))) {
      // Elements can have one outgoing connection at max
      if (!shapeHasType(context.source, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && context.source.outgoing.length > 0) {
        return false
      }
    }
  }
}
