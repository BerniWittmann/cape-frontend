import inherits from 'inherits'

import { shapeHasType, isCustomElement } from '../utils'

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

const HIGH_PRIORITY = 1500

/**
 * Specific rules for custom elements
 */
export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus)
}

inherits(CustomRules, RuleProvider)

CustomRules.$inject = [ 'eventBus' ]

CustomRules.prototype.init = function () {
  /**
   * Can shape be created on target container?
   */
  function canCreate(shape, target) {
    // only judge about custom elements
    if (!isCustomElement(shape)) {
      return
    }

    // allow creation on processes
    return shapeHasType(target, ['bpmn:Process', 'bpmn:Participant', 'bpmn:Collaboration', 'bpmn:SequenceFlow'])
  }

  this.addRule('shape.create', HIGH_PRIORITY, context => {
    const target = context.target
    const shape = context.shape

    return canCreate(shape, target)
  })

  this.addRule('shape.resize', HIGH_PRIORITY, context => {
    const shape = context.shape

    if (isCustomElement(shape)) {
      // cannot resize custom elements
      return false
    }
  })
}
