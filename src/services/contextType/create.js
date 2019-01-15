import ContextType from '@/models/contextType'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
const success = (contextType) => {
  store.dispatch('contextType/add', new ContextType(contextType))
}

export default (contextType) => new Service({
  method: 'post',
  endpoint: '/context_types',
  data: contextType,
  name: 'context_type',
  success
})
