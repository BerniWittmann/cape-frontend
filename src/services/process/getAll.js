import Process from '@/models/process'
import store from '@/vuex/store'
import Vue from 'vue'

// When the request succeeds
const success = (processes) => {
  processes = processes.map(p => new Process(p))

  store.dispatch('process/store', processes)
}

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('process.notifications.get.failed.title'),
    message: Vue.i18n.t('process.notifications.get.failed.message')
  })
}

export default () =>
  Vue.$http.get('/processes')
    .then((response) => {
      success(response.data)
    }).catch(failed)
