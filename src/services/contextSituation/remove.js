import store from '@/vuex/store'
import Service from '@/services/base'
import Vue from 'vue'

// When the request succeeds

function success(response, { data }) {
  Vue.$message({
    type: 'success',
    message: Vue.i18n.t('context_situation.delete.confirmation')
  })
  store.dispatch('contextSituation/remove', data)
}

export default (contextSituation) => Service.builder({
  name: 'context_situations',
  success
}).remove(contextSituation)
