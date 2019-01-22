import Service from '@/services/base'

export default (process) => new Service({
  method: 'post',
  endpoint: `/processes/${process.id}/reserve`,
  name: 'process.reserve'
})
