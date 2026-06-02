<template>
  <q-page v-if="member" class="profile-page">
    <q-btn flat round icon="arrow_back" class="back-btn" @click="$router.back()" />

    <!-- Hero -->
    <div class="hero">
      <div class="hero-content text-center q-px-lg">
        <q-avatar
          size="80px"
          :color="genderColor(member.gender)"
          text-color="white"
          font-size="36px"
          class="hero-avatar"
        >
          <img v-if="member.photo" :src="member.photo" alt="" />
          <template v-else>{{ initial }}</template>
        </q-avatar>
        <h1 class="hero-name">{{ member.name }}</h1>
        <p class="hero-sub">
          {{ GENDERS[member.gender]?.label || member.gender }}
          <template v-if="member.birthDate">
            &middot; {{ formatYear(member.birthDate) }}</template
          >
          <template v-if="member.birthDate">
            — {{ member.isDeceased ? formatYear(member.deathDate) || '?' : 'Present' }}
          </template>
        </p>
        <div
          class="hero-meta row justify-center q-gutter-x-md"
          v-if="member.location || member.occupation"
        >
          <span v-if="member.location"
            ><q-icon name="place" size="16px" /> {{ member.location }}</span
          >
          <span v-if="member.occupation"
            ><q-icon name="work" size="16px" /> {{ member.occupation }}</span
          >
        </div>
      </div>
    </div>

    <!-- Bio -->
    <q-card v-if="member.bio" flat class="q-mx-md q-mb-md info-card">
      <q-card-section class="q-py-sm">
        <p class="text-body2 q-ma-none">{{ member.bio }}</p>
      </q-card-section>
    </q-card>

    <!-- Parents -->
    <q-card flat bordered class="q-mx-md q-mb-md section-card">
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Parents</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="add"
          size="sm"
          color="primary"
          @click="openLink('parent')"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div v-if="!parents.length" class="text-caption text-grey-5 q-pa-sm">
          No parents recorded
        </div>
        <div
          v-for="p in parents"
          :key="p.id"
          class="person-row row items-center q-py-xs q-px-md cursor-pointer"
          @click="$router.push({ name: 'member', params: { id: p.id } })"
        >
          <q-avatar
            size="36px"
            :color="genderColor(p.gender)"
            text-color="white"
            font-size="16px"
            class="q-mr-sm"
          >
            {{ p.name.charAt(0) }}
          </q-avatar>
          <div class="col">
            <span class="text-body2 text-weight-medium">{{ p.name }}</span>
            <span class="text-caption text-grey-6 q-ml-sm">{{ parentLabel(p.id) }}</span>
          </div>
          <q-icon name="chevron_right" color="grey-4" size="18px" />
          <q-btn
            flat
            round
            dense
            icon="close"
            size="xs"
            color="grey-5"
            class="q-ml-xs"
            @click.stop="deleteRel(p.id, 'parent')"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Siblings -->
    <q-card flat bordered class="q-mx-md q-mb-md section-card">
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Siblings</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="add"
          size="sm"
          color="primary"
          @click="openLink('sibling')"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div v-if="!siblings.length" class="text-caption text-grey-5 q-pa-sm">
          No siblings recorded
        </div>
        <div
          v-for="s in siblings"
          :key="s.id"
          class="person-row row items-center q-py-xs q-px-md cursor-pointer"
          @click="$router.push({ name: 'member', params: { id: s.id } })"
        >
          <q-avatar
            size="36px"
            :color="genderColor(s.gender)"
            text-color="white"
            font-size="16px"
            class="q-mr-sm"
          >
            {{ s.name.charAt(0) }}
          </q-avatar>
          <div class="col">
            <span class="text-body2 text-weight-medium">{{ s.name }}</span>
            <span v-if="s.birthDate" class="text-caption text-grey-6 q-ml-sm"
              >b. {{ formatYear(s.birthDate) }}</span
            >
          </div>
          <q-icon name="chevron_right" color="grey-4" size="18px" />
          <q-btn
            flat
            round
            dense
            icon="close"
            size="xs"
            color="grey-5"
            class="q-ml-xs"
            @click.stop="deleteRel(s.id, 'sibling')"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Spouses -->
    <q-card flat bordered class="q-mx-md q-mb-md section-card">
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Spouses</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="add"
          size="sm"
          color="primary"
          @click="openLink('spouse')"
        />
      </q-card-section>
      <q-card-section v-if="spouses.length" class="q-pt-none">
        <div
          v-for="s in spouses"
          :key="s.id"
          class="person-row row items-center q-py-xs q-px-md cursor-pointer"
          @click="$router.push({ name: 'member', params: { id: s.id } })"
        >
          <q-avatar
            size="36px"
            :color="genderColor(s.gender)"
            text-color="white"
            font-size="16px"
            class="q-mr-sm"
          >
            {{ s.name.charAt(0) }}
          </q-avatar>
          <div class="col">
            <span class="text-body2 text-weight-medium">{{ s.name }}</span>
            <span v-if="spouseRel(s.id)" class="text-caption text-grey-6 q-ml-sm">
              💍 {{ formatYear(spouseRel(s.id)?.marriageDate || '') || '—' }}
              <template v-if="spouseRel(s.id)?.marriageEndDate">
                — {{ formatYear(spouseRel(s.id)?.marriageEndDate || '') }}
              </template>
            </span>
          </div>
          <q-icon name="chevron_right" color="grey-4" size="18px" />
          <q-btn
            flat
            round
            dense
            icon="close"
            size="xs"
            color="grey-5"
            class="q-ml-xs"
            @click.stop="deleteRel(s.id, 'spouse')"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Children -->
    <q-card flat bordered class="q-mx-md q-mb-md section-card">
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Children</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="add"
          size="sm"
          color="primary"
          @click="openLink('child')"
        />
      </q-card-section>
      <q-card-section v-if="children.length" class="q-pt-none">
        <div
          v-for="c in children"
          :key="c.id"
          class="person-row row items-center q-py-xs q-px-md cursor-pointer"
          @click="$router.push({ name: 'member', params: { id: c.id } })"
        >
          <q-avatar
            size="36px"
            :color="genderColor(c.gender)"
            text-color="white"
            font-size="16px"
            class="q-mr-sm"
          >
            {{ c.name.charAt(0) }}
          </q-avatar>
          <div class="col">
            <span class="text-body2 text-weight-medium">{{ c.name }}</span>
            <span class="text-caption text-grey-6 q-ml-sm">
              {{ childLabel(c.id) }}
              <template v-if="c.birthDate">
                &middot; b. {{ formatYear(c.birthDate) }}</template
              >
            </span>
          </div>
          <q-icon name="chevron_right" color="grey-4" size="18px" />
          <q-btn
            flat
            round
            dense
            icon="close"
            size="xs"
            color="grey-5"
            class="q-ml-xs"
            @click.stop="deleteRel(c.id, 'child')"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Edit FAB -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="edit" color="primary" @click="showEdit = true" />
    </q-page-sticky>

    <LinkDialog v-model="showLink" :member-id="id" :initial-type="linkType" />

    <!-- Edit dialog -->
    <q-dialog
      v-model="showEdit"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="edit-full">
        <q-bar class="bg-primary text-white">
          <q-btn flat dense icon="close" v-close-popup />
          <div class="text-weight-medium">Edit Profile</div>
          <q-space />
          <q-btn flat dense label="Save" @click="saveEdit" />
        </q-bar>
        <q-card-section class="q-gutter-md q-pt-lg">
          <q-input v-model="editName" label="Full Name" filled autofocus />
          <q-select
            v-model="editGender"
            :options="genderKeys"
            label="Gender"
            filled
            :option-label="
              (o: string) => (GENDERS as Record<string, { label: string }>)[o]?.label || o
            "
          />
          <q-separator />
          <div class="text-caption text-uppercase text-grey-6">Life Dates</div>
          <q-input v-model="editBirthDate" label="Birth Date" type="date" filled />
          <q-toggle v-model="editDeceased" label="Deceased" />
          <q-input
            v-if="editDeceased"
            v-model="editDeathDate"
            label="Death Date"
            type="date"
            filled
          />
          <q-separator />
          <div class="text-caption text-uppercase text-grey-6">Location & Work</div>
          <q-input v-model="editLocation" label="Current Location" filled />
          <q-input v-model="editBirthplace" label="Birthplace" filled />
          <q-input v-model="editOccupation" label="Occupation" filled />
          <q-separator />
          <div class="text-caption text-uppercase text-grey-6">Contact & Bio</div>
          <q-input v-model="editEmail" label="Email" type="email" filled />
          <q-input v-model="editBio" label="Bio" type="textarea" filled autogrow />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page v-else class="flex flex-center"
    ><q-spinner color="primary" size="3em"
  /></q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDB, useRows, GENDERS } from 'src/stores'
