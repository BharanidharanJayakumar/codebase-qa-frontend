"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
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

type ViewMode = "code" | "chat" | "search";
type MobileTab = "explorer" | "editor" | "chat";

export default function ProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const projectId = params.projectId as string;
  const projectPath = searchParams.get("path") || "";
  const initialMode = (searchParams.get("mode") as ViewMode) || "code";
  const initialQuestion = searchParams.get("q") || "";

  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [files, setFiles] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("explorer");
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(() => getSessionId(projectId));
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ file: string; line: number; text: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const chatInputRef = useRef<ChatPanelHandle>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Pre-fill chat with question from URL
  useEffect(() => {
    if (initialQuestion && chatInputRef.current) {
      chatInputRef.current.setInput(initialQuestion);
      setViewMode("chat");
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (!projectPath) return;
    setLoadingFiles(true);
    qaApi
      .listProjectFiles(projectPath)
      .then((res) => {
        const paths = res.files.map((f) => f.relative_path);
        setFiles(buildFileTree(paths));
      })
      .catch(() => setFiles([]))
      .finally(() => setLoadingFiles(false));
  }, [projectPath]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    setViewMode("code");
    setMobileTab("editor");
  };

  const handleAskAboutFile = (filePath: string) => {
    setViewMode("chat");
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !projectPath) return;
    setSearching(true);
    try {
      const res = await qaApi.searchCode(searchQuery, projectPath);
      setSearchResults(res.matches);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

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
          <Link href={`/project/${projectId}/overview?path=${encodeURIComponent(projectPath)}`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] shrink-0">
            Overview
          </Link>
          <span className="text-[var(--muted-foreground)] shrink-0">/</span>
          <h1 className="font-semibold truncate">{decodeURIComponent(projectId)}</h1>
        </div>
        <div className="flex items-center gap-1">
          {/* View mode tabs */}
          <div className="hidden lg:flex rounded-lg border border-[var(--border)] overflow-hidden mr-2">
            {(["code", "chat", "search"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-medium transition-colors capitalize ${
                  viewMode === mode ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {mode === "code" ? "Code" : mode === "chat" ? "Chat" : "Search"}
              </button>
            ))}
          </div>

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

          {/* Toggle buttons */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${
              sidebarOpen ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="14" height="14" rx="2" />
              <path d="M7 2v14" />
            </svg>
          </button>
          {viewMode === "chat" && (
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className={`hidden lg:flex items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors ${
                historyOpen ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3l2 2" />
              </svg>
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* File tree — always visible */}
        {sidebarOpen && (
          <aside className="w-60 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center justify-between px-3 py-2">
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
              <div className="px-3 py-4 text-xs text-[var(--muted-foreground)]">No files indexed.</div>
            ) : (
              <FileTree nodes={files} onSelect={handleFileSelect} selectedFile={selectedFile || undefined} />
            )}
          </aside>
        )}

        {/* Main content area — switches by mode */}
        <AnimatePresence mode="wait">
          {viewMode === "code" && (
            <motion.main
              key="code"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <ErrorBoundary>
                <CodeViewer filePath={selectedFile} projectPath={projectPath} onAskAboutFile={handleAskAboutFile} />
              </ErrorBoundary>
            </motion.main>
          )}

          {viewMode === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-1 min-w-0 overflow-hidden"
            >
              {/* Session history sidebar */}
              {historyOpen && (
                <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--background)]">
                  <SessionSidebar
                    projectId={projectId}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={handleNewChat}
                    refreshKey={sessionRefreshKey}
                  />
                </aside>
              )}

              {/* Chat — centered, max width */}
              <div className="flex-1 flex flex-col">
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
            </motion.div>
          )}

          {viewMode === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0 overflow-y-auto p-4"
            >
              <div className="mx-auto max-w-3xl">
                <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search code... (e.g. def authenticate, import express)"
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <button
                    type="submit"
                    disabled={searching || !searchQuery.trim()}
                    className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50"
                  >
                    {searching ? "Searching..." : "Search"}
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="space-y-1">
                    <p className="mb-3 text-sm text-[var(--muted-foreground)]">
                      {searchResults.length} match{searchResults.length !== 1 ? "es" : ""} found
                    </p>
                    {searchResults.map((match, i) => (
                      <button
                        key={`${match.file}-${match.line}-${i}`}
                        onClick={() => handleFileSelect(match.file)}
                        className="w-full rounded-lg border border-[var(--border)] p-3 text-left text-sm transition-colors hover:bg-[var(--muted)]"
                      >
                        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                          <span className="font-medium text-[var(--foreground)]">{match.file}</span>
                          <span>line {match.line}</span>
                        </div>
                        <code className="mt-1 block font-mono text-xs text-[var(--muted-foreground)] truncate">
                          {match.text}
                        </code>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && !searching && searchQuery && (
                  <p className="text-sm text-[var(--muted-foreground)]">No results found.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Tabbed layout */}
      <div className="flex lg:hidden flex-1 overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${mobileTab !== "explorer" ? "hidden" : ""}`}>
          <div className="px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Explorer</span>
          </div>
          {loadingFiles ? (
            <div className="space-y-1 p-2">
              {[70, 55, 80, 60].map((w, i) => (
                <div key={i} className="h-5 animate-pulse rounded bg-[var(--muted)]" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <FileTree nodes={files} onSelect={handleFileSelect} selectedFile={selectedFile || undefined} />
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
