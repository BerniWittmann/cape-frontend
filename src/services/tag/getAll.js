import Tag from '@/models/tag'
import store from '@/vuex/store'
import Vue from 'vue'

// When the request succeeds
const success = (tags) => {
  tags = tags.map(p => new Tag(p))

  store.dispatch('tag/store', tags)
}

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('settings.tag.notifications.get.failed.title'),
    message: Vue.i18n.t('settings.tag.notifications.get.failed.message')
  })
}

export default () =>
  Vue.$http.get('/tags')
    .then((response) => {
      success(response.data)
    }).catch(failed)
