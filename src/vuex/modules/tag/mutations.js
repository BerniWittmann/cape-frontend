/* ============
 * Mutations for the tag module
 * ============
 *
 * The mutations that are available on the
 * tag module.
 */

import { STORE, ADD, REMOVE } from './mutation-types'

export default {
  [STORE](state, tags) {
    state.tags = tags || []
  },
  [ADD](state, tag) {
    state.tags.push(tag)
  },
  [REMOVE](state, tag) {
    state.tags = state.tags.filter(t => t.id !== tag.id)
  }
}
