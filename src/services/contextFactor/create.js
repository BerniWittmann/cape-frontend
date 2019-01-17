import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactor) {
  store.dispatch('contextFactor/add', new ContextFactor(contextFactor))
  this.showSuccessNotification()
}

export default (contextFactor) => new Service({
  method: 'post',
  endpoint: '/context_factors',
  name: 'context_factor',
  data: contextFactor,
  success
})
