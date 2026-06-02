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
        meta: { title: 'Family', tab: 'family' },
      },
      {
        path: 'member/:id',
        name: 'member',
        component: () => import('pages/MemberPage.vue'),
        meta: { title: 'Profile', tab: 'family' },
      },
      {
        path: 'archive',
        name: 'archive',
        component: () => import('pages/ArchivePage.vue'),
        meta: { title: 'Archive', tab: 'archive' },
      },
      {
        path: 'timeline',
        name: 'timeline',
        component: () => import('pages/TimelinePage.vue'),
        meta: { title: 'Timeline', tab: 'timeline' },
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
