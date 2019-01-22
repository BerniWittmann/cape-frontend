/* ============
 * Actions for the contextFactor module
 * ============
 *
 * The actions that are available on the
 * contextFactor module.
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

export const add = ({ commit }, payload) => {
  commit(types.ADD, payload)
}

export const remove = ({ commit }, payload) => {
  commit(types.REMOVE, payload)
}

export default {
  store,
  update,
  setActive,
  unsetActive,
  add,
  remove
}
