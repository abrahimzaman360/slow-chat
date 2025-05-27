import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app/sidebar/app-sidebar.tsx";
import { SiteHeader } from "@/components/app/sidebar/site-header.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
