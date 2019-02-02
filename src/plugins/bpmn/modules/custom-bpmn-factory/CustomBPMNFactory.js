import inherits from 'inherits'

import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

/**
 * A custom factory that knows how to create BPMN _and_ custom elements.
 */
export default function CustomBPMNFactory(moddle) {
  this._model = moddle
  BpmnFactory.call(this, moddle)
}

inherits(CustomBPMNFactory, BpmnFactory)

CustomBPMNFactory.$inject = [
  'moddle'
]

CustomBPMNFactory.prototype._needsId = function (element) {
  if (/^cape:/.test(element.$type)) return true

  return BpmnFactory.prototype._needsId(element)
}
