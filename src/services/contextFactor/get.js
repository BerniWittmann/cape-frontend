import { updateAndSetActive } from '@/utils/helpers'
import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactor) {
  updateAndSetActive(store, contextFactor, ContextFactor, 'contextFactor')
}

export default (contextFactor) => new Service({
  method: 'get',
  endpoint: `/context_factors/${contextFactor.id}`,
  name: 'context_factor',
  success
})
