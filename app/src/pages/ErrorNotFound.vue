<template>
  <q-layout>
    <q-page-container>
      <div class="flex flex-center column q-pa-lg text-center" style="min-height: 100vh">
        <q-icon name="travel_explore" size="120px" color="primary" />
        <h2 class="text-primary text-weight-bold q-my-md">404</h2>
        <p class="text-h6 text-grey-7 q-mb-lg">
          This branch of the family tree could not be found.
        </p>
        <q-btn
          label="Back to Family"
          color="primary"
          rounded
          icon="home"
          :to="{ name: 'family' }"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//
</script>
