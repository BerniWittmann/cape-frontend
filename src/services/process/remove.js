import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(response, { data }) {
  store.dispatch('process/remove', data)
}

export default (process) => new Service({
  method: 'delete',
  endpoint: `/processes/${process.id}`,
  data: process,
  name: 'process',
  success
})
