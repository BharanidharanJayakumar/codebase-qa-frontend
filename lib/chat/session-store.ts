/**
 * Persistent session ID management using localStorage.
 * Sessions survive across tabs and browser restarts so chat history is preserved.
 */
const PREFIX = "cqa-session-";

export function getSessionId(projectId: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(`${PREFIX}${projectId}`) || undefined;
}

export function setSessionId(projectId: string, sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}${projectId}`, sessionId);
}

export function generateSessionId(): string {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
