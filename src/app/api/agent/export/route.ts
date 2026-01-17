import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { requireDbUser } from "@/lib/require-db-user";
import { getGeneratedProject } from "@/lib/vfs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const user = await requireDbUser();
  const project = await getGeneratedProject(projectId);

  if (!project || project.userId !== user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const zip = new JSZip();

  for (const [path, content] of Object.entries(project.files)) {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    zip.file(normalizedPath, content);
  }

  const archive = await zip.generateAsync({ type: "uint8array" });

  return new NextResponse(archive, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="piepio-project-${project.id}.zip"`,
    },
  });
}

