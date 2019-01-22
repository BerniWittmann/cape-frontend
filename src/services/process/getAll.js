import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(processes) {
  store.dispatch('process/store', processes.map(p => new Process(p)))
}

export default () => Service.builder({
  name: 'processes',
  success
}).getAll()
