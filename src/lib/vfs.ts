import { db } from "@/db/client";
import { generatedProjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type GeneratedFileMap = Record<string, string>;

export type GeneratedProjectRecord = {
  id: string;
  userId: string;
  projectId: string | null;
  files: GeneratedFileMap;
  createdAt: Date;
  updatedAt: Date;
};

const memoryStore = new Map<string, GeneratedProjectRecord>();

export async function saveGeneratedProject(options: {
  userId: string;
  projectId?: string | null;
  files: GeneratedFileMap;
}): Promise<GeneratedProjectRecord> {
  const { userId, projectId = null, files } = options;

  try {
    const [row] = await db
      .insert(generatedProjects)
      .values({
        userId,
        projectId,
        files,
      })
      .returning();

    const record: GeneratedProjectRecord = {
      id: row.id,
      userId: row.userId,
      projectId: row.projectId,
      files: row.files as GeneratedFileMap,
      createdAt: row.createdAt!,
      updatedAt: row.updatedAt!,
    };

    memoryStore.set(record.id, record);
    return record;
  } catch {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const now = new Date();

    const record: GeneratedProjectRecord = {
      id,
      userId,
      projectId,
      files,
      createdAt: now,
      updatedAt: now,
    };

    memoryStore.set(record.id, record);
    return record;
  }
}

export async function getGeneratedProject(id: string): Promise<GeneratedProjectRecord | null> {
  try {
    const [row] = await db
      .select()
      .from(generatedProjects)
      .where(eq(generatedProjects.id, id))
      .limit(1);

    if (!row) {
      return memoryStore.get(id) ?? null;
    }

    return {
      id: row.id,
      userId: row.userId,
      projectId: row.projectId,
      files: row.files as GeneratedFileMap,
      createdAt: row.createdAt!,
      updatedAt: row.updatedAt!,
    };
  } catch {
    return memoryStore.get(id) ?? null;
  }
}

export async function getLatestGeneratedProjectForUser(userId: string): Promise<GeneratedProjectRecord | null> {
  try {
    const [row] = await db
      .select()
      .from(generatedProjects)
      .where(eq(generatedProjects.userId, userId))
      .orderBy(desc(generatedProjects.createdAt))
      .limit(1);

    if (!row) {
      const fromMemory = Array.from(memoryStore.values())
        .filter((record) => record.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      return fromMemory ?? null;
    }

    return {
      id: row.id,
      userId: row.userId,
      projectId: row.projectId,
      files: row.files as GeneratedFileMap,
      createdAt: row.createdAt!,
      updatedAt: row.updatedAt!,
    };
  } catch {
    const fromMemory = Array.from(memoryStore.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    return fromMemory ?? null;
  }
}

