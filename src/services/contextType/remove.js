import store from '@/vuex/store'
import Service from '@/services/base'
import Vue from 'vue'

// When the request succeeds
const success = (response, { data }) => {
  store.dispatch('contextType/remove', data)
}

const failed = (response) => {
  if (response.response.status === 418) {
    Vue.$message.warning(Vue.i18n.t('notifications.context_types.single.delete.not_allowed'))
  }
}

export default (contextType) => Service.builder({
  name: 'context_types',
  success,
  failed
}).remove(contextType)
