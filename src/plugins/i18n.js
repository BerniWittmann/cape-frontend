/* ============
 * Vue i18n
 * ============
 *
 * This file installs VueI18n (https://kazupon.github.io/vue-i18n/)
 *
 * Vue i18n is used as the internationalization plugin.
 * It translates the message keys stored in the locales directory
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'de',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'de',
  messages: loadLocaleMessages()
})

Vue.i18n = i18n

export default i18n
