import { apiFetch } from "./client";
import type { CloneAndIndexResponse, DeleteProjectResponse, IndexLocalResponse } from "@/types/api";

export const indexerApi = {
  cloneAndIndex: (githubUrl: string) =>
    apiFetch<CloneAndIndexResponse>("/api/indexer/clone", {
      method: "POST",
      body: JSON.stringify({ github_url: githubUrl }),
    }),

  deleteProject: (projectIdentifier: string) =>
    apiFetch<DeleteProjectResponse>("/api/indexer/project", {
      method: "DELETE",
      body: JSON.stringify({ project_identifier: projectIdentifier }),
    }),

  indexLocal: (projectPath: string) =>
    apiFetch<IndexLocalResponse>("/api/indexer/index", {
      method: "POST",
      body: JSON.stringify({ project_path: projectPath }),
    }),
};
