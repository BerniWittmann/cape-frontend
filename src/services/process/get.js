import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (process) => {
  process = new Process(process)
  store.dispatch('process/update', process).then(() => {
    store.dispatch('process/setActive', process)
  })
}

export default (process) => makeRequest({
  method: 'get',
  endpoint: `/processes/${process.id}`,
  name: 'process',
  success
})
