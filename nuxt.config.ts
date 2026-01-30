// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //ssr:false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
  },
  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxtjs/device",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxtjs/supabase",
  ],
  nitro: {
    compressPublicAssets: true,
    logLevel: 4,
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
    exposeConfig: false,
    viewer: true,
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  imports: {
    dirs: ["app/stores"],
  },

  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
    ],
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "color-mode",
    storage: "localStorage",
    disableTransition: false,
  },

  image: {
    provider: "ipx",
    quality: 80,
    format: ["webp", "png", "jpeg"],
  },

  googleFonts: {
    families: {
      Inter: true,
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    defaultLocale: "en-US",
    langDir: "./locales",
    strategy: "no_prefix",
    locales: [
      { code: "en-US", iso: "en-US", file: "en-US.json" },
      { code: "es-ES", iso: "es-ES", file: "es-ES.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "nuxt-lang",
      redirectOn: "root",
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/login", "/register", "/confirm"],
    },
  },
});
