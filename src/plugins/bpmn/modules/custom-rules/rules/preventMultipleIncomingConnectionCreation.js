/**
 * Prevent Elements from having multiple incoming connections when adding a connection
 *
 * This excludes gateways
 */

import PreventMultipleConnectionCreationOfTypeRule from './abstract-rules/preventMultipleConnectionCreationOfType'

export default class PreventMultipleIncomingConnectionCreationRule extends PreventMultipleConnectionCreationOfTypeRule {
  get type() {
    return 'incoming'
  }

  get node() {
    return 'target'
  }
}
