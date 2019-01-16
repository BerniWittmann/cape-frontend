import Base from './base.js'
import ContextType from './contextType.js'
import ContextAttribute from './contextAttribute.js'

export default class ContextFactor extends Base {
  constructor({ _id, parentID, name, attributes = [], context_type: contextType }) {
    super()
    this.id = _id
    this.parentID = parentID
    this.name = name
    this.attributes = attributes.map(a => new ContextAttribute(a))
    this.contextType = contextType ? new ContextType(contextType) : undefined
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'parentID': this.parentID,
      'attributes': this.attributes.map(a => a.toJSON()),
      'context_type': this.contextType ? this.contextType.toJSON() : undefined
    }
  }
}
