/* ============
 * Actions for the Process module
 * ============
 *
 * The actions that are available on the
 * process module.
 */

import * as types from './mutation-types'

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload)
}

export const update = ({ commit }, payload) => {
  commit(types.UPDATE, payload)
}

export const setActive = ({ commit }, payload) => {
  commit(types.SET_ACTIVE, payload)
}

export const unsetActive = ({ commit }) => {
  commit(types.SET_ACTIVE, undefined)
}

export default {
  store,
  update,
  setActive,
  unsetActive
}
