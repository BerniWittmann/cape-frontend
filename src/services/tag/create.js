import Tag from '@/models/tag'
import store from '@/vuex/store'
import Service from '@/services/base'

// When the request succeeds
function success(tag) {
  store.dispatch('tag/add', new Tag(tag))
}

export default (tag) => Service.builder({
  name: 'tags',
  success
}).create(tag)
