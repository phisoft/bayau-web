import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => {
  return {
    boot: ['tinybase'],
    css: ['app.scss'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari16'],
      },
    },
    devServer: { open: true },
    framework: {
      config: {
        brand: {
          primary: '#2d8a4e',
          secondary: '#6f452b',
          accent: '#c8843c',
          dark: '#1b4228',
          positive: '#2d8a4e',
          negative: '#c62828',
          info: '#1565c0',
          warning: '#e65100',
        },
      },
      plugins: [],
    },
    animations: [],
    ssr: { pwa: false },
    pwa: { workboxMode: 'GenerateSW' },
    capacitor: { hideSplashscreen: true },
    electron: { inspectPort: 5858 },
    bex: { extraScripts: [] },
  }
})
