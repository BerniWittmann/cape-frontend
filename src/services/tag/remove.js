import store from '@/vuex/store'
import Vue from 'vue'

// When the request succeeds
const success = (tag) => {
  store.dispatch('tag/remove', tag)
}

// When the request fails
const failed = () => {
  Vue.$notify.error({
    title: Vue.i18n.t('settings.tag.notifications.delete.failed.title'),
    message: Vue.i18n.t('settings.tag.notifications.delete.failed.message')
  })
}

export default (tag) =>
  Vue.$http.delete(`/tags/${tag.id}`)
    .then(() => {
      success(tag)
    }).catch(failed)
