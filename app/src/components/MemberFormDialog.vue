<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 100%; max-width: 420px">
      <q-bar class="bg-primary text-white">
        <div class="text-weight-medium">Add Family Member</div>
        <q-space />
        <q-btn flat dense icon="close" v-close-popup />
      </q-bar>

      <q-card-section class="q-gutter-sm">
        <q-input v-model="form.name" label="Full Name" outlined autofocus />
        <q-select
          v-model="form.gender"
          :options="genderKeys"
          label="Gender"
          outlined
          :option-label="
            (o: string) => (GENDERS as Record<string, { label: string }>)[o]?.label || o
          "
        />
        <q-input v-model="form.location" label="Location" outlined />
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn flat label="Add" color="primary" @click="submit" :disable="!form.name" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useDB, GENDERS } from 'src/stores'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [memberId: string]
}>()

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const db = useDB()
const form = reactive({ name: '', gender: 'other', location: '' })
const genderKeys = Object.keys(GENDERS)

function submit() {
  const id = 'm' + Date.now()
  const now = new Date().toISOString()
  db.setRow('members', id, {
    name: form.name,
    gender: form.gender,
    birthDate: '',
    deathDate: '',
    birthplace: '',
    location: form.location,
    occupation: '',
    email: '',
    photo: '',
    bio: '',
    isDeceased: false,
    createdAt: now,
    updatedAt: now,
  })
  form.name = ''
  form.location = ''
  show.value = false
  emit('saved', id)
}
</script>
