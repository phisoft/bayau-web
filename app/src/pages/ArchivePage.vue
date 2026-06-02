<template>
  <q-page class="q-pa-md">
    <div class="text-h6 text-primary text-weight-bold q-mb-md">Archive</div>

    <!-- Type filter chips -->
    <div class="row q-gutter-sm q-mb-md">
      <q-chip v-for="t in memoryTypes" :key="t.key"
        :outline="filter !== t.key" :color="filter === t.key ? 'primary' : 'grey-6'"
        :icon="t.icon" :label="t.label" clickable @click="filter = filter === t.key ? '' : t.key" />
    </div>

    <!-- Memory cards -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="mm in filteredMemories" :key="mm.id">
        <q-card flat bordered class="memory-card cursor-pointer">
          <!-- Placeholder media -->
          <div class="bg-grey-3 flex flex-center" style="height:140px">
            <q-icon :name="typeIcon(mm.type)" size="48px" color="grey-5" />
          </div>
          <q-card-section>
            <div class="text-subtitle2 text-weight-medium">{{ mm.title }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">{{ mm.description }}</div>
            <div class="row items-center q-mt-sm q-gutter-x-sm">
              <q-badge outline color="primary" :label="mm.type" />
              <div class="text-caption text-grey">{{ formatDate(mm.date) }}</div>
              <div v-if="mm.location" class="text-caption text-grey">{{ mm.location }}</div>
            </div>
            <div class="q-mt-sm">
              <q-chip v-for="mid in (mm.memberIds||'').split(',').filter(Boolean)" :key="mid"
                size="sm" color="primary" text-color="white" :label="getMemberName(mid)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty -->
    <q-card v-if="filteredMemories.length === 0" flat bordered class="q-pa-xl text-center">
      <q-icon name="photo_album" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">No Memories Yet</div>
      <div class="text-body1 text-grey q-mt-sm">Capture family moments</div>
    </q-card>

    <!-- FAB -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_photo_alternate" color="accent" text-color="white" @click="showAdd=true" />
    </q-page-sticky>

    <!-- Add dialog -->
    <q-dialog v-model="showAdd">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">Add Memory</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="newTitle" label="Title" outlined autofocus />
          <q-input v-model="newDesc" label="Description" type="textarea" outlined />
          <q-select v-model="newType" :options="typeOptions" label="Type" outlined
            :option-label="(o:string)=>(MEMORY_TYPES as Record<string,{label:string}>)[o]?.label||o" />
          <q-input v-model="newDate" label="Date" type="date" outlined />
          <q-input v-model="newLocation" label="Location" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="accent" text-color="white" @click="addMemory" :disable="!newTitle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB, useRowCount, useRows, MEMORY_TYPES } from 'src/stores'
import type { Memory } from 'src/stores'

const db = useDB()
const memoryRows = useRows<Memory>('memories')
const filter = ref('')
const memoryTypes = Object.entries(MEMORY_TYPES).map(([k, v]) => ({ key: k, ...v }))

const filteredMemories = computed(() => {
  if (!filter.value) return memoryRows.value
  return memoryRows.value.filter(m => m.type === filter.value)
})

const showAdd = ref(false)
const newTitle = ref('')
const newDesc = ref('')
const newType = ref('photo')
const newDate = ref('')
const newLocation = ref('')
const typeOptions = Object.keys(MEMORY_TYPES)

function addMemory() {
  db.setRow('memories', 'mm' + Date.now(), {
    title: newTitle.value, description: newDesc.value, type: newType.value,
    date: newDate.value, location: newLocation.value,
    mediaUrl: '', memberIds: '', createdAt: new Date().toISOString(),
  })
  newTitle.value = ''; newDesc.value = ''; newDate.value = ''; newLocation.value = ''
  showAdd.value = false
}

function getMemberName(id: string) {
  const row = db.getRow('members', id)
  return (row?.name as string) || id
}
function typeIcon(t: string) {
  return (MEMORY_TYPES as Record<string, { icon: string }>)[t]?.icon || 'photo'
}
function formatDate(d: string) {
  if (!d) return ''; return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.memory-card { border-radius: 12px; transition: all 0.3s; }
.memory-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
</style>
