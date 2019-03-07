import InjectionMapping from '@/models/injectionMapping'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(injectionMappings) {
  store.dispatch('injectionMapping/store', injectionMappings.map(p => new InjectionMapping(p)))
}

export default () => Service.builder({
  name: 'injection_mappings',
  success
}).getAll()
