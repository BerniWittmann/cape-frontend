import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (response, { data }) => {
  store.dispatch('tag/remove', data)
}

export default (tag) => makeRequest({
  method: 'delete',
  endpoint: `/tags/${tag.id}`,
  data: tag,
  name: 'tag',
  success
})
