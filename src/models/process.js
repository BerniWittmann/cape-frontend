import moment from 'moment'

import Base from './base.js'
import Tag from './tag.js'

export default class Process extends Base {
  constructor({ _id, name, description, created_at: createdAt, last_edited_at: lastEditedAt, tags = [], xml, svg } = {}) {
    super()

    this.id = _id
    this.name = name
    this.description = description
    this.createdAt = moment(createdAt)
    this.lastEditedAt = moment(lastEditedAt)
    this.tags = tags.map(t => new Tag(t))
    this.xml = xml
    this.svg = svg
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name,
      'description': this.description,
      'tags': this.tags.map(t => t.toJSON()),
      'xml': this.xml,
      'svg': this.svg
    }
  }
}
