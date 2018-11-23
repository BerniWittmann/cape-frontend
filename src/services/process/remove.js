import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (response, { data }) => {
  store.dispatch('process/remove', data)
}

export default (process) => makeRequest({
  method: 'delete',
  endpoint: `/processes/${process.id}`,
  data: process,
  name: 'process',
  success
})
