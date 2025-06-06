import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/shared/sidebar/app-sidebar";
import { SiteHeader } from "@/components/app/shared/side-header";
export const metadata: Metadata = {
  title: "Home | SlowChat",
  description: "Generated by Ibrahim Zaman (abrahimzaman360)",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader path="/" />
        <div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
