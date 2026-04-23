export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        '@vite-pwa/nuxt'
    ],
    shadcn: {
        prefix: '',
        componentDir: './components/ui'
    },
    pwa: {
        manifest: {
            name: 'SplitTagih',
            short_name: 'SplitTagih',
            description: 'Tagih tanpa awkward.',
            theme_color: '#000000',
            background_color: '#000000',
            display: 'standalone',
            icons: [
                { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        },
        workbox: {
            navigateFallback: '/'
        }
    },
    compatibilityDate: '2024-04-03'
})
