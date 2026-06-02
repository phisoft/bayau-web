import { createStore } from 'tinybase'
import { createLocalPersister } from 'tinybase/persisters/persister-browser'

// ═══════════════════════════════════════════════════════════
// Schema — matches Stitch UI screens:
//   Family Directory / Link Member / Manage Relationships
// ═══════════════════════════════════════════════════════════

const TABLES = {
  members: {
    name: { type: 'string' as const, default: '' },
    gender: { type: 'string' as const, default: 'other' },
    birthDate: { type: 'string' as const, default: '' },
    deathDate: { type: 'string' as const, default: '' },
    birthplace: { type: 'string' as const, default: '' },
    location: { type: 'string' as const, default: '' },
    occupation: { type: 'string' as const, default: '' },
    email: { type: 'string' as const, default: '' },
    photo: { type: 'string' as const, default: '' },
    bio: { type: 'string' as const, default: '' },
    isDeceased: { type: 'boolean' as const, default: false },
    createdAt: { type: 'string' as const, default: '' },
    updatedAt: { type: 'string' as const, default: '' },
  },

  relationships: {
    fromId: { type: 'string' as const },
    toId: { type: 'string' as const },
    type: { type: 'string' as const, default: 'parent' },
    subtype: { type: 'string' as const, default: '' },
    marriageDate: { type: 'string' as const, default: '' },
    marriageEndDate: { type: 'string' as const, default: '' },
    notes: { type: 'string' as const, default: '' },
    createdAt: { type: 'string' as const, default: '' },
  },

  memories: {
    title: { type: 'string' as const, default: '' },
    description: { type: 'string' as const, default: '' },
    type: { type: 'string' as const, default: 'photo' },
    date: { type: 'string' as const, default: '' },
    location: { type: 'string' as const, default: '' },
    mediaUrl: { type: 'string' as const, default: '' },
    memberIds: { type: 'string' as const, default: '' },
    createdAt: { type: 'string' as const, default: '' },
  },

  invitations: {
    email: { type: 'string' as const, default: '' },
    memberId: { type: 'string' as const, default: '' },
    relationshipType: { type: 'string' as const, default: '' },
    status: { type: 'string' as const, default: 'pending' },
    token: { type: 'string' as const, default: '' },
    createdAt: { type: 'string' as const, default: '' },
  },
} as const

const VALUES = {
  selectedMemberId: { type: 'string' as const, default: '' },
  treeName: { type: 'string' as const, default: 'Family Tree' },
  userId: { type: 'string' as const, default: '' },
  isLoggedIn: { type: 'boolean' as const, default: false },
} as const

// ═══════════════════════════════════════════════════════════
// Relationship type constants — mirrors Stitch UI options
// ═══════════════════════════════════════════════════════════
export const RELATION_TYPES = {
  parent: { label: 'Parent', icon: 'arrow_upward', color: 'primary' },
  child: { label: 'Child', icon: 'arrow_downward', color: 'secondary' },
  spouse: { label: 'Spouse', icon: 'favorite', color: 'accent' },
  sibling: { label: 'Sibling', icon: 'people', color: 'info' },
} as const

export const GENDERS = {
  male: { label: 'Male', icon: 'man', color: 'blue-6' },
  female: { label: 'Female', icon: 'woman', color: 'pink-5' },
  other: { label: 'Other', icon: 'person', color: 'grey-6' },
} as const

export const MEMORY_TYPES = {
  photo: { label: 'Photo', icon: 'photo' },
  story: { label: 'Story', icon: 'menu_book' },
  event: { label: 'Event', icon: 'event' },
  document: { label: 'Document', icon: 'description' },
} as const

// ═══════════════════════════════════════════════════════════
// Store factory
// ═══════════════════════════════════════════════════════════
export function createBayauStore() {
  const store = createStore()

  store.setTablesSchema(TABLES)
  store.setValuesSchema(VALUES)

  // Auto-persist to localStorage
  const persister = createLocalPersister(store, 'bayau')
  persister
    .startAutoLoad({}, () => {
      // Only seed demo data if store is empty after loading
      if (Object.keys(store.getTable('members')).length === 0) {
        seedDemoData(store)
      }
    })
    .then(() => persister.startAutoSave())

  // Fallback: seed immediately if no persisted data loads quickly
  setTimeout(() => {
    if (Object.keys(store.getTable('members')).length === 0) {
      seedDemoData(store)
    }
  }, 100)

  return store
}

