import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(process) {
  store.dispatch('process/update', new Process(process))
  this.showSuccessNotification()
}

export default (process) => new Service({
  method: 'put',
  endpoint: `/processes/${process.id}`,
  name: 'process',
  data: process,
  success
})
