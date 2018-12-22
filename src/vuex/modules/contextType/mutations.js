/* ============
 * Mutations for the Context Type module
 * ============
 *
 * The mutations that are available on the
 * Context Type module.
 */

import { STORE, ADD, REMOVE } from './mutation-types'

export default {
  [STORE](state, contextTypes) {
    state.contextTypes = contextTypes || []
  },
  [ADD](state, contextType) {
    state.contextTypes.push(contextType)
  },
  [REMOVE](state, contextType) {
    state.contextTypes = state.contextTypes.filter(ct => ct.id !== contextType.id)
  }
}
