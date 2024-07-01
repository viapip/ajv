import { WebSocketBrowserProxy, transformer } from '@sozdev/share-libs/dist/browser'
import { type CreateTRPCProxyClient, createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import consola from 'consola'

import type { AppRouter } from '@sozdev/backend'

declare module '#app/nuxt' {
  export interface NuxtApp {
    $trpc: CreateTRPCProxyClient<AppRouter>
  }
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  try {
    const nuxtApp = useNuxtApp()
    const jose = useJose()
    const verify = await jose.getJoseVerify()

    if (!verify)
      return

    const wsClient = createWSClient({
      url: 'ws://localhost:8080',
      WebSocket: WebSocketBrowserProxy as any,

      onOpen() {
        consola.info('Connected')
      },
      onClose() {
        consola.info('Disconnected')
      },
    })
    const ws = wsClient.getConnection() as WebSocketBrowserProxy

    ws.jose = verify

    ws.addEventListener('lookup', (e) => {
      consola.info('lookup', e)
    })

    const client = createTRPCProxyClient<AppRouter>({
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
      transformer,
    })

    nuxtApp.provide('trpc', client)
  }
  catch (e) {

  }
})
