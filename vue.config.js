/* eslint-disable no-template-curly-in-string */

let externals = ['!bpmn-js-properties-panel', '!./node_modules/bpmn-js/']
if (process.env.NODE_ENV === 'production') {
  externals = ['!bpmn-js', ...externals]
}

module.exports = {
  baseUrl: process.env.BASE_URL,

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: false
    },

    electronBuilder: {
      builderOptions: {
        appId: 'com.cape.app',
        productName: 'CaPE',
        copyright: 'Copyright © 2018 Alexander Fischer <alexander.fischer@uni-ulm.de>, Lukas Jesche <lukas.jesche@uni-ulm.de>, Bernhard Wittmann <bernhard.wittmann@uni-ulm.de>',
        publish: {
          provider: 'github',
          repo: 'cape-frontend',
          owner: 'berniwittmann'
        },
        mac: {
          category: 'public.app-category.education'
        },
        linux: {
          category: 'Education'
        }
      },
      externals
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
