import Base from './base'
import Tag from './tag'

export default class ContextSituation extends Base {
  constructor({ _id, parentID, name, tags = [], rules }) {
    super()
    this.id = _id
    this.name = name
    this.tags = tags.map(t => new Tag(t))
    this.rules = rules
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'tags': this.tags.map(t => t.toJSON()),
      'rules': this.rules
    }
  }
}
