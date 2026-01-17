"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GeneratedFileMap = Record<string, string>;

export default function NewAppPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState(
    () => searchParams.get("prompt") ?? ""
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async () => {
    if (!prompt.trim() || !user) return;
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      setError("Failed to generate app. Please try again.");
      setStatus("idle");
      return;
    }

    const data = (await res.json()) as {
      projectId: string;
      files: GeneratedFileMap;
    };

    setStatus("done");
    router.push(`/dashboard/project/${encodeURIComponent(data.projectId)}`);
  };

  if (!isLoaded || (!user && !error && status === "idle")) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">
          Checking your session...
        </p>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            New app
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Describe what you want Piepio to build. Piepio will wire up the frontend, backend, auth, database, and payments.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: A SaaS dashboard with user login, team workspaces, Stripe billing, and an admin API..."
          rows={4}
          className="w-full"
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleSubmit} disabled={status === "submitting" || !prompt.trim()}>
            {status === "submitting" ? "Generating..." : "Ask Piepio to build this"}
          </Button>
          {error && (
            <span className="text-xs text-red-500">
              {error}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
