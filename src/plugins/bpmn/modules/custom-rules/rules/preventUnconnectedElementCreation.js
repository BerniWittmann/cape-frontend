/**
 * Prevent Unconnected entities from being created
 */

import { shapeHasType } from '../../utils'
import { NO_CONNECTIONS_DISALLOWED_OBJECTS, PROCESS_TYPES } from '../../constants'

import BaseRule from './abstract-rules/baseRule'

export default class PreventUnconnectedElementCreationRule extends BaseRule {
  get events() {
    return ['commandStack.shape.create.canExecute']
  }

  handler({ context }) {
    const shape = context.shape

    // Prevent Creation of unconnected entitites
    if (shapeHasType(shape, NO_CONNECTIONS_DISALLOWED_OBJECTS) && shapeHasType(context.target, PROCESS_TYPES)) {
      return false
    }
  }
}
