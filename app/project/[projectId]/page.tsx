"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { qaApi } from "@/lib/api/qa";
import { buildFileTree } from "@/lib/explorer/file-tree";
import { FileTree } from "@/components/explorer/FileTree";
import { CodeViewer } from "@/components/explorer/CodeViewer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { FileTreeNode } from "@/types/tree";

type ActivePanel = "chat" | "code";

function ResizeHandle() {
  return (
    <PanelResizeHandle className="resize-handle" />
  );
}

export default function ProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const projectPath = searchParams.get("path") || "";

  const [files, setFiles] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>("chat");

  useEffect(() => {
    if (!projectPath) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch loading state
    setLoadingFiles(true);
    qaApi
      .findRelevantFiles("*", projectPath)
      .then((res) => {
        setFiles(buildFileTree(res.files));
      })
      .catch(() => {
        setFiles([]);
      })
      .finally(() => setLoadingFiles(false));
  }, [projectPath]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    setActivePanel("code");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12.5 15l-5-5 5-5" />
            </svg>
          </Link>
          <h1 className="font-semibold truncate">{decodeURIComponent(projectId)}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile panel switcher */}
          <div className="flex lg:hidden rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setActivePanel("chat")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                activePanel === "chat" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActivePanel("code")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                activePanel === "code" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"
              }`}
            >
              Code
            </button>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block rounded p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            title={sidebarOpen ? "Hide file tree" : "Show file tree"}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="14" height="14" rx="2" />
              <path d="M7 2v14" />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop: Resizable three-panel layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {sidebarOpen && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={35}>
                <aside className="h-full overflow-y-auto border-r border-[var(--border)]">
                  <div className="p-2 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Files
                  </div>
                  {loadingFiles ? (
                    <div className="space-y-1 p-2">
                      {[70, 55, 80, 60, 75, 50, 85, 65].map((w, i) => (
                        <div
                          key={i}
                          className="h-6 animate-pulse rounded bg-[var(--muted)]"
                          style={{ width: `${w}%`, marginLeft: `${(i % 3) * 16}px` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <FileTree
                      nodes={files}
                      onSelect={handleFileSelect}
                      selectedFile={selectedFile || undefined}
                    />
                  )}
                </aside>
              </Panel>
              <ResizeHandle />
            </>
          )}

          <Panel defaultSize={sidebarOpen ? 40 : 50} minSize={25}>
            <div className="h-full flex flex-col border-r border-[var(--border)]">
              <ErrorBoundary>
                <ChatPanel
                  projectPath={projectPath}
                  projectId={projectId}
                  onFileClick={handleFileSelect}
                />
              </ErrorBoundary>
            </div>
          </Panel>

          <ResizeHandle />

          <Panel defaultSize={sidebarOpen ? 40 : 50} minSize={25}>
            <ErrorBoundary>
              <CodeViewer filePath={selectedFile} projectPath={projectPath} />
            </ErrorBoundary>
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile: Tabbed layout */}
      <div className="flex lg:hidden flex-1 overflow-hidden">
        <div className={`flex-1 flex flex-col ${activePanel !== "chat" ? "hidden" : ""}`}>
          <ErrorBoundary>
            <ChatPanel
              projectPath={projectPath}
              projectId={projectId}
              onFileClick={handleFileSelect}
            />
          </ErrorBoundary>
        </div>
        <div className={`flex-1 ${activePanel !== "code" ? "hidden" : ""}`}>
          <ErrorBoundary>
            <CodeViewer filePath={selectedFile} projectPath={projectPath} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
