/**
 * Prevent EndEvents from being created multiple Times
 */

import { shapeIsType, getElementsByType } from '../../utils'
import { END_EVENT_TYPE } from '../../constants'

import BaseRule from './baseRule'

export default class EnsureOnlyOneEndEventRule extends BaseRule {
  get events() {
    return ['commandStack.shape.create.canExecute']
  }

  handler({ context }) {
    const shape = context.shape

    if (shapeIsType(shape, END_EVENT_TYPE)) {
      // Check for only one Start Event
      if (getElementsByType(this.elementRegistry, shape.businessObject.$type).length > 0) {
        return false
      }
    }
  }
}
