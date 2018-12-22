import store from '@/vuex/store'
import { makeRequest } from '@/services/base'
import Vue from 'vue'

// When the request succeeds
const success = (response, { data }) => {
  store.dispatch('contextType/remove', data)
}

const failed = (response) => {
  if (response.response.status === 418) {
    Vue.$message.warning(Vue.i18n.t('notifications.context_type.delete.not_allowed'))
  }
}

export default (contextType) => makeRequest({
  method: 'delete',
  endpoint: `/context_types/${contextType.id}`,
  data: contextType,
  name: 'context_type',
  success,
  failed
})
