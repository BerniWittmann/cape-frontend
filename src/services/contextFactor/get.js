import ContextFactor from '@/models/contextFactor'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(contextFactor) {
  contextFactor = new ContextFactor(contextFactor)
  store.dispatch('contextFactor/update', contextFactor).then(() => {
    store.dispatch('contextFactor/setActive', contextFactor)
  })
}

export default (contextFactor) => new Service({
  method: 'get',
  endpoint: `/context_factors/${contextFactor.id}`,
  name: 'context_factor',
  success
})
