/* ============
 * Vuex - Store
 * ============
 *
 * This file creates and exports the Vuex store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import process from './modules/process'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    process
  }
})

export default store
