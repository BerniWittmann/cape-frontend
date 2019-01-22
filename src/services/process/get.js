import { updateAndSetActive } from '@/utils/helpers'
import Process from '@/models/process'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(process) {
  updateAndSetActive(store, process, Process, 'process')
}

export default (process) => Service.builder({
  name: 'processes',
  success
}).get(process)
