export default defineNuxtConfig({
  srcDir: 'app',
  serverDir: './server',

  modules: ['@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  compatibilityDate: '2026-06-19',
})
