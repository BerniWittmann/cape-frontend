import Tag from '@/models/tag'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(tags) {
  store.dispatch('tag/store', tags.map(p => new Tag(p)))
}

export default () => Service.builder({
  name: 'tags',
  success
}).getAll()
