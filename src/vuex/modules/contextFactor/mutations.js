
import { STORE } from './mutation-types'

export default {
  [STORE](state, contextFactors) {
    state.contextFactors = contextFactors || []
  }
}
