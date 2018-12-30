/**
 * Prevent EndEvents or StartEvents from being created multiple Times
 */

import { shapeIsType, getElementsByType } from '../../../utils'

import BaseRule from './baseRule'

export default class EnsureOnlyOneEventOfTypeRule extends BaseRule {
  get events() {
    return ['commandStack.shape.create.canExecute']
  }

  get type() {
    throw new Error('Not Implemented')
  }

  handler({ context }) {
    const shape = context.shape

    if (shapeIsType(shape, this.type)) {
      // Check for only one Event
      if (getElementsByType(this.elementRegistry, shape.businessObject.$type).length > 0) {
        return false
      }
    }
  }
}
