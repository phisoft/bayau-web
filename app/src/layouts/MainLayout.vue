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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="240">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary"
            >Family Tree</q-item-label
          >
          <q-item clickable v-ripple :to="{ name: 'family' }" exact>
            <q-item-section avatar><q-icon name="group" /></q-item-section>
            <q-item-section>Family Directory</q-item-section>
          </q-item>
          <q-item clickable v-ripple :to="{ name: 'archive' }">
            <q-item-section avatar><q-icon name="photo_album" /></q-item-section>
            <q-item-section>Archive</q-item-section>
          </q-item>
          <q-item clickable v-ripple :to="{ name: 'timeline' }">
            <q-item-section avatar><q-icon name="timeline" /></q-item-section>
            <q-item-section>Timeline</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom q-pa-md">
        <q-separator />
        <div class="text-caption text-grey q-mt-sm">&copy; {{ year }} Bayau</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Bottom tabs -->
    <q-footer v-if="showTabs" class="bg-white text-grey-7" bordered>
      <q-tabs
        :model-value="activeTab"
        active-color="primary"
        indicator-color="primary"
        class="text-caption"
        dense
      >
        <q-tab name="family" icon="group" label="Family" to="/" />
        <q-tab name="archive" icon="photo_album" label="Archive" to="/archive" />
        <q-tab name="timeline" icon="timeline" label="Timeline" to="/timeline" />
        <q-tab name="search" icon="search" label="Search" to="/" @click="focusSearch" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const leftDrawerOpen = ref(false)
const year = computed(() => new Date().getFullYear())
const activeTab = ref('family')

watch(
  () => route.meta.tab,
  (tab) => {
    if (tab) activeTab.value = tab as string
  },
  { immediate: true },
)

const showTabs = computed(() => {
  const noTabRoutes = ['login', 'settings']
  return !noTabRoutes.includes(route.name as string)
})

function focusSearch() {
  const el = document.querySelector('.family-search input') as HTMLInputElement
  if (el) el.focus()
}
</script>
