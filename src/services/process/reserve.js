import Service from '@/services/base'

export default (process) => new Service({
  method: 'post',
  name: 'processes.reserve',
  routeOverrides: [process]
})
