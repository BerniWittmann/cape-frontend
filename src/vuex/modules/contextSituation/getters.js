/* ============
 * Getters for the contextSituation  module
 * ============
 *
 * The getters that are available on the
 * contextSituation  module.
 */

import { getGraphNodes } from '@/vuex/common/helpers'

export default {
  contextSituationGraphNodes(state) {
    return getGraphNodes(state.contextSituations, 'situation', 'context_situations.single', 'contextSituationID')
  }
}