import type { Member, Relationship } from 'src/stores'
import LinkDialog from 'components/LinkDialog.vue'

const route = useRoute()
const db = useDB()
const members = useRows<Member>('members')
const rels = useRows<Relationship>('relationships')
const id = computed(() => route.params.id as string)
const member = computed(() => members.value.find((m) => m.id === id.value))
const initial = computed(() => member.value?.name?.charAt(0).toUpperCase() || '?')

const fromRels = computed(() => rels.value.filter((r) => r.fromId === id.value))
const toRels = computed(() =>
  rels.value.filter((r) => r.toId === id.value && r.type === 'parent'),
)

const spouses = computed(() => {
  const ids = fromRels.value.filter((r) => r.type === 'spouse').map((r) => r.toId)
  return members.value.filter((m) => ids.includes(m.id))
})
const spouseRel = (sid: string) =>
  fromRels.value.find((r) => r.type === 'spouse' && r.toId === sid)

function deleteRel(targetId: string, linkType: string) {
  // Map 'child' -> 'parent' since children are stored as parent-type relationships
  const relType = linkType === 'child' ? 'parent' : linkType
  const rel = rels.value.find((r) => {
    if (relType === 'parent' && linkType === 'parent') {
      // Adding a parent: r.fromId = parent, r.toId = current
      return r.fromId === targetId && r.toId === id.value && r.type === 'parent'
    }
    if (relType === 'parent' && linkType === 'child') {
      // Current is parent of child: r.fromId = current, r.toId = child
      return r.fromId === id.value && r.toId === targetId && r.type === 'parent'
    }
    if (relType === 'sibling') {
      return (
        ((r.fromId === targetId && r.toId === id.value) ||
          (r.fromId === id.value && r.toId === targetId)) &&
        r.type === 'sibling'
      )
    }
    // Spouse: current member is the source
    return r.fromId === id.value && r.toId === targetId && r.type === relType
  })
  if (rel) db.delRow('relationships', rel.id)
}

