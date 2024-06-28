import { resolve } from 'pathe'
import * as colors from 'tailwindcss/colors'
import wasm from 'vite-plugin-wasm'

import { defaultLocale, locales } from './src/i18n'

// const logger = consola.create({
//   defaults: {
//     tag: 'nuxt/config',
//   },
// })

const srcDir = resolve(__dirname, 'src')
const appDir = resolve(srcDir, 'app')

const assetsDir = resolve(srcDir, 'assets')
// const pluginsDir = resolve(srcDir, 'plugins')
const componentsDir = resolve(srcDir, 'components')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  alias: {
    '~': srcDir,
  },
  srcDir,
  appDir,

  appConfig: {
    ui: {
      primary: 'brand',
      gray: 'cool',
      colors: Object.keys(colors),
      strategy: 'merge',
    },
  },
  vite: { plugins: [wasm()] },
  runtimeConfig: {
    apiUri: 'http://localhost:8080',
    // apiUri: 'http://regioni.local/api',
    public: {
      apiUri: 'http://localhost:8080',

      // apiUri: 'http://regioni.local/api',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      title: 'A Better Nuxt 3 Starter',
      viewport:
        'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=0',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },

  imports: {
    dirs: ['store', 'composables'],
    collectMeta: true,
    // addons: [{
    //   matchImports(identifiers, matchedImports) {
    //     console.log('identifiers', JSON.stringify(identifiers))
    //     console.log('matchedImports', JSON.stringify(matchedImports))
    //   },
    // }],
  },

  components: {
    dirs: [
      {
        global: true,
        enabled: true,

        pathPrefix: true,
        prefix: 'winbox',

        path: resolve(componentsDir, 'winbox'),
      },
      {
        global: true,
        enabled: true,
        pathPrefix: true,
        prefix: 'editor',
        path: resolve(componentsDir, 'editor'),
      },
      {
        enabled: true,
        pathPrefix: true,
        path: componentsDir,
      },
    ],
  },

  tailwindcss: {
    configPath: resolve('./tailwind.config.ts'),
    cssPath: resolve(assetsDir, 'css', 'tailwind.css'),
    exposeConfig: true,
  },

  ui: {
    global: true,

    icons: [
      'ph',
      'twemoji',
    ],

    safelistColors: [
      'primary',
      'red',
      'green',
      'blue',
      'yellow',
      'purple',
      'pink',
      'orange',
      'cyan',
      'teal',
      'indigo',
    ],
  },

  build: {
    transpile: [
      '@antfu/utils',
      'radash',
    ],

  },

  typescript: {
    shim: false,

  },

  nitro: {
    compressPublicAssets: true,

    prerender: {
      autoSubfolderIndex: true,
      crawlLinks: true,
      concurrency: 15,
    },

    experimental: {
      openAPI: true,
      typescriptBundlerResolution: true,
    },

    // debug: true,
    // timing: true,
  },
  // plugins: [wasm()],

  i18n: {
    locales,
    lazy: false,
    defaultLocale,
    strategy: 'no_prefix',
    langDir: 'i18n/locales',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'X-Locale',
      redirectOn: 'root',
    },
  },

  nuxtTypedRouter: {
    strict: true,
    plugin: true,
    pathCheck: true,
    removeNuxtDefs: true,
    ignoreRoutes: ['/404'],
  },

  // logLevel: 'verbose',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxtjs/robots',
    'nuxt-typed-router',
  ],
})
