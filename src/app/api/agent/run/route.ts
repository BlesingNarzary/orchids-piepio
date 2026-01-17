import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/lib/require-db-user";
import { saveGeneratedProject, GeneratedFileMap } from "@/lib/vfs";

const SYSTEM_PROMPT = [
  "You are a senior full-stack engineer.",
  "Generate a complete, production-ready Next.js 14 App Router project using Tailwind.",
  "Output ONLY valid JSON.",
  "Keys must be file paths.",
  "Values must be file contents.",
  "No markdown. No explanations.",
].join(" ");

type RunRequestBody = {
  prompt?: string;
};

type RunResponseBody = {
  projectId: string;
  files: GeneratedFileMap;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RunRequestBody;
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const user = await requireDbUser();
    const files = await runAgent(prompt);
    const project = await saveGeneratedProject({
      userId: user.id,
      projectId: null,
      files,
    });

    const responseBody: RunResponseBody = {
      projectId: project.id,
      files: project.files,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Agent execution failed" }, { status: 500 });
  }
}

async function runAgent(userPrompt: string): Promise<GeneratedFileMap> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  const json = (await response.json()) as {
    choices: { message: { content: string | null } }[];
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not contain content");
  }

  const parsed = JSON.parse(content) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("OpenAI response was not an object of file paths");
  }

  const files: GeneratedFileMap = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") {
      files[key] = value;
    }
  }

  return files;
}

