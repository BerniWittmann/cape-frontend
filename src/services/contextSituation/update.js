import ContextSituation from '@/models/contextSituation'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextSituation) {
  store.dispatch('contextSituation/update', new ContextSituation(contextSituation))
  this.showSuccessNotification()
}

export default (contextSituation) => Service.builder({
  name: 'context_situations',
  success
}).update(contextSituation)
