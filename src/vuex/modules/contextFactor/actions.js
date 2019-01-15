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

export default {
  store
}
