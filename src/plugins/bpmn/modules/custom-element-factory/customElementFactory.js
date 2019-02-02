import inherits from 'inherits'

import BpmnElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'

/**
 * A custom factory that knows how to create BPMN _and_ custom elements.
 */
export default function CustomElementFactory(bpmnFactory, moddle) {
  BpmnElementFactory.call(this, bpmnFactory, moddle)
}

inherits(CustomElementFactory, BpmnElementFactory)

CustomElementFactory.$inject = [
  'bpmnFactory',
  'moddle'
]

/**
 * Returns the default size of custom shapes.
 *
 * The following example shows an interface on how
 * to setup the custom shapes's dimensions.
 *
 * @example
 *
 * var shapes = {
 *   triangle: { width: 40, height: 40 },
 *   rectangle: { width: 100, height: 20 }
 * };
 *
 * return shapes[type];
 *
 *
 * @param {String} type
 *
 * @return {Dimensions} a {width, height} object representing the size of the element
 */
CustomElementFactory.prototype._getCustomElementSize = function (type) {
  const shapes = {
    __default: { width: 100, height: 80 },
    'cape:ExtensionArea': { width: 100, height: 80 }
  }

  return shapes[type] || shapes.__default
}
