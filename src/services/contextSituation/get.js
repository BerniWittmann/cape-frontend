import { updateAndSetActive } from '@/utils/helpers'
import ContextSituation from '@/models/contextSituation'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextSituation) {
  updateAndSetActive(store, contextSituation, ContextSituation, 'contextSituation')
}

export default (contextSituation) => Service.builder({
  name: 'context_situations',
  success
}).get(contextSituation)
