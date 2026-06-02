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
        <div class="q-mb-sm">
          <q-btn-toggle
            v-model="form.gender"
            spread
            no-caps
            toggle-color="primary"
            :options="[
              { label: 'Male', value: 'male', icon: 'man' },
              { label: 'Female', value: 'female', icon: 'woman' },
            ]"
          />
        </div>
        <q-input v-model="form.location" label="Location" outlined />
        <q-input
          v-model="form.ageOrYear"
          label="Age or Birth Year"
          outlined
          hint="e.g. 45 or 1980"
          @update:model-value="onAgeChange"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-px-md">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn flat label="Add" color="primary" @click="submit" :disable="!form.name" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useDB } from 'src/stores'
import { uid } from 'src/stores/ulid'

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
const form = reactive({ name: '', gender: 'male', location: '', ageOrYear: '' })
let birthYear = ''

function onAgeChange(val: string | number | null) {
  const v = String(val || '').trim()
  if (!v) {
    birthYear = ''
    return
  }
  const n = parseInt(v, 10)
  if (isNaN(n)) {
    birthYear = ''
    return
  }
  if (n >= 1000 && n <= 2100) {
    // Birth year entered directly
    birthYear = String(n)
  } else if (n > 0 && n <= 150) {
    // Age entered — convert to birth year
    birthYear = String(new Date().getFullYear() - n)
  } else {
    birthYear = ''
  }
}

function submit() {
  const id = uid('m')
  const now = new Date().toISOString()
  db.setRow('members', id, {
    name: form.name,
    gender: form.gender,
    birthDate: birthYear,
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
  form.ageOrYear = ''
  birthYear = ''
  show.value = false
  emit('saved', id)
}
</script>
