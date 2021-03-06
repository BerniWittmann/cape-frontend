import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactor) {
  store.dispatch('contextFactor/add', new ContextFactor(contextFactor))
  this.showSuccessNotification()
}

export default (contextFactor) => Service.builder({
  name: 'context_factors',
  success
}).create(contextFactor)
