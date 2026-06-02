import { boot } from 'quasar/wrappers'
import { createBayauStore, type BayauStore } from 'src/stores/tinybase'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: BayauStore
  }
}

export default boot(({ app }) => {
  const db = createBayauStore()
  app.provide('db', db)
  app.config.globalProperties.$db = db
})

export { BayauStore }
