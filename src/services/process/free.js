import Service from '@/services/base'

export default (process) => new Service({
  method: 'delete',
  name: 'processes.reserve',
  routeOverrides: [process]
})
