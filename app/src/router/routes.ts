import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'family',
        component: () => import('pages/FamilyPage.vue'),
        meta: { title: 'Family', tab: 'family', auth: true },
      },
      {
        path: 'member/:id',
        name: 'member',
        component: () => import('pages/MemberPage.vue'),
        meta: { title: 'Profile', tab: 'family', auth: true },
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('pages/ArchivePage.vue'),
        meta: { title: 'Events', tab: 'archive', auth: true },
      },
      {
        path: 'timeline',
        name: 'timeline',
        component: () => import('pages/TimelinePage.vue'),
        meta: { title: 'Timeline', tab: 'timeline', auth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { title: 'Sign In' },
  },
  { path: '/:pathMatch(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]

export default routes
