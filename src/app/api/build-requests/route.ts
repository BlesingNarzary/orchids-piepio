import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireDbUser } from "@/lib/require-db-user";
import { requireActiveSubscription } from "@/lib/subscription";
import { db } from "@/db/client";
import { usageEvents } from "@/db/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body as { prompt?: string };

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const user = await requireDbUser();

    try {
      await requireActiveSubscription(user.id);
    } catch {
      return NextResponse.json({ error: "Subscription required" }, { status: 402 });
    }

    const { error } = await supabaseAdmin
      .from("build_requests")
      .insert({
        user_id: user.id,
        prompt,
        status: "queued",
      });

    if (error) {
      return NextResponse.json({ error: "Failed to create build request" }, { status: 500 });
    }

    await db.insert(usageEvents).values({
      userId: user.id,
      projectId: null,
      type: "build_request",
      amount: 1,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
