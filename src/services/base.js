import Vue from 'vue'

export function makeRequest({
  method, endpoint, data = undefined, name, success = () => {}, failed = () => {}
}) {
  return Vue.$http[method](endpoint, data)
    .then((response) => {
      success(response.data, { method, endpoint, data, name })
    }).catch((response) => {
      console.error(response)
      Vue.$notify.error({
        title: Vue.i18n.t('notifications.' + name + '.' + method + '.failed.title'),
        message: Vue.i18n.t('notifications.' + name + '.' + method + '.failed.message')
      })
      failed(response, { method, endpoint, data, name })
    })
}
