import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, prompt } = body as { userId?: string; prompt?: string };

    if (!userId || !prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Missing userId or prompt" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("build_requests")
      .insert({
        user_id: userId,
        prompt,
        status: "queued",
      });

    if (error) {
      return NextResponse.json({ error: "Failed to create build request" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

