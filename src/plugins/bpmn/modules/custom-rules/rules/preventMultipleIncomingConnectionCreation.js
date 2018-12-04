/**
 * Prevent Elements from having multiple incoming connections when adding a connection
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../utils'
import { DATA_OBJECT_TYPES, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleIncomingConnectionCreationRule extends BaseRule {
  get events() {
    return ['commandStack.connection.create.canExecute']
  }

  handler({ context }) {
    // Data Elements can be references without restrictions
    if (!(shapeHasType(context.source, DATA_OBJECT_TYPES) || shapeHasType(context.target, DATA_OBJECT_TYPES))) {
      // Elements can have one incoming connection at max
      if (!shapeHasType(context.target, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && context.target.incoming.length > 0) {
        return false
      }
    }
  }
}
