"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Sample data
type MenuItem = {
  title: string;
  url: string;
  items?: MenuItem[]; // Optional nested items
};

const data: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Customers",
    url: "/customers",
    // items: [
    //   {
    //     title: "List",
    //     url: "/customers/list",
    //   },
    // ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    deleteCookie('auth_token');
    router.push("auth/login");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1>Company Name</h1>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Dynamic Sidebar Items */}
        {data.map((item) =>
          item?.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {item.title}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild isActive={false}>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} className="list-none">
              <SidebarMenuButton asChild>
                <Link href={item.url} className="font-medium">
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarContent>

      {/* Footer area for Logout */}
      <SidebarFooter>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem className="w-full">
              <SidebarMenuButton
                className="w-full text-left"
                onClick={handleLogout}
              >
                Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
