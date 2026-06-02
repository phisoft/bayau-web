<template>
  <q-page v-if="member" class="profile-page">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-content row items-center" style="padding: 12px 24px">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.back()"
          style="color: rgba(255, 255, 255, 0.8)"
        />
        <!-- Photo -->
        <div class="hero-avatar-wrapper">
          <img v-if="member.photo" :src="member.photo" class="hero-photo" />
          <q-avatar
            v-else
            size="72px"
            :color="genderColor(member.gender)"
            text-color="white"
            font-size="32px"
            class="hero-avatar"
          >
            {{ initial }}
          </q-avatar>
        </div>
        <!-- Info -->
        <div class="q-ml-md col self-center">
          <div class="hero-name">{{ member.name }}</div>
          <div class="hero-sub">
            {{ GENDERS[member.gender]?.label || member.gender }}
            <template v-if="member.birthDate">
              &middot; {{ formatYear(member.birthDate) }}</template
            >
            <template v-if="member.birthDate">
              — {{ member.deathDate ? formatYear(member.deathDate) : 'Present' }}
            </template>
          </div>
          <div class="hero-meta" v-if="member.location || member.occupation">
            <span v-if="member.location"
              ><q-icon name="place" size="14px" /> {{ member.location }}</span
            >
            <span v-if="member.occupation" class="q-ml-md"
              ><q-icon name="work" size="14px" /> {{ member.occupation }}</span
            >
          </div>
        </div>
        <q-btn
          flat
          round
          icon="edit"
          size="sm"
          @click="showEdit = true"
          style="color: rgba(255, 255, 255, 0.8)"
        />
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
            @click.stop="confirmDelete(p.id, 'parent', p.name)"
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
            @click.stop="confirmDelete(s.id, 'sibling', s.name)"
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
            @click.stop="confirmDelete(s.id, 'spouse', s.name)"
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
            @click.stop="confirmDelete(c.id, 'child', c.name)"
          />
        </div>
      </q-card-section>
    </q-card>

    <LinkDialog v-model="showLink" :member-id="id" :initial-type="linkType" />

    <!-- Edit dialog -->
    <q-dialog v-model="showEdit" persistent>
      <q-card style="width: 100%; max-width: 420px">
        <q-bar class="bg-primary text-white">
          <q-btn flat dense icon="close" v-close-popup />
          <div class="text-weight-medium">Edit Profile</div>
          <q-space />
          <q-btn flat dense label="Save" @click="saveEdit" />
        </q-bar>
        <q-card-section class="q-gutter-md q-pa-lg">
          <!-- Photo -->
          <div class="text-center">
            <q-avatar size="72px" class="cursor-pointer" @click="photoInput?.click()">
              <img
                v-if="editPhoto"
                :src="editPhoto"
                style="object-fit: cover; width: 100%; height: 100%"
              />
              <q-icon v-else name="camera_alt" size="28px" color="grey-5" />
            </q-avatar>
            <div
              class="text-caption text-primary q-mt-xs cursor-pointer"
              @click="photoInput?.click()"
            >
              {{ editPhoto ? 'Change Photo' : 'Add Photo' }}
            </div>
          </div>
          <input
            ref="photoInput"
            type="file"
            accept="image/*"
            hidden
            @change="onPhotoSelected"
          />

          <q-input v-model="editName" label="Full Name" outlined autofocus />
          <q-btn-toggle
            v-model="editGender"
            spread
            no-caps
            toggle-color="primary"
            :options="[
              { label: 'Male', value: 'male', icon: 'man' },
              { label: 'Female', value: 'female', icon: 'woman' },
            ]"
          />
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-input
                v-model="editBirthDate"
                label="Birth Year"
                outlined
                hint="e.g. 1980"
              />
            </div>
            <div class="col">
              <q-input
                v-model="editDeathDate"
                label="Death Year"
                outlined
                hint="If deceased"
              />
            </div>
          </div>
          <q-input v-model="editLocation" label="Location" outlined />
          <q-input v-model="editOccupation" label="Occupation" outlined />
          <q-input v-model="editBio" label="Bio" type="textarea" outlined />
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

function confirmDelete(targetId: string, linkType: string, name: string) {
  if (
    window.confirm(
      `Remove ${name} from ${linkType === 'child' ? 'children' : linkType + 's'}?`,
    )
  ) {
    deleteRel(targetId, linkType)
  }
}

