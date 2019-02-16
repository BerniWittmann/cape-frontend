/* ============
 * Getters for the process module
 * ============
 *
 * The getters that are available on the
 * process module.
 */
import { getGraphNodes } from '@/vuex/common/helpers'

export default {
  processGraphNodes(state) {
    return getGraphNodes(state.processes, 'process', 'process.preview', 'processID')
  }
}
