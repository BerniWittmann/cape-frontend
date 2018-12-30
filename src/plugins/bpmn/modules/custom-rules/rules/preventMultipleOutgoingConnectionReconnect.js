/**
 * Prevent Elements from having multiple outgoing connections when reconnecting a connection start
 *
 * This excludes gateways
 */

import PreventMultipleIncomingConnectionReconnectOfTypeRule
  from './abstract-rules/preventMultipleConnectionReconnectOfType'

export default class PreventMultipleOutgoingConnectionReconnectRule extends PreventMultipleIncomingConnectionReconnectOfTypeRule {
  get events() {
    return ['commandStack.connection.reconnectStart.canExecute']
  }

  get type() {
    return 'outgoing'
  }
}
