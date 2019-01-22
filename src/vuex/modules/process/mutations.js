/* ============
 * Mutations for the process module
 * ============
 *
 * The mutations that are available on the
 * process module.
 */

import { removeByID } from '@/utils/helpers'
import { update, setActive } from '@/vuex/common/mutations'
import { STORE, UPDATE, SET_ACTIVE, ADD, REMOVE } from './mutation-types'

export default {
  [STORE](state, processes) {
    state.processes = processes || []
  },
  [UPDATE](state, process) {
    update(state, 'processes', 'activeProcess', process)
  },
  [SET_ACTIVE](state, process) {
    setActive(state, 'processes', 'activeProcess', process)
  },
  [ADD](state, process) {
    state.processes.push(process)
  },
  [REMOVE](state, process) {
    state.processes = removeByID(state.processes, process.id)
  }
}
