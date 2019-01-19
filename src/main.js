/* ============
 * Main
 * ============
 *
 * This file creates the Vue App and also bootstraps all the used plugins
 */

import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/vuex'
import i18n from './plugins/i18n'
import './plugins/axios'
import './plugins/element.js'
import './plugins/bpmn'
import './assets/styles/external.scss'
import WebSocketService from './services/websocket'

Vue.config.productionTip = false

const ws = new WebSocketService()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  destroyed: () => {
    ws.close()
  }
}).$mount('#app')
