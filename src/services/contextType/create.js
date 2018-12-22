import ContextType from '@/models/contextType'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (contextType) => {
  store.dispatch('contextType/add', new ContextType(contextType))
}

export default (contextType) => makeRequest({
  method: 'post',
  endpoint: '/contextTypes',
  data: contextType,
  name: 'contextType',
  success
})
