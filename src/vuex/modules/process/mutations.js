/* ============
 * Mutations for the process module
 * ============
 *
 * The mutations that are available on the
 * process module.
 */

import { STORE } from './mutation-types'

export default {
  [STORE](state, processes) {
    state.processes = processes || []
  }
}
