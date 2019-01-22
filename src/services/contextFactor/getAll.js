import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactors) {
  store.dispatch('contextFactor/store', contextFactors.map(p => new ContextFactor(p)))
}

export default () => Service.builder({
  name: 'context_factors',
  success
}).getAll()
