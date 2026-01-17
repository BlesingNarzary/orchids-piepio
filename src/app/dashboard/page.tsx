import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { requireDbUser } from "@/lib/require-db-user";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireDbUser();

  const recentProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, user.id))
    .orderBy(desc(projects.createdAt))
    .limit(3);

  return (
    <div className="space-y-8">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user.email.split("@")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Turn ideas into running software. Start a new app or jump into an existing project.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/new">
            <Button size="sm">
              Create new app
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">
            Recent projects
          </h2>
          {recentProjects.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-4 text-sm text-muted-foreground">
              No projects yet. Create your first app to see it here.
            </div>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((project) => (
                <li
                  key={project.id}
                  className="border border-border rounded-xl p-4 flex items-center justify-between gap-4 bg-card"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/builder">
                      <Button variant="outline" size="sm">
                        Open in builder
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold">
            Quick templates
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <TemplateCard
              title="SaaS App"
              description="Multi-tenant SaaS with auth, billing, and admin."
              prompt="A production-ready SaaS app with user onboarding, team workspaces, Stripe billing, and an admin dashboard."
            />
            <TemplateCard
              title="Landing page"
              description="High-converting marketing site."
              prompt="A responsive marketing landing page with hero, features, pricing, and FAQ sections."
            />
            <TemplateCard
              title="Admin dashboard"
              description="Analytics and CRUD dashboard."
              prompt="An admin analytics dashboard with charts, tables, and filters connected to a REST API."
            />
            <TemplateCard
              title="API backend"
              description="JSON API with auth."
              prompt="A JSON API backend with JWT auth, CRUD endpoints, and OpenAPI docs."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

type TemplateCardProps = {
  title: string;
  description: string;
  prompt: string;
};

function TemplateCard({ title, description, prompt }: TemplateCardProps) {
  return (
    <Link
      href={{
        pathname: "/dashboard/new",
        query: { prompt },
      }}
    >
      <div className="border border-border rounded-xl p-4 hover:border-primary/60 hover:bg-muted/40 transition-colors cursor-pointer h-full flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="mt-3 text-[11px] font-medium text-primary">
          Use template
        </span>
      </div>
    </Link>
  );
}
