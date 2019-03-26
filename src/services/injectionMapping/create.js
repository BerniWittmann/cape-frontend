import store from '@/vuex/store'
import Service from '@/services/base'
import InjectionMapping from '@/models/injectionMapping'

// When the request succeeds
function success(injectionMapping) {
  store.dispatch('injectionMapping/add', new InjectionMapping(injectionMapping))
  this.showSuccessNotification()
}

export default (injectionMapping) => Service.builder({
  name: 'injection_mappings',
  success
}).create(injectionMapping)
