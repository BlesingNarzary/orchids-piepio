import { requireDbUser } from "@/lib/require-db-user";
import { getActiveSubscriptionForUser } from "@/lib/subscription";
import { UpgradeButton } from "../UpgradeButton";

export default async function BillingPage() {
  const user = await requireDbUser();
  const subscription = await getActiveSubscriptionForUser(user.id);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Billing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your Piepio plan.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="border border-border rounded-2xl p-6 space-y-4 bg-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Current plan
                </div>
                <div className="text-lg font-semibold">
                  {subscription ? subscription.plan : "Free"}
                </div>
                {!subscription && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Upgrade to Pro to unlock higher limits and priority generation.
                  </p>
                )}
              </div>
              <div>
                {!subscription && <UpgradeButton />}
              </div>
            </div>
          </div>
          <div className="border border-dashed border-border rounded-2xl p-6 text-xs text-muted-foreground bg-muted/20">
            <div className="font-semibold text-sm mb-2">
              Payment history
            </div>
            <p>
              Stripe payment history and a billing portal link will appear here once billing is fully wired.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
