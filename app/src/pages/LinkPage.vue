<template>
  <q-page class="q-pa-md">
    <div class="text-h6 text-primary text-weight-bold q-mb-md">Add Relationship</div>

    <!-- Target member indicator -->
    <q-card flat bordered class="q-mb-md" v-if="targetMember">
      <q-card-section class="row items-center">
        <q-avatar
          rounded
          size="44px"
          :color="genderColor(targetMember.gender)"
          text-color="white"
          font-size="20px"
        >
          {{ targetMember.name.charAt(0) }}
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-weight-medium">{{ targetMember.name }}</div>
          <div class="text-caption text-grey">Linking to this member</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Relationship type selector -->
    <div class="row q-col-gutter-sm q-mb-lg">
      <div class="col-6" v-for="rt in relTypeOptions" :key="rt.key">
        <q-card
          flat
          bordered
          :class="{ 'bg-primary text-white': linkType === rt.key }"
          class="cursor-pointer text-center q-pa-md rel-card"
          @click="linkType = rt.key"
        >
          <q-icon :name="rt.icon" size="28px" />
          <div class="text-subtitle2 q-mt-sm">{{ rt.label }}</div>
        </q-card>
      </div>
    </div>

    <q-separator class="q-mb-md" />

    <!-- Choose existing member -->
    <div class="text-subtitle1 text-weight-bold q-mb-sm">Choose from Existing</div>
    <q-input
      v-model="memberSearch"
      outlined
      rounded
      dense
      bg-color="white"
      placeholder="Search members..."
      class="q-mb-md"
    >
      <template #prepend><q-icon name="search" /></template>
    </q-input>

    <q-list separator>
      <q-item
        v-for="m in searchResults"
        :key="m.id"
        clickable
        v-ripple
        @click="linkMember(m.id)"
      >
        <q-item-section avatar>
          <q-avatar
            rounded
            size="40px"
            :color="genderColor(m.gender)"
            text-color="white"
            font-size="18px"
          >
            {{ m.name.charAt(0) }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ m.name }}</q-item-label>
          <q-item-label caption>{{ m.email || 'No email' }}</q-item-label>
        </q-item-section>
        <q-item-section side><q-icon name="chevron_right" /></q-item-section>
      </q-item>
    </q-list>

    <div
      v-if="searchResults.length === 0 && memberSearch"
      class="text-center q-pa-md text-grey"
    >
      <q-icon name="search_off" size="48px" /><br />
      No records found<br />
      <span class="text-caption"
        >Try searching with a different name or create a new record below.</span
      >
    </div>

    <q-separator class="q-my-lg" />

    <!-- Create new record -->
    <q-btn
      color="primary"
      icon="person_add"
      label="Create New Record"
      rounded
      class="full-width"
      @click="showNew = true"
    />

    <!-- Create dialog -->
    <q-dialog v-model="showNew">
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">New Family Member</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="newName" label="Full Name" outlined autofocus />
          <q-select v-model="newGender" :options="genderKeys" label="Gender" outlined />
          <q-input v-model="newEmail" label="Email" type="email" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Create & Link"
            color="primary"
            @click="createAndLink"
            :disable="!newName"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDB, useValue, useRows, GENDERS, RELATION_TYPES } from 'src/stores'
import type { Member } from 'src/stores'
import { useRouter } from 'vue-router'

const db = useDB()
const router = useRouter()
const members = useRows<Member>('members')
const selectedId = useValue('selectedMemberId')
const pendingType = useValue('pendingLinkType')
const memberSearch = ref('')
const linkType = ref(pendingType.value || 'spouse')
const showNew = ref(false)
const newName = ref('')
const newGender = ref('other')
const newEmail = ref('')
const genderKeys = Object.keys(GENDERS)

const relTypeOptions = Object.entries(RELATION_TYPES).map(([k, v]) => ({ key: k, ...v }))

const targetMember = computed(() => members.value.find((m) => m.id === selectedId.value))

const searchResults = computed(() => {
  if (!memberSearch.value) return []
  const q = memberSearch.value.toLowerCase()
  return members.value
    .filter((m) => m.id !== selectedId.value)
    .filter((m) => m.name.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q))
    .slice(0, 5)
})

function linkMember(toId: string) {
  const now = new Date().toISOString()
  db.setRow('relationships', 'r' + Date.now(), {
    fromId: selectedId.value,
    toId,
    type: linkType.value,
    subtype: '',
    marriageDate: '',
    marriageEndDate: '',
    notes: '',
    createdAt: now,
  })
  memberSearch.value = ''
  router.push({ name: 'member', params: { id: selectedId.value } })
}

function createAndLink() {
  const id = 'm' + Date.now()
  const now = new Date().toISOString()
  db.setRow('members', id, {
    name: newName.value,
    gender: newGender.value,
    birthDate: '',
    deathDate: '',
    birthplace: '',
    location: '',
    occupation: '',
    email: newEmail.value,
    photo: '',
    bio: '',
    isDeceased: false,
    createdAt: now,
    updatedAt: now,
  })
  linkMember(id)
}

function genderColor(g: string) {
  return (GENDERS as Record<string, { color: string }>)[g]?.color || 'grey-6'
}
</script>

<style scoped>
.rel-card {
  border-radius: 14px;
  transition: all 0.3s;
}
.rel-card:hover {
  transform: translateY(-2px);
}
</style>
