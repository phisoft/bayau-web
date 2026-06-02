import { boot } from 'quasar/wrappers'
import { createBayauStore, type BayauStore } from 'src/stores/tinybase'
import { createLocalPersister } from 'tinybase/persisters/persister-browser'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: BayauStore
  }
}

let store: BayauStore
let currentPersister: ReturnType<typeof createLocalPersister> | null = null

export async function switchTree(treeId: string) {
  // Save current tree before switching
  if (currentPersister) {
    await currentPersister.save()
    currentPersister.stopAutoSave()
    currentPersister.destroy()
    currentPersister = null
  }

  // Start loading new tree
  const key = `bayau_tree_${treeId}`
  currentPersister = createLocalPersister(store, key)

  // Load data from new tree
  await currentPersister.startAutoLoad()
  await currentPersister.startAutoSave()
}

export default boot(({ app }) => {
  store = createBayauStore()
  app.provide('db', store)
  app.config.globalProperties.$db = store
})

export { BayauStore }
