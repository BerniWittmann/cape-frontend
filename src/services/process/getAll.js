import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(processes) {
  store.dispatch('process/store', processes.map(p => new Process(p)))
}

export default () => new Service({
  method: 'get',
  endpoint: '/processes',
  name: 'processes',
  success
})
