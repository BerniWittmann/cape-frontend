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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
