import { ref, onUnmounted, type Ref } from 'vue'
import { useDB } from './useDB'

// ── Reactive value ─────────────────────────────────────
export function useValue(valueId: string): Ref<string> {
  const db = useDB()
  const val = ref(db.getValue(valueId) ?? '')

  const listenerId = db.addValueListener(valueId, (_, newVal) => {
    val.value = newVal ?? ''
  })

  onUnmounted(() => db.delListener(listenerId))
  return val
}

// ── Reactive row count ─────────────────────────────────
export function useRowCount(tableId: string): Ref<number> {
  const db = useDB()
  const count = ref(Object.keys(db.getTable(tableId)).length)

  const listenerId = db.addTableListener(tableId, () => {
    count.value = Object.keys(db.getTable(tableId)).length
  })

  onUnmounted(() => db.delListener(listenerId))
  return count
}

// ── Reactive table rows ────────────────────────────────
export function useRows<T = Record<string, string>>(
  tableId: string,
): Ref<(T & { id: string })[]> {
  const db = useDB()
  const readRows = () =>
    Object.entries(db.getTable(tableId)).map(([id, row]) => ({ id, ...row })) as (T & {
      id: string
    })[]

  const rows = ref(readRows())

  const listenerId = db.addTableListener(tableId, () => {
    rows.value = readRows()
  })

  onUnmounted(() => db.delListener(listenerId))
  return rows
}

// ── Reactive row ───────────────────────────────────────
export function useRow<T = Record<string, string>>(
  tableId: string,
  rowId: string,
): Ref<T | null> {
  const db = useDB()
  const row = ref<T | null>(db.getRow(tableId, rowId) as T | null)

  const listenerId = db.addRowListener(tableId, rowId, () => {
    row.value = db.getRow(tableId, rowId) as T | null
  })

  onUnmounted(() => db.delListener(listenerId))
  return row
}
