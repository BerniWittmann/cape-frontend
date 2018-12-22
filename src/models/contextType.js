import Base from './base.js'

export default class ContextType extends Base {
  constructor({ _id, name, icon }) {
    super()

    this.id = _id
    this.name = name
    this.icon = icon
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'icon': this.icon
    }
  }
}
