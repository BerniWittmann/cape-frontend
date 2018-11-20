import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (processes) => {
  store.dispatch('process/store', processes.map(p => new Process(p)))
}

export default () => makeRequest({
  method: 'get',
  endpoint: '/processes',
  name: 'processes',
  success
})
