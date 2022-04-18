export default {
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Менеджер паролей',
    title: 'kuznechik',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'lock.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios'
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  serverMiddleware: [
    // Will register file from project server-middleware directory to handle /server-middleware/* requires
    { path: '/api', handler: '~/api/index.js' }
  ],
  server: {
    port: 3000,
    host: '127.0.0.1'
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt', '@nuxtjs/axios', '@nuxtjs/toast'
  ],
  toast: {
    position: 'bottom-center',
    duration: 3000
  },

  bootstrapVue: {
    icons: true
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true
    }
  },
  router: {
    middleware: [
      'auth'
    ]
  }
}
