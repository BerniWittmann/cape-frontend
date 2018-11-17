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
  },

  devServer: {
    proxy: process.env.VUE_APP_API_LOCATION
  }
}
