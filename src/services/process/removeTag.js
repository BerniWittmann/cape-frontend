import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(process) {
  process = new Process(process)
  store.dispatch('process/update', process)
}

export default (process, tag) => new Service({
  method: 'delete',
  endpoint: `/processes/${process.id}/tags`,
  name: 'process.tags',
  data: tag,
  success
})
