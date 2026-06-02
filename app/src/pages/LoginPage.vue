<template>
  <q-layout>
    <q-page-container>
      <div class="login-page">
        <div class="login-content text-center">
          <div class="text-h3 text-weight-bold text-primary font-serif q-mb-sm">
            Bayau
          </div>
          <p class="text-body1 text-grey-7 q-mb-xl">
            Bridging generations, honoring ancestors.
          </p>

          <SignIn
            :appearance="appearance"
            :routing="'path'"
            :path="'/login'"
            :sign-up-url="'/login'"
            :after-sign-in-url="'/'"
            :after-sign-up-url="'/'"
          />

          <p class="text-caption text-grey-5 q-mt-lg q-mb-xl">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p class="text-body2 text-grey-6 font-italic q-mb-xl">
            "Heritage is the bridge from our roots to our future."
          </p>
          <div class="text-caption text-grey-5">
            &copy; {{ year }} Bayau. All rights reserved.
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SignIn } from '@clerk/vue'

const year = computed(() => new Date().getFullYear())

const appearance = {
  elements: {
    card: 'shadow-none bg-transparent',
    headerTitle: 'text-grey-8',
    headerSubtitle: 'text-grey-6',
    formButtonPrimary: 'bg-primary text-white',
    footerActionText: 'text-grey-6',
    footerActionLink: 'text-primary',
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fdfaf5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-content {
  width: 100%;
  max-width: 400px;
  padding: 48px 16px;
}
.font-serif {
  font-family: 'Georgia', 'Times New Roman', serif;
}
.font-italic {
  font-style: italic;
}
</style>
