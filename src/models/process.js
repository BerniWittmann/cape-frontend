import moment from 'moment'

import Base from './base.js'
import Tag from './tag.js'

export default class Process extends Base {
  constructor({ _id, name, created_at: createdAt, last_edited_at: lastEditedAt, tags = [] }) {
    super()

    this.id = _id
    this.name = name
    this.createdAt = moment(createdAt)
    this.lastEditedAt = moment(lastEditedAt)
    this.tags = tags.map(t => new Tag(t))
  }

  toJSON() {
    return {
      '_id': this.id,
      'name': this.name
    }
  }
}
