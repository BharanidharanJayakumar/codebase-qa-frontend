/**
 * Per-tab session ID management using sessionStorage.
 * Each browser tab gets independent conversations.
 */
const PREFIX = "cqa-session-";

export function getSessionId(projectId: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem(`${PREFIX}${projectId}`) || undefined;
}

export function setSessionId(projectId: string, sessionId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${projectId}`, sessionId);
}

export function generateSessionId(): string {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
