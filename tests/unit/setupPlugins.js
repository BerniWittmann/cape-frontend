/* ============
 * Setup Plugins
 * ============
 *
 * This file setups some of the used plugins. This is needed for some of the unit test specs.
 */

import VueI18N from 'vue-i18n'
import Vue from 'vue'
import Element from 'element-ui'
import mockDate from 'mockdate'
mockDate.set(1542662763500)

Vue.use(VueI18N)
Vue.use(Element)

export const i18n = new VueI18N({
  silentTranslationWarn: true
})

export function monkeyPatchTransitions() {
  const { getComputedStyle } = window
  window.getComputedStyle = function getComputedStyleStub(el) {
    return {
      ...getComputedStyle(el),
      transitionDelay: '',
      transitionDuration: '',
      animationDelay: '',
      animationDuration: ''
    }
  }
}
