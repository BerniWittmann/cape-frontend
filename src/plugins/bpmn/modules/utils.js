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

function getConnectionCountForElement(el) {
  return {
    incomingConnections: getElementsByType(el.incoming, SEQUENCE_FLOW_TYPE).length,
    outgoingConnections: getElementsByType(el.outgoing, SEQUENCE_FLOW_TYPE).length
  }
}

function checkElementForUnconnectedActivities(el) {
  if (!shapeHasType(el, NO_CONNECTIONS_DISALLOWED_OBJECTS) || el.type === 'label') return false
  if (isCorrectStartEvent(el) || isCorrectEndEvent(el)) return false
  const { incomingConnections, outgoingConnections } = getConnectionCountForElement(el)
  const hasIncomingConnections = incomingConnections > 0
  const hasOutgoingConnections = outgoingConnections > 0
  return !(hasIncomingConnections && hasOutgoingConnections)
}

export function hasUnconnectedActivities(elementRegistry) {
  return elementRegistry.filter(checkElementForUnconnectedActivities).length > 0
}

function isCorrectStartEvent(el) {
  return shapeIsType(el, START_EVENT_TYPE) && getConnectionCountForElement(el).outgoingConnections === 1
}

function isCorrectEndEvent(el) {
  return shapeIsType(el, END_EVENT_TYPE) && getConnectionCountForElement(el).incomingConnections === 1
}

function checkElementForExceedingConnectionCount(el) {
  if (shapeHasType(el, MULTIPLE_SEQUENCE_FLOW_ALLOWED_OBJECT_TYPES) || !shapeHasType(el, CONNECTION_RULE_ENFORCED_ELEMENTS)) return false
  if (isCorrectStartEvent(el) || isCorrectEndEvent(el)) return false
  const { incomingConnections, outgoingConnections } = getConnectionCountForElement(el)
  return !(incomingConnections === 1 && outgoingConnections === 1)
}

export function hasExceedingConnectionCountElements(elementRegistry) {
  return elementRegistry.filter(checkElementForExceedingConnectionCount).length > 0
}

export function getStartEventCount(elementRegistry) {
  return getElementsByType(elementRegistry, START_EVENT_TYPE).length
}

export function getEndEventCount(elementRegistry) {
  return getElementsByType(elementRegistry, END_EVENT_TYPE).length
}

export function isCustomElement(element) {
  return element && /^cape:/.test(element.$type)
}