const parents = computed(() => {
  const ids = toRels.value.map((r) => r.fromId)
  return members.value.filter((m) => ids.includes(m.id))
})
const parentLabel = (pid: string) => {
  const p = members.value.find((m) => m.id === pid)
  return p?.gender === 'male' ? 'Father' : p?.gender === 'female' ? 'Mother' : 'Parent'
}

const children = computed(() => {
  const ids = fromRels.value.filter((r) => r.type === 'parent').map((r) => r.toId)
  return members.value.filter((m) => ids.includes(m.id))
})
const childLabel = (cid: string) =>
  fromRels.value.find((r) => r.type === 'parent' && r.toId === cid)?.subtype || 'Child'

const siblings = computed(() => {
  // Direct sibling relationships
  const directIds = rels.value
    .filter((r) => (r.fromId === id.value || r.toId === id.value) && r.type === 'sibling')
    .map((r) => (r.fromId === id.value ? r.toId : r.fromId))
  // Siblings via shared parents
  const parentIds = toRels.value.map((r) => r.fromId)
  const sharedIds = new Set<string>()
  for (const pid of parentIds) {
    rels.value
      .filter((r) => r.fromId === pid && r.type === 'parent' && r.toId !== id.value)
      .forEach((r) => sharedIds.add(r.toId))
  }
  const allIds = new Set([...directIds, ...sharedIds])
  return members.value.filter((m) => allIds.has(m.id))
})

const showEdit = ref(false)
const showLink = ref(false)
const linkType = ref('spouse')
const editName = ref('')
const editGender = ref('other')
const editBirthDate = ref('')
const editDeathDate = ref('')
const editLocation = ref('')
const editBirthplace = ref('')
const editOccupation = ref('')
const editEmail = ref('')
const editBio = ref('')
const editDeceased = ref(false)
const genderKeys = Object.keys(GENDERS)

watch(member, (m) => {
  if (!m) return
  editName.value = m.name
  editGender.value = m.gender
  editBirthDate.value = m.birthDate
  editDeathDate.value = m.deathDate
  editLocation.value = m.location
  editBirthplace.value = m.birthplace
  editOccupation.value = m.occupation
  editEmail.value = m.email
  editBio.value = m.bio
  editDeceased.value = m.isDeceased
})

function saveEdit() {
  if (!member.value) return
  db.setRow('members', member.value.id, {
    name: editName.value,
    gender: editGender.value,
    birthDate: editBirthDate.value,
    deathDate: editDeceased.value ? editDeathDate.value : '',
    birthplace: editBirthplace.value,
    location: editLocation.value,
    occupation: editOccupation.value,
    email: editEmail.value,
    photo: member.value.photo,
    bio: editBio.value,
    isDeceased: editDeceased.value,
    createdAt: member.value.createdAt,
    updatedAt: new Date().toISOString(),
  })
  showEdit.value = false
}

function openLink(type: string) {
  linkType.value = type
  showLink.value = true
}
function formatYear(d: string) {
  return d ? new Date(d).getFullYear().toString() : ''
}
function genderColor(g: string) {
  return (GENDERS as Record<string, { color: string }>)[g]?.color || 'grey-6'
}
</script>

<style scoped>
.profile-page {
  background: #fdfaf5;
  min-height: 100vh;
}
.back-btn {
  position: absolute;
  top: 8px;
  left: 4px;
  z-index: 10;
  color: white;
}

.hero {
  background: linear-gradient(160deg, #1b5e32, #2d8a4e, #3a6b3a);
  padding: 48px 0 24px;
}
.hero-avatar {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  margin-bottom: 8px;
}
.hero-name {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 2px;
  color: #fff;
}
.hero-sub {
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
}
.hero-meta {
  font-size: 12px;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.7);
}

.info-card {
  border-radius: 14px;
  background: #fff;
}
.section-card {
  border-radius: 14px;
  border: 1px solid rgba(139, 94, 60, 0.08);
}
.person-row {
  border-radius: 8px;
  transition: background 0.15s;
}
.person-row:hover {
  background: rgba(45, 138, 78, 0.04);
}

.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
  font-weight: 700;
}
.edit-full {
  border-radius: 0;
  min-height: 100vh;
}
</style>
