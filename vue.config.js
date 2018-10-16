module.exports = {
  baseUrl: process.env.BASE_URL,

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/styles/globals.scss";`
      }
    }
  }
}
