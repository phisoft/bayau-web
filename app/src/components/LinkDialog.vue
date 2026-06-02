<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 100%; max-width: 420px">
      <q-bar class="bg-primary text-white">
        <div class="text-weight-medium">Add {{ typeLabel }}</div>
        <q-space />
        <q-btn flat dense icon="close" v-close-popup />
      </q-bar>

      <!-- Target member -->
      <q-card-section v-if="target" class="row items-center q-pb-none">
        <q-avatar
          size="36px"
          :color="genderColor(target.gender)"
          text-color="white"
          font-size="16px"
          class="q-mr-sm"
        >
          {{ target.name.charAt(0) }}
        </q-avatar>
        <div class="text-body2 text-weight-medium">{{ target.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <!-- Search existing -->
        <q-input
          v-model="search"
          outlined
          rounded
          dense
          bg-color="white"
          placeholder="Search members..."
          autofocus
          class="q-mb-sm"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>

        <q-list dense separator v-if="results.length">
          <q-item v-for="m in results" :key="m.id" clickable v-ripple @click="link(m.id)">
            <q-item-section avatar>
              <q-avatar
                size="36px"
                :color="genderColor(m.gender)"
                text-color="white"
                font-size="16px"
              >
                {{ m.name.charAt(0) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ m.name }}</q-item-label>
              <q-item-label caption>{{ m.email || '—' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-if="search && !results.length" class="text-center text-grey q-pa-md">
          <q-icon name="search_off" size="32px" /><br />
          <span class="text-caption">Not found. Create a new record below.</span>
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section class="text-center">
        <q-btn
          flat
          color="primary"
          icon="person_add"
          label="Create New Record"
          @click="showNew = true"
        />
      </q-card-section>

      <MemberFormDialog v-model="showNew" @saved="onNewMemberLinked" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDB, useRows, GENDERS, RELATION_TYPES } from 'src/stores'
import { uid } from 'src/stores/ulid'
import MemberFormDialog from 'components/MemberFormDialog.vue'
import type { Member } from 'src/stores'

const props = defineProps<{
  modelValue: boolean
  memberId: string
  initialType?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const db = useDB()
const members = useRows<Member>('members')
const search = ref('')
const linkType = ref(props.initialType || 'spouse')

watch(
  () => props.initialType,
  (val) => {
    if (val) linkType.value = val
  },
)

watch(
  () => props.modelValue,
  (open) => {
    if (open) search.value = ''
  },
)

const showNew = ref(false)

function onNewMemberLinked(memberId: string) {
  link(memberId)
}

const target = computed(() => members.value.find((m) => m.id === props.memberId))
const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    sibling: 'Sibling',
  }
  return labels[linkType.value] || 'Relation'
})
const relOptions = Object.entries(RELATION_TYPES)
  .filter(([k]) => ['spouse', 'child', 'parent', 'sibling'].includes(k))
  .map(([k, v]) => ({ key: k, ...v }))

const results = computed(() => {
  if (!search.value) return []
  const q = search.value.toLowerCase()
  return members.value
    .filter((m) => m.id !== props.memberId)
    .filter((m) => m.name.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q))
    .slice(0, 5)
})

function link(toId: string) {
  const dbType = linkType.value === 'child' ? 'parent' : linkType.value
  const fromId = linkType.value === 'parent' ? toId : props.memberId
  const targetId = linkType.value === 'parent' ? props.memberId : toId

  db.setRow('relationships', uid('r'), {
    fromId,
    toId: targetId,
    type: dbType,
    subtype: '',
    marriageDate: '',
    marriageEndDate: '',
    notes: '',
    createdAt: new Date().toISOString(),
  })

  search.value = ''
  show.value = false
}

function genderColor(g: string) {
  return (GENDERS as Record<string, { color: string }>)[g]?.color || 'grey-6'
}
</script>

<style scoped>
.type-card {
  border-radius: 12px;
  transition: all 0.2s;
}
.type-card:hover {
  transform: translateY(-1px);
}
</style>
