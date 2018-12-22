/* ============
 * Actions for the Context Type module
 * ============
 *
 * The actions that are available on the
 * Context Type module.
 */

import * as types from './mutation-types'

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload)
}

export const add = ({ commit }, payload) => {
  commit(types.ADD, payload)
}

export const remove = ({ commit }, payload) => {
  commit(types.REMOVE, payload)
}

export default {
  store,
  add,
  remove
}
