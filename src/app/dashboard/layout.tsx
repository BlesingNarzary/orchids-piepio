import Image from "next/image";
import { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { requireDbUser } from "@/lib/require-db-user";
import { getActiveSubscriptionForUser } from "@/lib/subscription";
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./DashboardNav";

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
        <DashboardNav planLabel={subscription ? "Pro" : "Free"} hasSubscription={!!subscription} />
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

