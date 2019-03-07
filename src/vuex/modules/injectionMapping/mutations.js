/* ============
 * Mutations for the injectionMapping  module
 * ============
 *
 * The mutations that are available on the
 * injectionMapping  module.
 */

import { STORE, UPDATE } from './mutation-types'
import { update } from '@/vuex/common/helpers'

export default {
  [STORE](state, injectionMappings) {
    state.injectionMappings = injectionMappings || []
  },
  [UPDATE](state, injectionMapping) {
    update(state, 'injectionMappings', 'activeInjectionMapping', injectionMapping)
  }
}
