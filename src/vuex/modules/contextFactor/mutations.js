/* ============
 * Mutations for the contextFactor  module
 * ============
 *
 * The mutations that are available on the
 * contextFactor  module.
 */

import { STORE, UPDATE, ADD, SET_ACTIVE } from './mutation-types'

export default {
  [STORE](state, contextFactors) {
    state.contextFactors = contextFactors || []
  },
  [UPDATE](state, contextFactor) {
    state.contextFactors = [...state.contextFactors.map((p) => p.id === contextFactor.id ? { ...contextFactor } : p)]
    if (state.activeContextFactor && state.activeContextFactor.id === contextFactor.id) {
      state.activeContextFactor = { ...contextFactor }
    }
  },
  [ADD](state, contextFactor) {
    state.contextFactors.push(contextFactor)
  },
  [SET_ACTIVE](state, contextFactor) {
    if (!contextFactor || !contextFactor.id) {
      state.activeContextFactor = undefined
    } else {
      state.activeContextFactor = state.contextFactors.find((p) => p.id === contextFactor.id)
    }
  }
}
