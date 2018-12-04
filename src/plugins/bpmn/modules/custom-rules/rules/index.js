import EnsureOnlyOneStartEventRule from './ensureOnlyOneStartEvent'
import EnsureOnlyOneEndEventRule from './ensureOnlyOneEndEvent'
import PreventUnconnectedElementCreationRule from './preventUnconnectedElementCreation'
import PreventMultipleIncomingConnectionCreationRule from './preventMultipleIncomingConnectionCreation'
import PreventMultipleOutgoingConnectionCreationRule from './preventMultipleOutgoingConnectionCreation'
import PreventMultipleIncomingConnectionReconnectRule from './preventMultipleIncomingConnectionReconnect'
import PreventMultipleOutgoingConnectionReconnectRule from './preventMultipleOutgoingConnectionReconnect'
import PreventUnconnectedElementsRule from './preventUnconnectedElements'

export const rules = {
  EnsureOnlyOneStartEventRule,
  EnsureOnlyOneEndEventRule,
  PreventUnconnectedElementCreationRule,
  PreventMultipleIncomingConnectionCreationRule,
  PreventMultipleOutgoingConnectionCreationRule,
  PreventMultipleIncomingConnectionReconnectRule,
  PreventMultipleOutgoingConnectionReconnectRule,
  PreventUnconnectedElementsRule
}

export default function setupRules(context) {
  Object.keys(rules).forEach(rule => {
    // eslint-disable-next-line no-new
    new rules[rule](context)
  })
}
