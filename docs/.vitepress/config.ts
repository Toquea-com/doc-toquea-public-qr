import { defineConfig } from 'vitepress';
import { useSidebar } from 'vitepress-openapi'
import spec from '../public/openapi.json' with { type: 'json' }

const sidebar = useSidebar({
  spec,
  // Optionally, you can specify a link prefix for all generated sidebar items.
  linkPrefix: '/operations/',
})

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'es-ES',
  title: 'Toquea QR API',
  description: 'La API de QR Payments está diseñada para simplificar la gestión de cobros mediante códigos QR.',

  head: [['link', { rel: 'icon', href: 'public/favicon.svg' }]],

  themeConfig: {
    nav: [{ text: 'API Reference', link: '/introduction' }],

    sidebar: [
      {
        text: 'Introducción',
        link: '/introduction',
      },
      {
        text: 'Operaciones',
        items: [
          ...sidebar.generateSidebarGroups(),
        ],
      },
      {
        text: "Webhooks",
        items: [
          {
            text: "Notificación de pagos",
            link: "/webhooks/payment-notification",
          }
        ]
      }
    ],
  },

  base: '/doc-toquea-public-qr/',
});
