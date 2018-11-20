import Vue from 'vue'
import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (process) => {
  store.dispatch('process/update', new Process(process))
  Vue.$notify.success({
    title: Vue.i18n.t('notifications.process.put.success.title'),
    message: Vue.i18n.t('notifications.process.put.success.message')
  })
}

export default (process) => makeRequest({
  method: 'put',
  endpoint: `/processes/${process.id}`,
  name: 'process',
  data: process,
  success
})
