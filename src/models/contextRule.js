import Base from './base.js'

export default class ContextRule extends Base {
  constructor({ _id, state, rule }) {
    super()

    this.id = _id
    this.state = state
    this.rule = rule
  }

  toJSON() {
    return {
      '_id': this.id,
      'state': this.state,
      'rule': this.rule
    }
  }
}
