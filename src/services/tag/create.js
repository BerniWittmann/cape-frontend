import Tag from '@/models/tag'
import store from '@/vuex/store'
import Vue from 'vue'

// When the request succeeds
const success = (tag) => {
  tag = new Tag(tag)

  store.dispatch('tag/add', tag)
}

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('settings.tag.notifications.post.failed.title'),
    message: Vue.i18n.t('settings.tag.notifications.post.failed.message')
  })
}

export default (tag) =>
  Vue.$http.post('/tags', tag)
    .then((response) => {
      success(response.data)
    }).catch(failed)
