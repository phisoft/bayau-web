<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="text-weight-bold" style="letter-spacing: 2px">
          B A Y A U
        </q-toolbar-title>

        <q-btn flat round v-if="user" @click="leftDrawerOpen = true">
          <q-avatar size="32px">
            <img :src="user.imageUrl" />
          </q-avatar>
        </q-btn>
        <q-btn v-else flat label="Sign In" :to="{ name: 'login' }" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="240">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary"
            >B A Y A U</q-item-label
          >
          <q-item
            clickable
            v-ripple
            :to="{ name: 'family' }"
            exact
            :active="route.name === 'family' || route.name === 'member'"
            active-class="text-primary"
          >
            <q-item-section avatar><q-icon name="group" /></q-item-section>
            <q-item-section>Family</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            :to="{ name: 'archive' }"
            exact
            :active="route.name === 'archive'"
            active-class="text-primary"
          >
            <q-item-section avatar><q-icon name="photo_album" /></q-item-section>
            <q-item-section>Events</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            :to="{ name: 'timeline' }"
            exact
            :active="route.name === 'timeline'"
            active-class="text-primary"
          >
            <q-item-section avatar><q-icon name="timeline" /></q-item-section>
            <q-item-section>Timeline</q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple @click="emitAdd" class="text-primary">
            <q-item-section avatar><q-icon name="person_add" /></q-item-section>
            <q-item-section>Add Person</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="q-pa-md">
        <q-separator />
        <q-item
          clickable
          v-ripple
          @click="signOut(() => router.push({ name: 'login' }))"
          class="q-mt-sm"
        >
          <q-item-section avatar><q-icon name="logout" color="grey-6" /></q-item-section>
          <q-item-section class="text-grey-6">Sign Out</q-item-section>
        </q-item>
        <div class="text-caption text-grey-5 q-mt-sm">&copy; {{ year }} Bayau</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom tabs -->
    <q-footer v-if="showTabs" class="bg-white text-grey-7" bordered>
      <div class="row justify-around q-py-xs">
        <q-btn
          flat
          no-caps
          stack
          dense
          color="grey-7"
          icon="group"
          label="Family"
          :class="{ 'text-primary': route.name === 'family' || route.name === 'member' }"
          :to="{ name: 'family' }"
        />
        <q-btn
          flat
          no-caps
          stack
          dense
          color="grey-7"
          icon="photo_album"
          label="Events"
          :class="{ 'text-primary': route.name === 'archive' }"
          :to="{ name: 'archive' }"
        />
        <q-btn
          flat
          no-caps
          stack
          dense
          color="primary"
          icon="person_add"
          label="Add"
          @click="emitAdd"
        />
        <q-btn
          flat
          no-caps
          stack
          dense
          color="grey-7"
          icon="timeline"
          label="Timeline"
          :class="{ 'text-primary': route.name === 'timeline' }"
          :to="{ name: 'timeline' }"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClerk, useUser, useSession } from '@clerk/vue'
import { switchTree } from 'src/boot/tinybase'
import { uid } from 'src/stores/ulid'

const route = useRoute()
const router = useRouter()
const { signOut } = useClerk()
const { user } = useUser()
const { session } = useSession()

// Redirect to login if session expires
watch(
  () => session.value,
  (s) => {
    if (!s && route.name !== 'login') {
      router.push({ name: 'login' })
    }
  },
)

// Auto-join or create tree when user signs in
watch(
  () => user.value?.id,
  async (userId) => {
    if (!userId) return
    const key = `bayau_active_tree_${userId}`
    let treeId = localStorage.getItem(key)
    if (!treeId) {
      treeId = uid('tree')
      localStorage.setItem(key, treeId)
    }
    await switchTree(treeId)
  },
  { immediate: true },
)

const leftDrawerOpen = ref(false)
const year = computed(() => new Date().getFullYear())

const showTabs = computed(() => {
  const names = ['login']
  return !names.includes(route.name as string) && !!user.value
})

function emitAdd() {
  router.push('/')
  setTimeout(() => window.dispatchEvent(new Event('bayau:open-add')), 200)
}
</script>
