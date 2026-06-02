import { boot } from 'quasar/wrappers'
import { clerkPlugin } from '@clerk/vue'

const PUBLISHABLE_KEY = 'pk_test_d2lzZS1kb2Jlcm1hbi03NC5jbGVyay5hY2NvdW50cy5kZXYk'

export default boot(({ app }) => {
  app.use(clerkPlugin, {
    publishableKey: PUBLISHABLE_KEY,
    signInUrl: '/login',
    signUpUrl: '/login',
    afterSignInUrl: '/',
    afterSignUpUrl: '/',
  })
})
