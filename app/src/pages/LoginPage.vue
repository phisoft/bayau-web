<template>
  <q-layout>
    <q-page-container>
      <div class="login-page flex flex-center q-pa-lg">
        <q-card class="login-card" flat bordered>
          <q-card-section class="text-center q-pb-none">
            <q-avatar
              size="72px"
              color="primary"
              text-color="white"
              icon="account_tree"
            />
            <h4 class="text-primary text-weight-bold q-mb-xs">Welcome Back</h4>
            <p class="text-grey-7 q-mt-none">
              Sign in to continue building your family tree
            </p>
          </q-card-section>

          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                v-model="email"
                type="email"
                label="Email"
                outlined
                rounded
                autocomplete="email"
              >
                <template #prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>

              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                outlined
                rounded
                autocomplete="current-password"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <div class="row items-center justify-between">
                <q-checkbox v-model="rememberMe" label="Remember me" color="primary" />
                <q-btn flat dense color="primary" label="Forgot password?" />
              </div>

              <q-btn
                label="Sign In"
                color="primary"
                size="lg"
                rounded
                class="full-width"
                @click="$router.push({ name: 'family' })"
              />
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pt-none">
            <span class="text-grey-7">New to Bayau?</span>
            <q-btn flat dense color="primary" label="Create account" />
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(45, 138, 78, 0.9), rgba(27, 94, 50, 0.86)),
    radial-gradient(circle at top left, rgba(200, 132, 60, 0.35), transparent 40%);
}

.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}
</style>
