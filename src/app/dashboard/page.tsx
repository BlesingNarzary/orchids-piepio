import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { requireDbUser } from "@/lib/require-db-user";
import { getActiveSubscriptionForUser } from "@/lib/subscription";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UpgradeButton } from "./UpgradeButton";

async function createProject(formData: FormData) {
  "use server";

  const user = await requireDbUser();
  const name = String(formData.get("name") ?? "").trim();
  const descriptionValue = formData.get("description");
  const description =
    typeof descriptionValue === "string" ? descriptionValue.trim() : "";

  if (!name) {
    return;
  }

  await db.insert(projects).values({
    ownerId: user.id,
    name,
    description: description || null,
  });

  redirect("/dashboard");
}

export default async function DashboardPage() {
  const user = await requireDbUser();

  const subscription = await getActiveSubscriptionForUser(user.id);

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, user.id));

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Piepio.com projects and jump into the builder.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Plan
              </div>
              <div className="text-sm font-medium">
                {subscription ? "Pro" : "Free"}
              </div>
            </div>
            {!subscription && <UpgradeButton />}
            <Link href="/builder">
              <Button variant="outline">
                Open builder
              </Button>
            </Link>
          </div>
        </div>

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <form
            action={createProject}
            className="bg-card border border-border rounded-2xl p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">
              New project
            </h2>
            <p className="text-sm text-muted-foreground">
              Give your project a name and an optional description.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Name
              </label>
              <Input
                name="name"
                placeholder="Example: Marketing analytics dashboard"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>
              <Textarea
                name="description"
                rows={4}
                placeholder="Short description of what this project should do."
              />
            </div>

            <Button type="submit" className="w-full">
              Create project
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Your projects
              </h2>
              <span className="text-xs text-muted-foreground">
                {rows.length} total
              </span>
            </div>

            {rows.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-6 text-sm text-muted-foreground">
                You have no projects yet. Create one on the left to get
                started, or go straight to the builder.
              </div>
            ) : (
              <ul className="space-y-3">
                {rows.map((project) => (
                  <li
                    key={project.id}
                    className="border border-border rounded-xl p-4 flex items-center justify-between gap-4 bg-card"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {project.name}
                      </div>
                      {project.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="/builder">
                        <Button variant="outline" size="sm">
                          Build
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
