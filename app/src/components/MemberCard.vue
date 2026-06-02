<template>
  <q-card
    flat
    bordered
    class="member-card cursor-pointer"
    @click="$emit('click', member)"
  >
    <q-card-section class="row items-center q-py-sm q-px-md">
      <!-- Avatar: photo or initial letter -->
      <q-avatar
        size="48px"
        :color="member.photo ? 'transparent' : genderColor"
        text-color="white"
        font-size="22px"
        class="q-mr-md"
      >
        <img v-if="member.photo" :src="member.photo" alt="" />
        <template v-else>{{ initial }}</template>
      </q-avatar>

      <!-- Name + meta -->
      <div class="col">
        <div class="text-body1 text-weight-medium">{{ member.name }}</div>
        <div class="text-caption text-grey-6">
          <span v-if="member.location">{{ member.location }} &middot; </span>
          <span>{{ genderLabel }}</span>
        </div>
      </div>

      <!-- Badge + chevron -->
      <q-badge outline :color="genderColor" :label="genderLabel" />
      <q-icon name="chevron_right" color="grey-4" class="q-ml-sm" size="22px" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GENDERS } from 'src/stores'
import type { Member } from 'src/stores'

const props = defineProps<{
  member: Member
}>()

defineEmits<{
  click: [member: Member]
}>()

const initial = computed(() => props.member.name?.charAt(0).toUpperCase() || '?')

const genderColor = computed(
  () =>
    (GENDERS as Record<string, { color: string }>)[props.member.gender]?.color ||
    'grey-6',
)

const genderLabel = computed(
  () =>
    (GENDERS as Record<string, { label: string }>)[props.member.gender]?.label ||
    props.member.gender,
)
</script>

<style scoped>
.member-card {
  border-radius: 14px;
  transition: all 0.2s ease;
  border: 1px solid rgba(139, 94, 60, 0.08);
}
.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
}
.member-card:active {
  transform: scale(0.985);
}
</style>
