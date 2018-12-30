/**
 * Prevent Elements from having multiple incoming connections when reconnecting a connection end
 *
 * This excludes gateways
 */

import PreventMultipleIncomingConnectionReconnectOfTypeRule
  from './abstract-rules/preventMultipleConnectionReconnectOfType'

export default class PreventMultipleIncomingConnectionReconnectRule extends PreventMultipleIncomingConnectionReconnectOfTypeRule {
  get events() {
    return ['commandStack.connection.reconnectEnd.canExecute']
  }

  get type() {
    return 'incoming'
  }
}
