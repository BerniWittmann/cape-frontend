import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (process) => {
  process = new Process(process)
  store.dispatch('process/update', process)
}

export default (process, tag) => makeRequest({
  method: 'delete',
  endpoint: `/processes/${process.id}/tags`,
  name: 'process.tags',
  data: tag,
  success
})
