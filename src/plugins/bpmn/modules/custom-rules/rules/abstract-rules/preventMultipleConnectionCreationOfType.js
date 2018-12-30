/**
 * Prevent Elements from having multiple incoming or outgoing connections when adding a connection
 *
 * This excludes gateways
 */

import { shapeHasType } from '../../../utils'
import { DATA_OBJECT_TYPES, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES } from '../../../constants'

import BaseRule from './baseRule'

export default class PreventMultipleConnectionCreationOfTypeRule extends BaseRule {
  get events() {
    return ['commandStack.connection.create.canExecute']
  }

  get type() {
    throw new Error('Not Implemented')
  }

  get node() {
    throw new Error('Not Implemented')
  }

  handler({ context }) {
    // Data Elements can be references without restrictions
    if (!(shapeHasType(context.source, DATA_OBJECT_TYPES) || shapeHasType(context.target, DATA_OBJECT_TYPES))) {
      // Elements can have one incoming/outgoing connection at max
      if (!shapeHasType(context[this.node], MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) && context[this.node][this.type].length > 0) {
        return false
      }
    }
  }
}
