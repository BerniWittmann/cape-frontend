import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(process) {
  store.dispatch('process/add', new Process(process))
  this.showSuccessNotification()
}

export default (process) => new Service({
  method: 'post',
  endpoint: '/processes',
  name: 'process',
  data: process,
  success
})
