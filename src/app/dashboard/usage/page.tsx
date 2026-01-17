import { db } from "@/db/client";
import { subscriptions, usageEvents } from "@/db/schema";
import { requireDbUser } from "@/lib/require-db-user";
import { and, desc, eq, gt } from "drizzle-orm";

export default async function UsagePage() {
  const user = await requireDbUser();

  const events = await db
    .select()
    .from(usageEvents)
    .where(eq(usageEvents.userId, user.id))
    .orderBy(desc(usageEvents.createdAt))
    .limit(50);

  const now = new Date();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, user.id),
        gt(subscriptions.currentPeriodEnd, now),
        eq(subscriptions.status, "active"),
      ),
    )
    .limit(1);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-6xl mx-auto py-6 space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Usage
        </h1>
        <p className="text-sm text-muted-foreground">
          Recent events for your Piepio account.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border border-border rounded-2xl p-4 bg-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Apps generated
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {events.length}
            </div>
          </div>
          <div className="border border-border rounded-2xl p-4 bg-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Plan
            </div>
            <div className="mt-2 text-sm font-semibold">
              {sub ? sub.plan : "Free"}
            </div>
          </div>
          <div className="border border-border rounded-2xl p-4 bg-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Status
            </div>
            <div className="mt-2 text-sm font-semibold">
              {sub ? "Active" : "Free tier"}
            </div>
          </div>
        </div>
        <div className="mt-4 border border-border rounded-2xl overflow-hidden">
          {events.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No usage recorded yet. As you generate and export apps, usage will appear here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2">
                      {event.type}
                    </td>
                    <td className="px-4 py-2">
                      {event.amount}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {event.createdAt?.toLocaleString() ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
