/* ============
 * Mutations for the contextFactor  module
 * ============
 *
 * The mutations that are available on the
 * contextFactor  module.
 */

import { STORE, UPDATE, ADD, SET_ACTIVE } from './mutation-types'
import { update, setActive } from '@/vuex/common/mutations'

export default {
  [STORE](state, contextFactors) {
    state.contextFactors = contextFactors || []
  },
  [UPDATE](state, contextFactor) {
    update(state, 'contextFactors', 'activeContextFactor', contextFactor)
  },
  [ADD](state, contextFactor) {
    state.contextFactors.push(contextFactor)
  },
  [SET_ACTIVE](state, contextFactor) {
    setActive(state, 'contextFactors', 'activeContextFactor', contextFactor)
  }
}
