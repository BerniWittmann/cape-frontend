import store from '@/vuex/store'
import Service from '@/services/base'
import Vue from 'vue'

// When the request succeeds

function success(response, { data }) {
  Vue.$message({
    type: 'success',
    message: Vue.i18n.t('injection_mapping.delete.confirmation')
  })
  store.dispatch('injectionMapping/remove', data)
}

export default (injectionMapping) => Service.builder({
  name: 'injection_mappings',
  success
}).remove(injectionMapping)
