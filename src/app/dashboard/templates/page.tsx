import Link from "next/link";
import { Button } from "@/components/ui/button";

const templates = [
  {
    name: "SaaS App",
    description: "Multi-tenant SaaS with auth, billing, and dashboards.",
    prompt:
      "A production-ready SaaS app with user onboarding, team workspaces, Stripe billing, and an admin dashboard.",
  },
  {
    name: "Blog",
    description: "Content-focused blog with markdown posts.",
    prompt:
      "A modern blog with markdown posts, categories, search, and an RSS feed.",
  },
  {
    name: "Landing Page",
    description: "Marketing page for product launches.",
    prompt:
      "A responsive marketing landing page with hero, features, social proof, and pricing.",
  },
  {
    name: "Admin Dashboard",
    description: "Internal analytics and CRUD UI.",
    prompt:
      "An admin dashboard with charts, tables, filters, and authentication.",
  },
  {
    name: "API Backend",
    description: "JSON API with auth and OpenAPI docs.",
    prompt:
      "A JSON API backend with JWT auth, CRUD resources, rate limiting, and OpenAPI documentation.",
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start faster with opinionated Piepio templates. You can customize everything after generation.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.name}
              href={{
                pathname: "/dashboard/new",
                query: { prompt: template.prompt },
              }}
            >
              <div className="border border-border rounded-xl p-4 h-full flex flex-col justify-between hover:bg-muted/40 hover:border-primary/60 transition-colors cursor-pointer">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">
                    {template.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline">
                    Use template
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
