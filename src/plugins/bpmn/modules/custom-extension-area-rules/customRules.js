import { reduce } from 'min-dash'

import inherits from 'inherits'

import { is } from 'bpmn-js/lib/util/ModelUtil'

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

const HIGH_PRIORITY = 9500

function isCustom(element) {
  return element && /^cape:/.test(element.type)
}

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
    if (!isCustom(shape)) {
      return
    }

    // allow creation on processes
    return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration') || is(target, 'bpmn:SequenceFlow')
  }

  this.addRule('elements.move', HIGH_PRIORITY, context => {
    const target = context.target
    const shapes = context.shapes

    let type

    // do not allow mixed movements of custom / BPMN shapes
    // if any shape cannot be moved, the group cannot be moved, too
    // reject, if we have at least one
    // custom element that cannot be moved
    return reduce(shapes, function (result, s) {
      if (type === undefined) {
        type = isCustom(s)
      }

      if (type !== isCustom(s) || result === false) {
        return false
      }

      return canCreate(s, target)
    }, undefined)
  })

  this.addRule('shape.create', HIGH_PRIORITY, context => {
    const target = context.target
    const shape = context.shape

    return canCreate(shape, target)
  })

  this.addRule('shape.resize', HIGH_PRIORITY, context => {
    const shape = context.shape

    if (isCustom(shape)) {
      // cannot resize custom elements
      return false
    }
  })
}
