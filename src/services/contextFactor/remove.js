import store from '@/vuex/store'
import Service from '@/services/base'
import Vue from 'vue'

// When the request succeeds

function success(response, { data }) {
  Vue.$message({
    type: 'success',
    message: Vue.i18n.t('context_factor.delete.confirmation')
  })
  store.dispatch('contextFactor/remove', data)
}

export default (contextFactor) => Service.builder({
  name: 'context_factors',
  success
}).remove(contextFactor)
