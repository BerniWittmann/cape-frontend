import Base from './base.js'

export default class ContextFactor extends Base {
  constructor({ _id, parentID, name, attributes }) {
    super()
    this.id = _id
    this.parentID = parentID
    this.name = name
    this.attributes = attributes
  }
}
