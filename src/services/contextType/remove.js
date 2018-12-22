import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (response, { data }) => {
  store.dispatch('contextType/remove', data)
}

export default (contextType) => makeRequest({
  method: 'delete',
  endpoint: `/contextTypes/${contextType.id}`,
  data: contextType,
  name: 'contextType',
  success
})
