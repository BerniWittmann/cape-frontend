import Tag from '@/models/tag'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (tag) => {
  store.dispatch('tag/add', new Tag(tag))
}

export default (tag) => makeRequest({
  method: 'post',
  endpoint: '/tags',
  data: tag,
  name: 'tag',
  success
})
