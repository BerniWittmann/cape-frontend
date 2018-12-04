import { NO_CONNECTIONS_DISALLOWED_OBJECTS, END_EVENT_TYPE, START_EVENT_TYPE } from './constants'

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
    const hasIncomingConnections = el.incoming.length > 0
    const hasOutgoingConnections = el.outgoing.length > 0
    if (shapeIsType(el, END_EVENT_TYPE) && hasIncomingConnections) return false
    if (shapeIsType(el, START_EVENT_TYPE) && hasOutgoingConnections) return false
    return !(hasIncomingConnections && hasOutgoingConnections)
  })
  return unconnectedElements.length > 0
}
