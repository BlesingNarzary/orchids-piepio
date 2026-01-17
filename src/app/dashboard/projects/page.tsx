import { db } from "@/db/client";
import { projects } from "@/db/schema";
import { requireDbUser } from "@/lib/require-db-user";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
}

export default async function ProjectsPage() {
  const user = await requireDbUser();

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, user.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create projects and jump into the builder to generate apps.
          </p>
        </div>
        <Link href="/builder">
          <Button variant="outline" size="sm">
            Open builder
          </Button>
        </Link>
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
              You have no projects yet. Create one on the left or go to the builder.
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
                    <div className="text-[11px] text-muted-foreground">
                      Created{" "}
                      {project.createdAt
                        ? project.createdAt.toLocaleDateString()
                        : ""}
                    </div>
                    {project.description && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/project/${project.id}`}>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
