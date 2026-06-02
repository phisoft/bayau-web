<template>
  <q-page class="q-pa-md">
    <div class="text-h6 text-primary text-weight-bold q-mb-md">Timeline</div>

    <q-timeline v-if="sortedMemories.length > 0" color="primary">
      <q-timeline-entry
        v-for="mm in sortedMemories" :key="mm.id"
        :title="mm.title"
        :subtitle="formatDate(mm.date)"
        :icon="typeIcon(mm.type)"
        :color="entryColor(mm.type)"
        side="left"
      >
        <div>{{ mm.description }}</div>
        <div v-if="mm.location" class="text-caption text-grey q-mt-xs">
          <q-icon name="place" size="14px" /> {{ mm.location }}
        </div>
        <div class="q-mt-sm">
          <q-chip v-for="mid in (mm.memberIds||'').split(',').filter(Boolean)" :key="mid"
            size="sm" color="primary" text-color="white" :label="getMemberName(mid)" />
        </div>
      </q-timeline-entry>
    </q-timeline>

    <q-card v-else flat bordered class="q-pa-xl text-center">
      <q-icon name="timeline" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">Timeline Empty</div>
      <div class="text-body1 text-grey q-mt-sm">Add memories to build your family timeline</div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDB, useRows, MEMORY_TYPES } from 'src/stores'
import type { Memory } from 'src/stores'

const db = useDB()
const memoryRows = useRows<Memory>('memories')

const sortedMemories = computed(() =>
  [...memoryRows.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

function getMemberName(id: string) {
  const row = db.getRow('members', id)
  return (row?.name as string) || id
}
function typeIcon(t: string) {
  return (MEMORY_TYPES as Record<string, { icon: string }>)[t]?.icon || 'event'
}
function entryColor(t: string) {
  return t === 'photo' ? 'primary' : t === 'event' ? 'accent' : t === 'document' ? 'info' : 'secondary'
}
function formatDate(d: string) {
  if (!d) return ''; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
