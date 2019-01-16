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
import ProcessPreviewDialog from '@/dialogs/ProcessPreviewDialog.vue'
import ContextFactors from '@/pages/ContextFactors.vue'
import ContextFactorEditDialog from '@/dialogs/ContextFactorEditDialog.vue'

import ProcessService from '@/services/process'
import TagService from '@/services/tag'
import ContextTypeService from '@/services/contextType'
import ContextFactorService from '@/services/contextFactor'

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
    path: '/context_factors',
    component: EmptyRouterView,
    beforeEnter: (to, from, next) => {
      Promise.all([
        ContextFactorService.getAll()
      ]).then(next)
    },
    children: [{
      path: '',
      name: 'context_factors',
      component: ContextFactors
    }, {
      path: ':contextFactorID',
      component: EmptyRouterView,
      beforeEnter: (to, from, next) => {
        Promise.all([
          ContextTypeService.getAll(),
          ContextFactorService.get({ id: to.params.contextFactorID })
        ]).then(next)
      },
      children: [{
        path: 'edit',
        name: 'context_factors.edit',
        components: {
          default: ContextFactors,
          dialog: ContextFactorEditDialog
        }
      }]
    }]
  },
  {
    path: '/processes',
    component: EmptyRouterView,
    beforeEnter: (to, from, next) => {
      Promise.all([
        TagService.getAll(),
        ProcessService.getAll()
      ]).then(next)
    },
    children: [{
      path: '',
      name: 'processes',
      component: ProcessRepository
    }, {
      path: 'new',
      name: 'process.new',
      component: EditProcess
    }, {
      path: ':processID',
      component: EmptyRouterView,
      beforeEnter: (to, from, next) => {
        ProcessService.get({ id: to.params.processID }).then(next)
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
      Promise.all([
        TagService.getAll(),
        ContextTypeService.getAll()
      ]).then(next)
    }
  },
  {
    path: '/*',
    redirect: '/'
  }
]

export default routes
