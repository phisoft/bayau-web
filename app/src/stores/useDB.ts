import { inject } from 'vue'
import type { BayauStore } from 'src/stores/tinybase'

export function useDB(): BayauStore {
  const db = inject<BayauStore>('db')
  if (!db) throw new Error('TinyBase store not provided')
  return db
}
