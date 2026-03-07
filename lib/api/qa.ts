import { apiFetch, apiFetchWithAuth, apiStreamUrl } from "./client";
import type {
  ListProjectsResponse,
  GetFileContentResponse,
  FindRelevantFilesResponse,
  ListProjectFilesResponse,
  LoadSessionResponse,
  SSEEvent,
} from "@/types/api";

export const qaApi = {
  listProjects: () => apiFetch<ListProjectsResponse>("/api/qa/projects"),

  getFileContent: (filePath: string, projectPath?: string) =>
    apiFetch<GetFileContentResponse>("/api/qa/file-content", {
      method: "POST",
      body: JSON.stringify({ file_path: filePath, project_path: projectPath }),
    }),

  findRelevantFiles: (query: string, projectPath?: string) =>
    apiFetch<FindRelevantFilesResponse>("/api/qa/files", {
      method: "POST",
      body: JSON.stringify({ query, project_path: projectPath }),
    }),

  listProjectFiles: (projectPath: string) =>
    apiFetch<ListProjectFilesResponse>("/api/qa/project-files", {
      method: "POST",
      body: JSON.stringify({ project_path: projectPath }),
    }),

  loadSession: (sessionId: string) =>
    apiFetch<LoadSessionResponse>(`/api/qa/sessions/${sessionId}`),

  async *answerQuestion(
    question: string,
    sessionId?: string,
    projectPath?: string,
  ): AsyncGenerator<SSEEvent> {
    const url = apiStreamUrl("/api/qa/answer");
    const res = await apiFetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify({
        question,
        session_id: sessionId || undefined,
        project_path: projectPath || undefined,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6)) as SSEEvent;
          yield data;
        }
      }
    }
  },
};
