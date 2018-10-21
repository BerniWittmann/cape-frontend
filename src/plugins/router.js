/* ============
 * Vue Router
 * ============
 *
 * This file installs Vue Router (https://router.vuejs.org/)
 *
 * Vue-Router is used for the routing and navigation in this Single Page Application.
 * It renders the routes defined in the routes directory
 */

import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
