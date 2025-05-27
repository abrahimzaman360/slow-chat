// _auth.tsx

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return ( 
    <Outlet />
  );
}