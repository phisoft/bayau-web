import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'

// Quasar v2 requires a Pinia store instance for app.use()
export default defineStore(() => {
  return createPinia()
})

// Re-export TinyBase composables and types for page imports
export { useDB } from './useDB'
export { useValue, useRowCount, useRows, useRow } from './useTinyBase'
export { createBayauStore, RELATION_TYPES, GENDERS, MEMORY_TYPES } from './tinybase'
export { uid } from './ulid'
export type { BayauStore, Member, Relationship, Memory, Invitation } from './tinybase'
