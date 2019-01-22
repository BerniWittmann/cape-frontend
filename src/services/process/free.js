import Service from '@/services/base'

export default (process) => new Service({
  method: 'delete',
  endpoint: `/processes/${process.id}/reserve`,
  name: 'process.reserve'
})
