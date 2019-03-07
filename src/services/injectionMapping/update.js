import InjectionMapping from '@/models/injectionMapping'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(injectionMapping) {
  store.dispatch('injectionMapping/update', new InjectionMapping(injectionMapping))
  this.showSuccessNotification()
}

export default (injectionMapping) => Service.builder({
  name: 'injection_mappings',
  success
}).update(injectionMapping)
