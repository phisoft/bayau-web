import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: routes as RouteRecordRaw[],
    history: createWebHistory('/'),
  })

  return Router
})
