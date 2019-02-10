import store from '@/vuex/store'
import Service from '@/services/base'
import ContextSituation from '@/models/contextSituation'

// When the request succeeds
function success(contextSituation) {
  store.dispatch('contextSituation/add', new ContextSituation(contextSituation))
  this.showSuccessNotification()
}

export default (contextSituation) => Service.builder({
  name: 'context_situations',
  success
}).create(contextSituation)
