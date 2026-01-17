"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function BuilderPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
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

    const res = await fetch("/api/build-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      setError("Failed to submit build. Please check your subscription and try again.");
      setStatus("idle");
      return;
    }

    setStatus("done");
  };

  if (!isLoaded || (!user && !error && status === "idle")) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking your session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Describe what you want Piepio to build</h1>
        <p className="text-muted-foreground mb-8">
          Bring your idea — Piepio will wire up the frontend, backend, auth, database, and payments for this project.
        </p>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A SaaS dashboard with user login, team workspaces, Stripe billing, and an admin API..."
            rows={5}
            className="w-full"
          />

          <div className="flex items-center gap-4">
            <Button onClick={handleSubmit} disabled={status === "submitting" || !prompt.trim()}>
              {status === "submitting" ? "Submitting..." : "Ask Piepio to build this"}
            </Button>
            {status === "done" && (
              <span className="text-sm text-emerald-500">
                Build submitted. Piepio is now working on your stack.
              </span>
            )}
            {error && (
              <span className="text-sm text-red-500">
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

