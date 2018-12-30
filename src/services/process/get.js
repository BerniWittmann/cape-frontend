import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(process) {
  process = new Process(process)
  store.dispatch('process/update', process).then(() => {
    store.dispatch('process/setActive', process)
  })
}

export default (process) => new Service({
  method: 'get',
  endpoint: `/processes/${process.id}`,
  name: 'process',
  success
})
