import { requireDbUser } from "@/lib/require-db-user";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default async function SettingsPage() {
  const user = await requireDbUser();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Profile and appearance for your Piepio account.
        </p>
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="border border-border rounded-2xl p-6 bg-card space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                User ID
              </span>
              <span className="font-mono text-xs">
                {user.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Email
              </span>
              <span>
                {user.email}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border border-border rounded-2xl p-6 bg-card space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Theme
                  </div>
                  <div className="text-sm">
                    Switch between light and dark mode.
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
            <div className="border border-border rounded-2xl p-6 bg-card space-y-3 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Danger zone
              </div>
              <p className="text-xs text-muted-foreground">
                Deleting your account will remove your profile and generated projects. This is UI-only for now.
              </p>
              <Button variant="outline" size="sm">
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
