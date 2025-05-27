"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BoxesIcon,
  ChartBarIcon,
  MessagesSquare,
  SquirrelIcon,
} from "lucide-react"

import { NavMain } from "@/components/app/sidebar/nav-main"
import { NavUser } from "@/components/app/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-4" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
