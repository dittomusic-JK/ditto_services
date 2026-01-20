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
    }
  ]
})

export default router
