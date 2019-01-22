import ContextType from '@/models/contextType'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
const success = (contextType) => {
  store.dispatch('contextType/add', new ContextType(contextType))
}

export default (contextType) => Service.builder({
  name: 'context_types',
  success
}).create(contextType)
