import { updateAndSetActive } from '@/utils/helpers'
import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactor) {
  updateAndSetActive(store, contextFactor, ContextFactor, 'contextFactor')
}

export default (contextFactor) => Service.builder({
  name: 'context_factors',
  success
}).get(contextFactor)
