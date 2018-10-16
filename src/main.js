import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/vuex'
import i18n from './plugins/i18n'
import './plugins/axios'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
