import Vue from 'vue'

export default class Service {
  constructor({
    method, endpoint, data = undefined, name, success = () => {}, failed = () => {}
  }) {
    this.method = method
    this.endpoint = endpoint
    this.data = data
    this.name = name
    this.success = success
    this.failed = failed

    return this.makeRequest()
  }

  makeRequest() {
    return Vue.$http[this.method](this.endpoint, this.data)
      .then((response) => {
        this.success(response.data, this)
        return true
      }).catch((response) => {
        // eslint-disable-next-line no-console
        console.error(response)
        this.showNotification({ type: 'error', key: 'failed' })
        this.failed(response, this)
        return false
      })
  }

  showNotification({
    key, type
  }) {
    Vue.$notify[type]({
      title: Vue.i18n.t(`notifications.${this.name}.${this.method}.${key}.title`),
      message: Vue.i18n.t(`notifications.${this.name}.${this.method}.${key}.message`)
    })
  }

  showSuccessNotification() {
    this.showNotification({ key: 'success', type: 'success' })
  }
}
