import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: routes as RouteRecordRaw[],
    history: createWebHistory('/'),
  })

  Router.beforeEach(async (to) => {
    if (to.name === 'login') return true

    // Wait for Clerk to be ready
    await waitForClerk()

    try {
      const clerk = (window as any).Clerk
      if (!clerk?.session) {
        return { name: 'login' }
      }
      return true
    } catch {
      return { name: 'login' }
    }
  })

  return Router
})

function waitForClerk(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Clerk) return resolve()

    let attempts = 0
    const check = setInterval(() => {
      if ((window as any).Clerk || ++attempts > 50) {
        clearInterval(check)
        resolve()
      }
    }, 100)
  })
}
