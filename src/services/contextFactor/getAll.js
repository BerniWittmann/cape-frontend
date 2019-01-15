import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactors) {
  store.dispatch('contextFactor/store', contextFactors.map(p => new ContextFactor(p)))
}

export default () => new Service({
  method: 'get',
  endpoint: '/context_factors',
  name: 'context_factors',
  success
})
