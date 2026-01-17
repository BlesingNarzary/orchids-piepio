"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AppWindow,
  FolderKanban,
  LayoutTemplate,
  BarChart2,
  CreditCard,
  Settings,
} from "lucide-react";

type DashboardNavProps = {
  planLabel: string;
  hasSubscription: boolean;
};

export function DashboardNav({ planLabel, hasSubscription }: DashboardNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/dashboard/projects") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/projects");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Build</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/new")}>
                  <Link href="/dashboard/new">
                    <AppWindow className="mr-2" />
                    <span>New app</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/projects")}>
                  <Link href="/dashboard/projects">
                    <FolderKanban className="mr-2" />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/templates")}>
                  <Link href="/dashboard/templates">
                    <LayoutTemplate className="mr-2" />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/usage")}>
                  <Link href="/dashboard/usage">
                    <BarChart2 className="mr-2" />
                    <span>Usage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/billing")}>
                  <Link href="/dashboard/billing">
                    <CreditCard className="mr-2" />
                    <span>Billing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 rounded-md border border-sidebar-border px-3 py-2 text-xs">
          <div className="flex flex-col">
            <span className="text-sidebar-foreground/70">Plan</span>
            <span className="font-medium">
              {planLabel}
            </span>
          </div>
          {hasSubscription ? (
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              Active
            </Badge>
          ) : (
            <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px]">
              <Link href="/dashboard/billing">
                Upgrade
              </Link>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </>
  );
}

