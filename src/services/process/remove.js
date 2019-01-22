import Vue from 'vue'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(response, { data }) {
  Vue.$message({
    type: 'success',
    message: Vue.i18n.t('process.delete.confirmation')
  })
  store.dispatch('process/remove', data)
}

function failed(response) {
  if (response.response.status === 406) {
    Vue.$message({
      type: 'warning',
      message: Vue.i18n.t('process.delete.forbidden')
    })
  }
}

export default (process) => Service.builder({
  name: 'processes',
  success,
  failed
}).remove(process)
