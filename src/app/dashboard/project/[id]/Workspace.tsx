"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type GeneratedFileMap = Record<string, string>;

type WorkspaceProps = {
  projectId: string;
  initialFiles: GeneratedFileMap;
};

type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
};

export function Workspace({ projectId, initialFiles }: WorkspaceProps) {
  const [files, setFiles] = useState<GeneratedFileMap>(initialFiles);
  const [activePath, setActivePath] = useState<string | null>(
    Object.keys(initialFiles)[0] ?? null
  );
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [prompt, setPrompt] = useState("");

  const tree = buildFileTree(files);

  const code = activePath ? files[activePath] ?? "" : "";

  const handleChangeCode = (value?: string) => {
    if (!activePath) return;
    setFiles((prev) => ({
      ...prev,
      [activePath]: value ?? "",
    }));
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    setPrompt("");
  };

  const previewHtml = (() => {
    const direct = Object.entries(files).find(([path]) =>
      path.toLowerCase().endsWith(".html")
    );
    if (direct) return direct[1];
    return null;
  })();

  return (
    <div className="flex h-[calc(100vh-3.5rem-3.5rem)] flex-col border border-border rounded-2xl overflow-hidden bg-card">
      <div className="flex flex-1 min-h-0">
        <aside className="w-60 border-r border-border bg-muted/30">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
            Files
          </div>
          <ScrollArea className="h-full">
            <div className="px-2 pb-3 text-xs">
              {tree.map((node) => (
                <FileNodeItem
                  key={node.path}
                  node={node}
                  level={0}
                  activePath={activePath}
                  setActivePath={setActivePath}
                />
              ))}
            </div>
          </ScrollArea>
        </aside>
        <section className="flex-1 flex flex-col min-w-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "code" | "preview")}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex items-center justify-between px-3 border-b border-border">
              <TabsList className="h-8">
                <TabsTrigger value="code">
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview">
                  Preview
                </TabsTrigger>
              </TabsList>
              <div className="text-[11px] text-muted-foreground">
                Project {projectId.slice(0, 8)}…
              </div>
            </div>
            <TabsContent value="code" className="flex-1 m-0">
              <Editor
                path={activePath ?? "index.tsx"}
                language={inferLanguage(activePath)}
                theme="vs-dark"
                value={code}
                onChange={handleChangeCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                height="100%"
              />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full bg-muted/40 flex items-center justify-center">
                {previewHtml ? (
                  <iframe
                    title="App preview"
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground px-4 text-center">
                    No HTML entry file detected. Generate or add an entry HTML file to preview the app.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        <aside className="w-64 border-l border-border bg-muted/30 flex flex-col">
          <div className="px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground">
            Piepio activity
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2 text-xs text-muted-foreground">
              <p>
                This panel will show how Piepio edits your project, files it touched, and reasoning steps.
              </p>
              <p>
                Ask Piepio to add features, refactor code, or fix issues in the prompt bar below.
              </p>
            </div>
          </ScrollArea>
        </aside>
      </div>
      <div className="border-t border-border p-3 bg-background flex items-center gap-2">
        <Input
          placeholder="Ask Piepio to modify this project..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button size="sm" onClick={handleSendPrompt}>
          Send
        </Button>
      </div>
    </div>
  );
}

type FileNodeItemProps = {
  node: FileNode;
  level: number;
  activePath: string | null;
  setActivePath: (path: string) => void;
};

function FileNodeItem({ node, level, activePath, setActivePath }: FileNodeItemProps) {
  const isActive = !node.isDir && node.path === activePath;

  if (node.isDir) {
    return (
      <div className="mb-1">
        <div
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-muted-foreground"
          style={{ paddingLeft: 8 + level * 10 }}
        >
          <span>▾</span>
          <span>{node.name}</span>
        </div>
        <div className="space-y-0.5">
          {node.children?.map((child) => (
            <FileNodeItem
              key={child.path}
              node={child}
              level={level + 1}
              activePath={activePath}
              setActivePath={setActivePath}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivePath(node.path)}
      className={
        "w-full text-left flex items-center gap-1 rounded px-2 py-1 text-[11px] " +
        (isActive ? "bg-background font-semibold" : "hover:bg-background/60")
      }
      style={{ paddingLeft: 8 + level * 10 }}
    >
      <span>{fileIconFor(node.name)}</span>
      <span className="truncate">{node.name}</span>
    </button>
  );
}

function buildFileTree(files: GeneratedFileMap): FileNode[] {
  const root: Record<string, FileNode> = {};

  for (const path of Object.keys(files)) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) continue;

    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? currentPath + "/" + part : part;
      const isDir = index < parts.length - 1;
      if (!current[currentPath]) {
        current[currentPath] = {
          name: part,
          path: currentPath,
          isDir,
          children: isDir ? [] : undefined,
        };
      }
      if (isDir) {
        if (!current[currentPath].children) current[currentPath].children = [];
        const nextLevel: Record<string, FileNode> = {};
        for (const child of current[currentPath].children!) {
          nextLevel[child.path] = child;
        }
        current = nextLevel;
        current[currentPath] = current[currentPath];
      }
    });
  }

  return Object.values(root).sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });
}

function inferLanguage(path: string | null): string {
  if (!path) return "typescript";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".md")) return "markdown";
  return "plaintext";
}

function fileIconFor(name: string): string {
  if (name.endsWith(".tsx") || name.endsWith(".ts")) return "📘";
  if (name.endsWith(".jsx") || name.endsWith(".js")) return "📗";
  if (name.endsWith(".json")) return "🧾";
  if (name.endsWith(".md")) return "📝";
  if (name.endsWith(".css")) return "🎨";
  if (!name.includes(".")) return "📁";
  return "📄";
}

