import {
  NO_CONNECTIONS_DISALLOWED_OBJECTS,
  END_EVENT_TYPE,
  START_EVENT_TYPE,
  MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES,
  CONNECTION_RULE_ENFORCED_ELEMENTS,
  SEQUENCE_FLOW_TYPE
} from './constants'

export function shapeIsType(shape, type) {
  if (!shape || !shape.businessObject) return false
  return shape.businessObject.$type === type
}

export function shapeHasType(shape, types) {
  if (!shape || !shape.businessObject) return false
  return types.includes(shape.businessObject.$type)
}

export function getElementsByType(elementRegistry, type) {
  return elementRegistry.filter(el => shapeIsType(el, type))
}

export function hasUnconnectedActivities(elementRegistry) {
  const unconnectedElements = elementRegistry.filter(el => {
    if (!shapeHasType(el, NO_CONNECTIONS_DISALLOWED_OBJECTS)) return false
    if (el.type === 'label') return false
    const hasIncomingConnections = el.incoming.filter(c => shapeIsType(c, SEQUENCE_FLOW_TYPE)).length > 0
    const hasOutgoingConnections = el.outgoing.filter(c => shapeIsType(c, SEQUENCE_FLOW_TYPE)).length > 0
    if (shapeIsType(el, END_EVENT_TYPE) && hasIncomingConnections) return false
    if (shapeIsType(el, START_EVENT_TYPE) && hasOutgoingConnections) return false
    return !(hasIncomingConnections && hasOutgoingConnections)
  })
  return unconnectedElements.length > 0
}

export function hasExceedingConnectionCountElements(elementRegistry) {
  const invalidConnectedElements = elementRegistry.filter(el => {
    if (shapeHasType(el, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES)) return false
    if (!shapeHasType(el, CONNECTION_RULE_ENFORCED_ELEMENTS)) return false
    const incomingConnections = el.incoming.filter(c => shapeIsType(c, SEQUENCE_FLOW_TYPE)).length
    const outgoingConnections = el.outgoing.filter(c => shapeIsType(c, SEQUENCE_FLOW_TYPE)).length
    if (shapeIsType(el, END_EVENT_TYPE) && incomingConnections === 1) return false
    if (shapeIsType(el, START_EVENT_TYPE) && outgoingConnections === 1) return false
    return !(incomingConnections === 1 && outgoingConnections === 1)
  })
  return invalidConnectedElements.length > 0
}

export function getStartEventCount(elementRegistry) {
  const startEvents = elementRegistry.filter(el => {
    return shapeIsType(el, START_EVENT_TYPE)
  })
  return startEvents.length
}

export function getEndEventCount(elementRegistry) {
  const endEvents = elementRegistry.filter(el => {
    return shapeIsType(el, END_EVENT_TYPE)
  })
  return endEvents.length
}
