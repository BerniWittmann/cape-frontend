/* ============
 * Mutations for the process module
 * ============
 *
 * The mutations that are available on the
 * process module.
 */

import { STORE, UPDATE, SET_ACTIVE, ADD, REMOVE } from './mutation-types'

export default {
  [STORE](state, processes) {
    state.processes = processes || []
  },
  [UPDATE](state, process) {
    state.processes = [...state.processes.map((p) => p.id === process.id ? { ...process } : p)]
    if (state.activeProcess && state.activeProcess.id === process.id) {
      state.activeProcess = { ...process }
    }
  },
  [SET_ACTIVE](state, process) {
    if (!process || !process.id) {
      state.activeProcess = undefined
    } else {
      state.activeProcess = state.processes.find((p) => p.id === process.id)
    }
  },
  [ADD](state, process) {
    state.processes.push(process)
  },
  [REMOVE](state, process) {
    state.processes = state.processes.filter(p => p.id !== process.id)
  }
}
