/* ============
 * Routes
 * ============
 *
 * Here are all routes for Vue-Router defined
 */

import EmptyRouterView from '@/layouts/EmptyRouterView.vue'

import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Settings from '@/pages/Settings.vue'
import ProcessRepository from '@/pages/ProcessRepository.vue'
import EditProcess from '@/pages/process/EditProcess.vue'
import ProcessPreviewDialog from '@/dialogs/ProcessPreviewDialog'

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
    component: EmptyRouterView,
    beforeEnter: (to, from, next) => {
      ProcessService.getAll().then(next)
    },
    children: [{
      path: '',
      name: 'processes',
      component: ProcessRepository
    }, {
      path: ':processID',
      component: EmptyRouterView,
      beforeEnter: (to, from, next) => {
        Promise.all([
          TagService.getAll(),
          ProcessService.get({ id: to.params.processID })
        ]).then(next)
      },
      children: [{
        path: 'edit',
        name: 'process.edit',
        component: EditProcess
      }, {
        path: 'preview',
        name: 'process.preview',
        components: {
          default: ProcessRepository,
          dialog: ProcessPreviewDialog
        }
      }]
    }]
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
