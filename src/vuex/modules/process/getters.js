/* ============
 * Getters for the process module
 * ============
 *
 * The getters that are available on the
 * process module.
 */
import { getGraphNodes, getByTags } from '@/vuex/common/helpers'

export default {
  processGraphNodes(state) {
    return getGraphNodes(state.processes, 'process', 'process.preview', 'processID')
  },

  processesByTags(state, getters, rootState) {
    return getByTags(state.processes, rootState.tag.tags)
  }
}
