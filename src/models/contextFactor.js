import Base from './base.js'
import ContextType from './contextType.js'
import ContextAttribute from './contextAttribute.js'
import ContextRule from './contextRule.js'

export default class ContextFactor extends Base {
  constructor({ _id, parentID, name, attributes = [], context_type: contextType, context_rules: contextRules = [] }) {
    super()

    this.id = _id
    this.parentID = parentID
    this.name = name
    this.attributes = attributes.map(a => new ContextAttribute(a))
    this.contextType = contextType ? new ContextType(contextType) : undefined
    this.contextRules = contextRules.map(r => new ContextRule(r))
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'parentID': this.parentID,
      'attributes': this.attributes.map(a => {
        let ca = new ContextAttribute(a)
        ca.id = a.id
        return ca.toJSON()
      }),
      'context_type': this.contextType ? this.contextType.toJSON() : undefined,
      'context_rules': this.contextRules.map(r => r.toJSON())
    }
  }
}
