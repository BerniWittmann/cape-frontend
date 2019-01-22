import ContextType from '@/models/contextType'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
const success = (contextTypes) => {
  store.dispatch('contextType/store', contextTypes.map(p => new ContextType(p)))
}

export default () => Service.builder({
  name: 'context_types',
  success
}).getAll()
