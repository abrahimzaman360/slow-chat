"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BoxesIcon,
  ChartBarIcon,
  MessagesSquare,
  SquirrelIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/app/shared/sidebar/nav-main";
import { NavUser } from "@/components/app/shared/sidebar/nav-user";

const data = {
  user: {
    name: "Ibrahim Zaman",
    email: "abrahimzaman3@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Messages",
      url: "messages",
      icon: MessagesSquare,
    },
    {
      title: "Stories",
      url: "stories",
      icon: SquirrelIcon,
    },
    {
      title: "Groups",
      url: "groups",
      icon: BoxesIcon,
    },
    {
      title: "Analytics",
      url: "analytics",
      icon: ChartBarIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-end">
              <SidebarTrigger />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
