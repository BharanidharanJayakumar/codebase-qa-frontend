"use client";

import { useState, useEffect, useCallback } from "react";
import { qaApi } from "@/lib/api/qa";
import type { ChatSession } from "@/types/api";

interface SessionSidebarProps {
  projectId: string;
  activeSessionId: string | undefined;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  refreshKey: number;
}

export function SessionSidebar({
  projectId,
  activeSessionId,
  onSelectSession,
  onNewChat,
  refreshKey,
}: SessionSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    try {
      const res = await qaApi.listUserSessions(projectId);
      setSessions(res.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions, refreshKey]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(sessionId);
    try {
      await qaApi.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        onNewChat();
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Chat History
        </span>
        <button
          onClick={onNewChat}
          className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          title="New chat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M3 8h10" />
          </svg>
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-1 p-2">
            {[80, 65, 70, 55].map((w, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded bg-[var(--muted)]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-[var(--muted-foreground)]">
            No chat history yet.
            <br />
            Start a conversation!
          </div>
        ) : (
          <div className="p-1 space-y-0.5">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group w-full flex items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                  activeSessionId === session.id
                    ? "bg-[var(--muted)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs font-medium">
                    {session.title || "Untitled chat"}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                    {formatDate(session.last_message_at || session.created_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  disabled={deletingId === session.id}
                  className="shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-red-500 transition-all disabled:opacity-50"
                  title="Delete session"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 3V2a1 1 0 011-1h4a1 1 0 011 1v1M3 4h10M6 7v5M10 7v5M4 4l.7 9a1 1 0 001 .9h4.6a1 1 0 001-.9L12 4" />
                  </svg>
                </button>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
