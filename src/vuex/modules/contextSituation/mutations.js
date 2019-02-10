/* ============
 * Mutations for the contextSituation  module
 * ============
 *
 * The mutations that are available on the
 * contextSituation  module.
 */

import { STORE, UPDATE, SET_ACTIVE } from './mutation-types'
import { update, setActive } from '@/vuex/common/mutations'

export default {
  [STORE](state, contextSituations) {
    state.contextSituations = contextSituations || []
  },
  [UPDATE](state, contextSituation) {
    update(state, 'contextSituations', 'activeContextSituation', contextSituation)
  },
  [SET_ACTIVE](state, contextSituation) {
    setActive(state, 'contextSituations', 'activeContextSituation', contextSituation)
  }
}
