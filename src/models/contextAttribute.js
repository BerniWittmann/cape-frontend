import Base from './base.js'

export default class ContextAttribute extends Base {
  constructor({ _id, key, value }) {
    super()

    this.id = _id
    this.key = key
    this.value = value
  }

  toJSON() {
    return {
      '_id': this.id,
      'key': this.key,
      'value': this.value
    }
  }
}
