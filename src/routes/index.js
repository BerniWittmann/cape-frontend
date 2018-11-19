/* ============
 * Routes
 * ============
 *
 * Here are all routes for Vue-Router defined
 */

import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Settings from '@/pages/Settings.vue'
import ProcessRepository from '@/pages/ProcessRepository.vue'

import ProcessService from '@/services/process'
import TagService from '@/services/tag'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/processes',
    name: 'processes',
    component: ProcessRepository,
    beforeEnter: (to, from, next) => {
      ProcessService.getAll().then(next)
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    beforeEnter: (to, from, next) => {
      TagService.getAll().then(next)
    }
  },
  {
    path: '/*',
    redirect: '/'
  }
]

export default routes
