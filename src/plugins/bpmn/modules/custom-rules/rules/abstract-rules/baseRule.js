/**
 * Base Rule
 */

export default class BaseRule {
  /**
   * Rule Priority, with which the rule should be checked
   */
  get priority() {
    return 10000
  }

  /**
   * Events that trigger the rule
   */
  get events() {
    return []
  }

  /**
   * Constructor that binds the context and setups the event listener
   */
  constructor(context) {
    Object.keys(context).forEach((key) => {
      this[key] = context[key]
    })
    this.eventBus.on(this.events, this.priority, this.handler.bind(this))
  }

  /**
   * The handler for checking whether the rule constraint is failed or not
   */
  handler() {
    throw new Error('Not Implemented')
  }
}
