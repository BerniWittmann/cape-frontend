import setupRules from './rules'
/**
 * Customizes the Modeling Rules
 *
 */
class CustomRules {
  constructor(eventBus, elementRegistry, commandStack) {
    setupRules({ eventBus, elementRegistry, commandStack })
  }
}

CustomRules.$inject = ['eventBus', 'elementRegistry', 'commandStack']

export default CustomRules
