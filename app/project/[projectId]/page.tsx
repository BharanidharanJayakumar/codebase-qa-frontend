"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { qaApi } from "@/lib/api/qa";
import { buildFileTree } from "@/lib/explorer/file-tree";
import { FileTree } from "@/components/explorer/FileTree";
import { CodeViewer } from "@/components/explorer/CodeViewer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import type { ChatPanelHandle } from "@/components/chat/ChatPanel";
import { SessionSidebar } from "@/components/chat/SessionSidebar";
import { getSessionId, setSessionId, generateSessionId } from "@/lib/chat/session-store";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { FileTreeNode } from "@/types/tree";

type MobileTab = "explorer" | "editor" | "chat";

export default function ProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const projectId = params.projectId as string;
  const projectPath = searchParams.get("path") || "";

  const [files, setFiles] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("explorer");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(() => getSessionId(projectId));
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);
  const chatInputRef = useRef<ChatPanelHandle>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!projectPath) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch loading state
    setLoadingFiles(true);
    qaApi
      .listProjectFiles(projectPath)
      .then((res) => {
        const paths = res.files.map((f) => f.relative_path);
        setFiles(buildFileTree(paths));
      })
      .catch(() => {
        setFiles([]);
      })
      .finally(() => setLoadingFiles(false));
  }, [projectPath]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    setMobileTab("editor");
  };

  const handleAskAboutFile = (filePath: string) => {
    setChatOpen(true);
    setMobileTab("chat");
    chatInputRef.current?.setInput(`Explain the file ${filePath}`);
  };

  const handleNewChat = useCallback(() => {
    const newSid = generateSessionId();
    setSessionId(projectId, newSid);
    setActiveSessionId(newSid);
  }, [projectId]);

  const handleSelectSession = useCallback((sessionId: string) => {
    setSessionId(projectId, sessionId);
    setActiveSessionId(sessionId);
  }, [projectId]);

  const handleSessionCreated = useCallback(() => {
    setSessionRefreshKey((k) => k + 1);
  }, []);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 shrink-0">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Link href="/dashboard" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] shrink-0">
            Dashboard
          </Link>
          <span className="text-[var(--muted-foreground)] shrink-0">/</span>
          <h1 className="font-semibold truncate">{decodeURIComponent(projectId)}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile tab switcher */}
          <div className="flex lg:hidden rounded-lg border border-[var(--border)] overflow-hidden">
            {(["explorer", "editor", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`px-3 py-1 text-xs font-medium transition-colors capitalize ${
                  mobileTab === tab ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Desktop: toggle explorer sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${
              sidebarOpen ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
            title={sidebarOpen ? "Hide explorer" : "Show explorer"}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="14" height="14" rx="2" />
              <path d="M7 2v14" />
            </svg>
            <span>Explorer</span>
          </button>
          {/* Desktop: toggle chat history */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className={`hidden lg:flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${
              historyOpen ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
            title={historyOpen ? "Hide history" : "Show history"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5v3l2 2" />
            </svg>
            <span>History</span>
          </button>
          {/* Desktop: toggle chat panel */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`hidden lg:flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${
              chatOpen ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
            title={chatOpen ? "Hide chat" : "Show chat"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3z" />
            </svg>
            <span>Chat</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop layout: Explorer sidebar | Code editor | Chat panel */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Explorer sidebar */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Explorer
              </span>
            </div>
            {loadingFiles ? (
              <div className="space-y-1 p-2">
                {[70, 55, 80, 60, 75, 50, 85, 65].map((w, i) => (
                  <div
                    key={i}
                    className="h-5 animate-pulse rounded bg-[var(--muted)]"
                    style={{ width: `${w}%`, marginLeft: `${(i % 3) * 16}px` }}
                  />
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="px-3 py-4 text-xs text-[var(--muted-foreground)]">
                No files indexed yet.
              </div>
            ) : (
              <FileTree
                nodes={files}
                onSelect={handleFileSelect}
                selectedFile={selectedFile || undefined}
              />
            )}
          </aside>
        )}

        {/* Code editor — main area */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <ErrorBoundary>
            <CodeViewer filePath={selectedFile} projectPath={projectPath} onAskAboutFile={handleAskAboutFile} />
          </ErrorBoundary>
        </main>

        {/* Session history sidebar */}
        {historyOpen && (
          <aside className="w-56 shrink-0 border-l border-[var(--border)] bg-[var(--background)]">
            <SessionSidebar
              projectId={projectId}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              refreshKey={sessionRefreshKey}
            />
          </aside>
        )}

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-96 shrink-0 flex flex-col border-l border-[var(--border)]">
            <ErrorBoundary>
              <ChatPanel
                ref={chatInputRef}
                projectPath={projectPath}
                projectId={projectId}
                sessionId={activeSessionId}
                onFileClick={handleFileSelect}
                onSessionCreated={handleSessionCreated}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Mobile: Tabbed layout */}
      <div className="flex lg:hidden flex-1 overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${mobileTab !== "explorer" ? "hidden" : ""}`}>
          <div className="flex items-center px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Explorer
            </span>
          </div>
          {loadingFiles ? (
            <div className="space-y-1 p-2">
              {[70, 55, 80, 60, 75, 50, 85, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded bg-[var(--muted)]"
                  style={{ width: `${w}%`, marginLeft: `${(i % 3) * 16}px` }}
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="px-3 py-4 text-xs text-[var(--muted-foreground)]">
              No files indexed yet.
            </div>
          ) : (
            <FileTree
              nodes={files}
              onSelect={handleFileSelect}
              selectedFile={selectedFile || undefined}
            />
          )}
        </div>
        <div className={`flex-1 flex flex-col ${mobileTab !== "editor" ? "hidden" : ""}`}>
          <ErrorBoundary>
            <CodeViewer filePath={selectedFile} projectPath={projectPath} onAskAboutFile={handleAskAboutFile} />
          </ErrorBoundary>
        </div>
        <div className={`flex-1 flex flex-col ${mobileTab !== "chat" ? "hidden" : ""}`}>
          <ErrorBoundary>
            <ChatPanel
              ref={chatInputRef}
              projectPath={projectPath}
              projectId={projectId}
              sessionId={activeSessionId}
              onFileClick={handleFileSelect}
              onSessionCreated={handleSessionCreated}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