function deleteRel(targetId: string, linkType: string) {
  // Map 'child' -> 'parent' since children are stored as parent-type relationships
  const relType = linkType === 'child' ? 'parent' : linkType

  // For siblings: find shared parent relationships and delete one set
  if (relType === 'sibling') {
    // First try direct sibling relationship
    const direct = rels.value.filter(
      (r) =>
        (r.fromId === targetId && r.toId === id.value) ||
        (r.fromId === id.value && r.toId === targetId),
    )
    if (direct.length) {
      direct.forEach((r) => db.delRow('relationships', r.id))
      return
    }
    // Otherwise, find shared parents and delete parent→current relationships
    const myParents = rels.value.filter((r) => r.toId === id.value && r.type === 'parent')
    const theirParents = rels.value.filter(
      (r) => r.toId === targetId && r.type === 'parent',
    )
    const sharedParentIds = myParents
      .filter((r) => theirParents.some((tr) => tr.fromId === r.fromId))
      .map((r) => r.fromId)
    if (sharedParentIds.length) {
      rels.value
        .filter((r) => r.fromId === sharedParentIds[0] && r.toId === targetId)
        .forEach((r) => db.delRow('relationships', r.id))
    }
    return
  }
  const rel = rels.value.find((r) => {
    if (relType === 'parent' && linkType === 'parent') {
      // Adding a parent: r.fromId = parent, r.toId = current
      return r.fromId === targetId && r.toId === id.value && r.type === 'parent'
    }
    if (relType === 'parent' && linkType === 'child') {
      // Current is parent of child: r.fromId = current, r.toId = child
      return r.fromId === id.value && r.toId === targetId && r.type === 'parent'
    }
    // Spouse: current member is the source
    return r.fromId === id.value && r.toId === targetId && r.type === relType
  })
  if (rel) db.delRow('relationships', rel.id)
}

const parents = computed(() => {
  // Direct parents (fromId = parent, toId = me)
  const directIds = toRels.value.map((r) => r.fromId)
  // Parents via siblings: my siblings' parents are my parents too
  const siblingIds = siblings.value.map((s) => s.id)
  const inheritedIds = new Set<string>()
  for (const sid of siblingIds) {
    rels.value
      .filter((r) => r.toId === sid && r.type === 'parent')
      .forEach((r) => inheritedIds.add(r.fromId))
  }
  const allIds = new Set([...directIds, ...inheritedIds])
  return members.value.filter((m) => allIds.has(m.id))
})
const parentLabel = (pid: string) => {
  const p = members.value.find((m) => m.id === pid)
  return p?.gender === 'male' ? 'Father' : p?.gender === 'female' ? 'Mother' : 'Parent'
}

const children = computed(() => {
  // Direct children (I am the parent)
  const ids = new Set(
    fromRels.value.filter((r) => r.type === 'parent').map((r) => r.toId),
  )
  // Children from spouse (step-children)
  for (const sp of spouses.value) {
    rels.value
      .filter((r) => r.fromId === sp.id && r.type === 'parent')
      .forEach((r) => ids.add(r.toId))
  }
  return members.value.filter((m) => ids.has(m.id))
})
const childLabel = (cid: string) =>
  fromRels.value.find((r) => r.type === 'parent' && r.toId === cid)?.subtype || 'Child'

const siblings = computed(() => {
  // Direct sibling relationships
  const directIds = new Set(
    rels.value
      .filter(
        (r) => (r.fromId === id.value || r.toId === id.value) && r.type === 'sibling',
      )
      .map((r) => (r.fromId === id.value ? r.toId : r.fromId)),
  )

  // Siblings via shared parents
  const parentIds = toRels.value.map((r) => r.fromId)
  for (const pid of parentIds) {
    rels.value
      .filter((r) => r.fromId === pid && r.type === 'parent' && r.toId !== id.value)
      .forEach((r) => directIds.add(r.toId))
  }

  // Transitive: each direct sibling's siblings are also my siblings
  for (const sid of [...directIds]) {
    rels.value
      .filter((r) => (r.fromId === sid || r.toId === sid) && r.type === 'sibling')
      .forEach((r) => directIds.add(r.fromId === sid ? r.toId : r.fromId))
  }
  directIds.delete(id.value) // remove self

  return members.value.filter((m) => directIds.has(m.id))
})

const showEdit = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)
const showLink = ref(false)
const linkType = ref('spouse')
const editName = ref('')
const editPhoto = ref('')
const editGender = ref('male')
const editBirthDate = ref('')
const editDeathDate = ref('')
const editLocation = ref('')
const editOccupation = ref('')
const editBio = ref('')

watch(
  member,
  (m) => {
    if (!m) return
    editName.value = m.name
    editPhoto.value = m.photo || ''
    editGender.value = m.gender || 'male'
    editBirthDate.value = m.birthDate
    editDeathDate.value = m.deathDate
    editLocation.value = m.location
    editOccupation.value = m.occupation
    editBio.value = m.bio
  },
  { immediate: true },
)

function onPhotoSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    editPhoto.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function saveEdit() {
  if (!member.value) return
  db.setRow('members', member.value.id, {
    name: editName.value,
    gender: editGender.value,
    birthDate: editBirthDate.value,
    deathDate: editDeathDate.value,
    birthplace: member.value.birthplace,
    location: editLocation.value,
    occupation: editOccupation.value,
    email: member.value.email,
    photo: editPhoto.value,
    bio: editBio.value,
    isDeceased: member.value.isDeceased,
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

.hero {
  background: linear-gradient(160deg, #1b5e32, #2d8a4e, #3a6b3a);
  padding: 40px 0 20px;
}
.hero-content {
  color: white;
}
.hero-avatar-wrapper {
  flex-shrink: 0;
}
.hero-photo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
.hero-avatar {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
.hero-name {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
}
.hero-sub {
  font-size: 13px;
  margin-top: 2px;
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
