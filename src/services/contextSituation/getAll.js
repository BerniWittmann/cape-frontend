import ContextSituation from '@/models/contextSituation'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextSituations) {
  store.dispatch('contextSituation/store', contextSituations.map(p => new ContextSituation(p)))
}

export default () => Service.builder({
  name: 'context_situations',
  success
}).getAll()
