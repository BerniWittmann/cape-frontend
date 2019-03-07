/* ============
 * Vuex - Store
 * ============
 *
 * This file creates and exports the Vuex store
 */

import Vue from 'vue'
import Vuex from 'vuex'

import getters from './common/getters'

import process from './modules/process'
import tag from './modules/tag'
import contextType from './modules/contextType'
import contextFactor from './modules/contextFactor'
import contextSituation from './modules/contextSituation'
import injectionMapping from './modules/injectionMapping'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    process,
    tag,
    contextType,
    contextFactor,
    contextSituation,
    injectionMapping
  },
  getters
})

export default store
