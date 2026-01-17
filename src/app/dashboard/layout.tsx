import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { requireDbUser } from "@/lib/require-db-user";
import { getActiveSubscriptionForUser } from "@/lib/subscription";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
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

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireDbUser();
  const subscription = await getActiveSubscriptionForUser(user.id);

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center overflow-hidden relative">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/3d6ecce6-cc10-46fc-af6f-e55871f87b8c/image-1768289104761.png?width=8000&height=8000&resize=contain"
                  alt="Piepio Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-[18px] font-semibold tracking-tight text-sidebar-foreground">
                Piepio
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Build</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/new">
                      <AppWindow className="mr-2" />
                      <span>New app</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/projects">
                      <FolderKanban className="mr-2" />
                      <span>Projects</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
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
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/usage">
                      <BarChart2 className="mr-2" />
                      <span>Usage</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/billing">
                      <CreditCard className="mr-2" />
                      <span>Billing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
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
                {subscription ? "Pro" : "Free"}
              </span>
            </div>
            {subscription ? (
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
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Piepio
              </span>
              <span className="text-sm font-semibold">
                Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Plan
              </span>
              <span className="text-xs font-medium">
                {subscription ? "Pro" : "Free"}
              </span>
            </div>
            <UserButton />
          </div>
        </header>
        <div className="flex-1 overflow-auto px-4 py-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

