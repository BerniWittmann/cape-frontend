/**
 * Prevent Elements from having multiple outgoing connections when adding a connection
 *
 * This excludes gateways
 */

import PreventMultipleConnectionCreationOfTypeRule from './abstract-rules/preventMultipleConnectionCreationOfType'

export default class PreventMultipleOutgoingConnectionCreationRule extends PreventMultipleConnectionCreationOfTypeRule {
  get node() {
    return 'source'
  }

  get type() {
    return 'outgoing'
  }
}
