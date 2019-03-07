import InjectionMapping from '@/models/injectionMapping'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(injectionMappings) {
  store.dispatch('injectionMapping/store', injectionMappings.map(p => new InjectionMapping(p)))
}

export default (processID, extensionAreaID) => new Service({
  method: 'get',
  name: 'injection_mappings',
  endpoint: '/injection_mappings',
  params: {
    process_id: processID,
    extension_area_id: extensionAreaID
  },
  success
})
