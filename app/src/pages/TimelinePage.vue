<template>
  <q-page class="q-pa-md">
    <div class="text-h6 text-primary text-weight-bold q-mb-md">Timeline</div>

    <q-timeline v-if="sortedMemories.length > 0" color="primary">
      <q-timeline-entry
        v-for="mm in sortedMemories"
        :key="mm.id"
        :icon="
          entryColor(mm.type) === 'primary'
            ? 'photo'
            : entryColor(mm.type) === 'accent'
              ? 'event'
              : 'description'
        "
        :color="entryColor(mm.type)"
        side="left"
      >
        <q-card flat bordered class="timeline-card">
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2 text-weight-medium">{{ mm.title }}</div>
            <div class="text-caption text-grey-6">{{ formatDate(mm.date) }}</div>
            <div class="text-body2 text-grey-7 q-mt-sm">{{ mm.description }}</div>
            <div v-if="mm.location" class="text-caption text-grey q-mt-sm">
              <q-icon name="place" size="14px" /> {{ mm.location }}
            </div>
            <div class="q-mt-sm">
              <q-badge outline :color="entryColor(mm.type)" :label="mm.type" size="sm" />
              <q-chip
                v-for="mid in (mm.memberIds || '').split(',').filter(Boolean)"
                :key="mid"
                size="sm"
                color="primary"
                text-color="white"
                :label="getMemberName(mid)"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-timeline-entry>
    </q-timeline>

    <q-card v-else flat bordered class="q-pa-xl text-center">
      <q-icon name="timeline" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">Timeline Empty</div>
      <div class="text-body1 text-grey q-mt-sm">
        Add memories to build your family timeline
      </div>
    </q-card>

    <!-- Add FAB -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showAdd = true" />
    </q-page-sticky>

    <!-- Add dialog -->
    <q-dialog v-model="showAdd" persistent>
      <q-card style="width: 100%; max-width: 420px">
        <q-bar class="bg-primary text-white">
          <div class="text-weight-medium">Add Memory</div>
          <q-space />
          <q-btn flat dense icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="form.title" label="Title" outlined autofocus />
          <q-input
            v-model="form.description"
            label="Description"
            type="textarea"
            outlined
          />
          <q-select
            v-model="form.type"
            :options="typeOptions"
            label="Type"
            outlined
            :option-label="
              (o: string) =>
                (MEMORY_TYPES as Record<string, { label: string }>)[o]?.label || o
            "
          />
          <q-input
            v-model="form.date"
            label="Date"
            mask="####-##-##"
            outlined
            hint="YYYY-MM-DD"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.date" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="form.location" label="Location" outlined />
        </q-card-section>
        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            flat
            label="Add"
            color="primary"
            @click="addMemory"
            :disable="!form.title"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useDB, useRows, MEMORY_TYPES } from 'src/stores'
import { uid } from 'src/stores/ulid'
import type { Memory } from 'src/stores'

const db = useDB()
const memoryRows = useRows<Memory>('memories')

const sortedMemories = computed(() =>
  [...memoryRows.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  ),
)

const showAdd = ref(false)
const form = reactive({
  title: '',
  description: '',
  type: 'event',
  date: '',
  location: '',
})
const typeOptions = Object.keys(MEMORY_TYPES)

function addMemory() {
  db.setRow('memories', uid('mm'), {
    title: form.title,
    description: form.description,
    type: form.type,
    date: form.date,
    location: form.location,
    mediaUrl: '',
    memberIds: '',
    createdAt: new Date().toISOString(),
  })
  form.title = ''
  form.description = ''
  form.date = ''
  form.location = ''
  showAdd.value = false
}

function getMemberName(id: string) {
  const row = db.getRow('members', id)
  return (row?.name as string) || id
}
function entryColor(t: string) {
  return t === 'photo'
    ? 'primary'
    : t === 'event'
      ? 'accent'
      : t === 'document'
        ? 'info'
        : 'secondary'
}
function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.timeline-card {
  border-radius: 12px;
  border: 1px solid rgba(139, 94, 60, 0.08);
}
</style>
