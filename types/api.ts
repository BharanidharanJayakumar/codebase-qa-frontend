export interface Project {
  project_id: string;
  slug: string;
  project_root: string;
  indexed_at: number;
  total_files: number;
}

export interface ListProjectsResponse {
  projects: Project[];
  total: number;
}

export interface CloneAndIndexResponse {
  files_indexed: number;
  project_root: string;
  indexed_at: number;
  message: string;
  github_url: string;
  owner_repo: string;
  clone_action: string;
}

export interface DeleteProjectResponse {
  deleted: boolean;
  project_identifier: string;
  message: string;
}

export interface AnswerDeltaEvent {
  type: "delta";
  text: string;
}

export interface AnswerDoneEvent {
  type: "done";
  answer: string;
  relevant_files: string[];
  confidence: string;
  follow_up: string[];
  session_id: string;
  project_id: string;
}

export type SSEEvent = AnswerDeltaEvent | AnswerDoneEvent;

export interface GetFileContentResponse {
  file_path: string;
  project_id: string;
  content: string;
  symbols: string[];
  keywords: string[];
  extension: string;
  size_bytes: number;
  chunks_count: number;
}

export interface FindRelevantFilesResponse {
  files: string[];
  symbol_hits: string[];
  confidence: string;
  reasoning: string;
}
