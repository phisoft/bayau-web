<template>
  <q-page class="q-pa-md">
    <!-- Search -->
    <q-input
      v-model="search"
      outlined
      rounded
      placeholder="Search"
      class="family-search q-mb-md"
      dense
      bg-color="white"
    >
      <template #prepend><q-icon name="search" /></template>
      <template #append v-if="search">
        <q-icon name="close" class="cursor-pointer" @click="search = ''" />
      </template>
    </q-input>

    <!-- Member list -->
    <div class="q-gutter-y-sm">
      <MemberCard
        v-for="m in filteredMembers"
        :key="m.id"
        :member="m"
        @click="$router.push({ name: 'member', params: { id: m.id } })"
      />
    </div>

    <!-- Empty -->
    <q-card v-if="filteredMembers.length === 0" flat bordered class="q-pa-xl text-center">
      <q-icon name="group" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">No Members Found</div>
      <div class="text-body1 text-grey q-mt-sm">
        {{ memberCount === 0 ? 'Start your family tree' : 'Try a different search' }}
      </div>
    </q-card>

    <MemberFormDialog v-model="showAdd" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDB, useRowCount, useRows } from 'src/stores'
import type { Member } from 'src/stores'
import MemberCard from 'components/MemberCard.vue'
import MemberFormDialog from 'components/MemberFormDialog.vue'

const db = useDB()
const memberCount = useRowCount('members')
const rows = useRows<Member>('members')
const search = ref('')

const filteredMembers = computed(() => {
  if (!search.value) return rows.value
  const q = search.value.toLowerCase()
  return rows.value.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.occupation?.toLowerCase().includes(q),
  )
})

const showAdd = ref(false)

// Listen for add signal from bottom nav
function onOpenAdd() {
  showAdd.value = true
}
onMounted(() => window.addEventListener('bayau:open-add', onOpenAdd))
onUnmounted(() => window.removeEventListener('bayau:open-add', onOpenAdd))
</script>
