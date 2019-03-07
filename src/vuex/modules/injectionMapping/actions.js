/* ============
 * Actions for the injectionMapping module
 * ============
 *
 * The actions that are available on the
 * injectionMapping module.
 */

import * as types from './mutation-types'

export const store = ({ commit }, payload) => {
  commit(types.STORE, payload)
}

export const update = ({ commit }, payload) => {
  commit(types.UPDATE, payload)
}

export default {
  store,
  update
}
