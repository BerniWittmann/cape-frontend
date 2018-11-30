import Process from '@/models/process'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'
import Vue from 'vue'

// When the request succeeds
const success = (process) => {
  store.dispatch('process/add', new Process(process))
  Vue.$notify.success({
    title: Vue.i18n.t('notifications.process.post.success.title'),
    message: Vue.i18n.t('notifications.process.post.success.message')
  })
}

export default (process) => makeRequest({
  method: 'post',
  endpoint: '/processes',
  data: process,
  name: 'process',
  success
})
