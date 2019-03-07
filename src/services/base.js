import Vue from 'vue'
import getRoute from './routes'

export default class Service {
  constructor({
    method, endpoint, routeOverrides, data = undefined, params = {}, name, success = () => {}, failed = () => {}
  }) {
    this.method = method
    this.endpoint = endpoint || getRoute(name, routeOverrides)
    this.data = data
    this.name = name
    this.params = params
    this.success = success
    this.failed = failed

    return this.makeRequest()
  }

  makeRequest() {
    const config = {
      params: this.params
    }
    let firstParam = config
    let secondParam = this.data
    if (['post', 'put', 'patch'].includes(this.method)) {
      firstParam = this.data
      secondParam = config
    }
    return Vue.$http[this.method](this.endpoint, firstParam, secondParam)
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

  static builder({ name, success, failed }) {
    function build(method, prefix, data = undefined) {
      return new this({
        name: name + '.' + prefix,
        success,
        failed,
        data,
        method,
        routeOverrides: (prefix === 'single' && data) ? [data] : []
      })
    }

    return {
      getAll: build.bind(this, 'get', 'all'),
      get: build.bind(this, 'get', 'single'),
      create: build.bind(this, 'post', 'all'),
      update: build.bind(this, 'put', 'single'),
      remove: build.bind(this, 'delete', 'single')
    }
  }
}
