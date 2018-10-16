import VueI18N from 'vue-i18n'
import Vue from 'vue'
import Element from 'element-ui'
Vue.use(VueI18N)
Vue.use(Element)

export const i18n = new VueI18N({
  silentTranslationWarn: true
})
