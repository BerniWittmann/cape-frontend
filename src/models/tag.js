import Base from './base.js'

export default class Tag extends Base {
  constructor({ _id, name, color }) {
    super()

    this.id = _id
    this.name = name
    this.color = color
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'color': this.color
    }
  }
}
