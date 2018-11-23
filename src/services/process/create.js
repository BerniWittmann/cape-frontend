import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (process) => {
  store.dispatch('process/add', new Process(process))
}

export default (process) => makeRequest({
  method: 'post',
  endpoint: '/processes',
  data: process,
  name: 'process',
  success
})
