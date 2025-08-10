/// <reference types="vite/client" />


declare module 'virtual:pwa-register/react' {
    import type { RegisterSWOptions } from 'vite-plugin-pwa/types'
    export function useRegisterSW(options?: RegisterSWOptions): {
      offlineReady: [boolean, (v: boolean) => void]
      needRefresh: [boolean, (v: boolean) => void]
      updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
  }