/**
 * Prevent Unconnected entities when removing or changing connections
 */

import { hasUnconnectedActivities } from '../../utils'

import BaseRule from './baseRule'

export default class PreventUnconnectedElementsRule extends BaseRule {
  get events() {
    return [
      'commandStack.connection.reconnectStart.postExecute',
      'commandStack.connection.reconnectEnd.postExecute',
      'commandStack.connection.delete.executed'
    ]
  }

  handler() {
    setTimeout(() => {
      if (hasUnconnectedActivities(this.elementRegistry)) {
        this.commandStack.undo()
      }
    }, 200)
  }
}
