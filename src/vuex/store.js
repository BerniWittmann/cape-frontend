/* ============
 * Vuex - Store
 * ============
 *
 * This file creates and exports the Vuex store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import process from './modules/process'
import tag from './modules/tag'
import contextType from './modules/contextType'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    process,
    tag,
    contextType
  }
})

export default store
