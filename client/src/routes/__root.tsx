import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx'
import { AppSidebar } from '@/components/app/sidebar/app-sidebar.tsx'
import { SiteHeader } from '@/components/app/sidebar/site-header.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools position='top-right' />
      <TanStackQueryLayout />
    </>
  ),
})
