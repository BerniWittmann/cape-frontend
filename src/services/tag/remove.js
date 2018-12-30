import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(response, { data }) {
  store.dispatch('tag/remove', data)
}

export default (tag) => new Service({
  method: 'delete',
  endpoint: `/tags/${tag.id}`,
  data: tag,
  name: 'tag',
  success
})
