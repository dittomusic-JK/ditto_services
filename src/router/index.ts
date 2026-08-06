import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/services'
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue')
    },
    {
      path: '/royalty-splits',
      name: 'royalty-splits',
      component: () => import('../views/RoyaltySplitsView.vue')
    },
    {
      path: '/royalty-splits-rls',
      name: 'royalty-splits-rls',
      component: () => import('../views/RoyaltySplitsViewRLS.vue')
    },
    {
      path: '/royalty-splits-app',
      name: 'royalty-splits-app',
      component: () => import('../views/RoyaltySplitsAppView.vue')
    }
  ]
})

export default router