// ═══════════════════════════════════════════════════════════
// Demo data — matches Stitch Family Directory screen
// ═══════════════════════════════════════════════════════════
function seedDemoData(store: ReturnType<typeof createStore>) {
  const now = new Date().toISOString()

  // ── Members (from Family Directory screen) ──────────
  const members = [
    {
      id: 'm1',
      name: 'Raden Mas Wijaya',
      gender: 'male',
      birthDate: '1950-03-15',
      deathDate: '',
      birthplace: 'Yogyakarta, Indonesia',
      location: 'Surakarta',
      occupation: 'Antique Archivist',
      email: 'rm.wijaya@heritage.com',
      bio: 'Patriarch of the Wijaya lineage. Keeper of family archives and oral histories.',
      isDeceased: false,
    },
    {
      id: 'm2',
      name: 'Siti Aminah',
      gender: 'female',
      birthDate: '1953-07-22',
      deathDate: '2012-11-08',
      birthplace: 'Bandung, Indonesia',
      location: 'Surakarta',
      occupation: 'Teacher',
      email: '',
      bio: 'Beloved matriarch and educator. Instrumental in documenting family recipes.',
      isDeceased: true,
    },
    {
      id: 'm3',
      name: 'Arya Wijaya',
      gender: 'male',
      birthDate: '1978-01-10',
      deathDate: '',
      birthplace: 'Surakarta, Indonesia',
      location: 'Surakarta',
      occupation: 'Software Engineer',
      email: 'arya.wijaya@heritage.com',
      bio: 'First-born son. Leads the family digitization project.',
      isDeceased: false,
    },
    {
      id: 'm4',
      name: 'Maya Kartika',
      gender: 'female',
      birthDate: '1982-06-05',
      deathDate: '',
      birthplace: 'Surakarta, Indonesia',
      location: 'Bandung',
      occupation: 'Graphic Designer',
      email: 'maya.k@heritage.com',
      bio: 'Second-born. Designed the family crest and archive layout.',
      isDeceased: false,
    },
    {
      id: 'm5',
      name: 'Budi Wijaya',
      gender: 'male',
      birthDate: '1980-09-18',
      deathDate: '',
      birthplace: 'Surakarta, Indonesia',
      location: 'Europe',
      occupation: 'Researcher',
      email: 'b.wijaya@edu.com',
      bio: 'Extended family member living abroad. Anthropologist by training.',
      isDeceased: false,
    },
    {
      id: 'm6',
      name: 'Dewi Sartika',
      gender: 'female',
      birthDate: '1975-12-03',
      deathDate: '',
      birthplace: 'Yogyakarta, Indonesia',
      location: 'Yogyakarta',
      occupation: 'Midwife',
      email: '',
      bio: 'Distant relative. Custodian of traditional birth records in the region.',
      isDeceased: false,
    },
    {
      id: 'm7',
      name: 'Hendra Putra',
      gender: 'male',
      birthDate: '1985-04-28',
      deathDate: '',
      birthplace: 'Jakarta, Indonesia',
      location: 'Jakarta',
      occupation: 'Architect',
      email: 'hendra.p@architect.com',
      bio: 'Fifth-generation member. Working on the family ancestral home restoration.',
      isDeceased: false,
    },
  ]

  for (const m of members) {
    store.setRow('members', m.id, {
      name: m.name,
      gender: m.gender,
      birthDate: m.birthDate,
      deathDate: m.deathDate,
      birthplace: m.birthplace,
      location: m.location,
      occupation: m.occupation,
      email: m.email,
      photo: '',
      bio: m.bio,
      isDeceased: m.isDeceased,
      createdAt: now,
      updatedAt: now,
    })
  }

  // ── Relationships (from Manage Relationships screen) ─
  // Raden Mas Wijaya → Siti Aminah (spouse)
  store.setRow('relationships', 'r1', {
    fromId: 'm1',
    toId: 'm2',
    type: 'spouse',
    subtype: '',
    marriageDate: '1975-06-20',
    marriageEndDate: '2012-11-08',
    notes: 'Married at the Grand Mosque, Yogyakarta',
    createdAt: now,
  })

  // Siti Aminah → Raden Mas Wijaya (spouse - bidirectional)
  store.setRow('relationships', 'r2', {
    fromId: 'm2',
    toId: 'm1',
    type: 'spouse',
    subtype: '',
    marriageDate: '1975-06-20',
    marriageEndDate: '2012-11-08',
    notes: '',
    createdAt: now,
  })

  // Raden Mas Wijaya → Arya Wijaya (parent of)
  store.setRow('relationships', 'r3', {
    fromId: 'm1',
    toId: 'm3',
    type: 'parent',
    subtype: 'firstBorn',
    marriageDate: '',
    marriageEndDate: '',
    notes: 'First born',
    createdAt: now,
  })

  // Siti Aminah → Arya Wijaya (parent of)
  store.setRow('relationships', 'r4', {
    fromId: 'm2',
    toId: 'm3',
    type: 'parent',
    subtype: 'firstBorn',
    marriageDate: '',
    marriageEndDate: '',
    notes: '',
    createdAt: now,
  })

  // Raden Mas Wijaya → Maya Kartika (parent of)
  store.setRow('relationships', 'r5', {
    fromId: 'm1',
    toId: 'm4',
    type: 'parent',
    subtype: 'secondBorn',
    marriageDate: '',
    marriageEndDate: '',
    notes: 'Second born',
    createdAt: now,
  })

  // Siti Aminah → Maya Kartika (parent of)
  store.setRow('relationships', 'r6', {
    fromId: 'm2',
    toId: 'm4',
    type: 'parent',
    subtype: 'secondBorn',
    marriageDate: '',
    marriageEndDate: '',
    notes: '',
    createdAt: now,
  })

  // Arya Wijaya ↔ Maya Kartika (siblings)
  store.setRow('relationships', 'r7', {
    fromId: 'm3',
    toId: 'm4',
    type: 'sibling',
    subtype: '',
    marriageDate: '',
    marriageEndDate: '',
    notes: '',
    createdAt: now,
  })

  // ── Memories ───────────────────────────────────────
  const memories = [
    {
      id: 'mm1',
      title: 'Wedding of Raden Mas & Siti',
      description:
        'The union that started the modern Wijaya lineage. Ceremony at the Grand Mosque followed by a reception at the family estate.',
      type: 'photo',
      date: '1975-06-20',
      location: 'Yogyakarta',
      mediaUrl: '',
      memberIds: 'm1,m2',
      createdAt: now,
    },
    {
      id: 'mm2',
      title: 'Family Reunion 2024',
      description:
        'Annual gathering held in Surakarta. All generations present for the first time in a decade.',
      type: 'event',
      date: '2024-08-15',
      location: 'Surakarta',
      mediaUrl: '',
      memberIds: 'm1,m3,m4,m7',
      createdAt: now,
    },
    {
      id: 'mm3',
      title: "Arya's Graduation",
      description:
        'Arya Wijaya receives his degree in Computer Science from Universitas Gadjah Mada.',
      type: 'photo',
      date: '2000-05-20',
      location: 'Yogyakarta',
      mediaUrl: '',
      memberIds: 'm3,m1',
      createdAt: now,
    },
    {
      id: 'mm4',
      title: 'The Wijaya Crest',
      description:
        'Maya Kartika completes the family crest design. Adopted unanimously at the family council.',
      type: 'document',
      date: '2023-01-12',
      location: 'Bandung',
      mediaUrl: '',
      memberIds: 'm4,m1,m3',
      createdAt: now,
    },
  ]

  for (const mm of memories) {
    store.setRow('memories', mm.id, {
      title: mm.title,
      description: mm.description,
      type: mm.type,
      date: mm.date,
      location: mm.location,
      mediaUrl: mm.mediaUrl,
      memberIds: mm.memberIds,
      createdAt: mm.createdAt,
    })
  }

  // ── Invitations ────────────────────────────────────
  store.setRow('invitations', 'i1', {
    email: 'julian.rossi@heritage.com',
    memberId: 'm6',
    relationshipType: 'child',
    status: 'pending',
    token: 'inv-001-abc',
    createdAt: now,
  })
  store.setRow('invitations', 'i2', {
    email: 'elena.v@archive.org',
    memberId: 'm5',
    relationshipType: 'spouse',
    status: 'pending',
    token: 'inv-002-def',
    createdAt: now,
  })

  // ── Values ─────────────────────────────────────────
  store.setValue('selectedMemberId', 'm3')
  store.setValue('treeName', 'Wijaya Family')
  store.setValue('userId', 'demo-user')
  store.setValue('isLoggedIn', true)
}

// ═══════════════════════════════════════════════════════════
// Types & helpers
// ═══════════════════════════════════════════════════════════
export type BayauStore = ReturnType<typeof createBayauStore>

export interface Member {
  id: string
  name: string
  gender: string
  birthDate: string
  deathDate: string
  birthplace: string
  location: string
  occupation: string
  email: string
  photo: string
  bio: string
  isDeceased: boolean
  createdAt: string
  updatedAt: string
}

export interface Relationship {
  id: string
  fromId: string
  toId: string
  type: string
  subtype: string
  marriageDate: string
  marriageEndDate: string
  notes: string
  createdAt: string
}

export interface Memory {
  id: string
  title: string
  description: string
  type: string
  date: string
  location: string
  mediaUrl: string
  memberIds: string
  createdAt: string
}

export interface Invitation {
  id: string
  email: string
  memberId: string
  relationshipType: string
  status: string
  token: string
  createdAt: string
}
