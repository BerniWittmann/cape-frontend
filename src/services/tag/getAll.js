import Tag from '@/models/tag'
import store from '@/vuex/store'
import { makeRequest } from '@/services/base'

// When the request succeeds
const success = (tags) => {
  store.dispatch('tag/store', tags.map(p => new Tag(p)))
}

export default () => makeRequest({
  method: 'get',
  endpoint: '/tags',
  name: 'tags',
  success
})
