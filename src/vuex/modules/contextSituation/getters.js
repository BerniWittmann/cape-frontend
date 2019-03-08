/* ============
 * Getters for the contextSituation  module
 * ============
 *
 * The getters that are available on the
 * contextSituation  module.
 */

import { getGraphNodes, getByTags } from '@/vuex/common/helpers'

export default {
  contextSituationGraphNodes(state) {
    return getGraphNodes(state.contextSituations, 'situation', 'context_situations.single', 'contextSituationID')
  },

  contextSituationsByTags(state, getters, rootState) {
    return getByTags(state.contextSituations, rootState.tag.tags)
  }
}
