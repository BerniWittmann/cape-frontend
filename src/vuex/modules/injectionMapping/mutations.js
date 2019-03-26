/* ============
 * Mutations for the injectionMapping  module
 * ============
 *
 * The mutations that are available on the
 * injectionMapping  module.
 */

import { STORE, UPDATE, REMOVE, ADD } from './mutation-types'
import { update } from '@/vuex/common/helpers'
import { removeByID } from '@/utils/helpers'

export default {
  [STORE](state, injectionMappings) {
    state.injectionMappings = injectionMappings || []
  },
  [UPDATE](state, injectionMapping) {
    update(state, 'injectionMappings', 'activeInjectionMapping', injectionMapping)
  },
  [REMOVE](state, injectionMapping) {
    state.injectionMappings = removeByID(state.injectionMappings, injectionMapping.id)
  },
  [ADD](state, injectionMapping) {
    state.injectionMappings.push(injectionMapping)
  }
}
