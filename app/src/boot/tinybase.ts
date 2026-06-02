import { boot } from 'quasar/wrappers'
import { createBayauStore, type BayauStore } from 'src/stores/tinybase'
import { createLocalPersister } from 'tinybase/persisters/persister-browser'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: BayauStore
  }
}

let currentStore: BayauStore | null = null
let currentPersister: ReturnType<typeof createLocalPersister> | null = null

export function getStorageKey(treeId: string): string {
  return `bayau_tree_${treeId}`
}

export async function switchTree(treeId: string) {
  if (currentPersister) {
    currentPersister.stopAutoSave()
    currentPersister.stopAutoLoad()
    currentPersister.destroy()
    currentPersister = null
  }

  currentStore = createBayauStore()
  const key = getStorageKey(treeId)

  currentPersister = createLocalPersister(currentStore, key)
  await currentPersister.startAutoLoad()
  await currentPersister.startAutoSave()

  // Seed demo data only if tree is empty
  setTimeout(() => {
    if (currentStore && Object.keys(currentStore.getTable('members')).length === 0) {
      // Keep empty — user will add members
    }
  }, 100)

  return currentStore
}

export function getStore(): BayauStore | null {
  return currentStore
}

export default boot(async ({ app }) => {
  currentStore = createBayauStore()
  app.provide('db', currentStore)
  app.config.globalProperties.$db = currentStore
})

export { BayauStore }
