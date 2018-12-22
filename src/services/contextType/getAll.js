import ContextType from '@/models/contextType'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (contextTypes) => {
  console.log('ss')
  store.dispatch('contextType/store', contextTypes.map(p => new ContextType(p)))
}

export default () => makeRequest({
  method: 'get',
  endpoint: '/contextTypes',
  name: 'contextTypes',
  success
})
