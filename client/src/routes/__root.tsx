import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      <TanStackRouterDevtools position='top-right' />
      <TanStackQueryLayout />
      <Toaster />
    </>
  ),
})
