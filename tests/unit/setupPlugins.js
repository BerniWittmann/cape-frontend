/* ============
 * Setup Plugins
 * ============
 *
 * This file setups some of the used plugins. This is needed for some of the unit test specs.
 */

import VueI18N from 'vue-i18n'
import Vue from 'vue'
import Element from 'element-ui'
Vue.use(VueI18N)
Vue.use(Element)

export const i18n = new VueI18N({
  silentTranslationWarn: true
})
