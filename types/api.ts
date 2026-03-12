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
  owner_repo?: string;
  slug: string;
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

export interface ProjectFile {
  relative_path: string;
  extension: string;
  size_bytes: number;
}

export interface ListProjectFilesResponse {
  files: ProjectFile[];
  total: number;
}

export interface SessionTurn {
  question: string;
  answer: string;
  relevant_files: string[];
}

export interface LoadSessionResponse {
  turns: SessionTurn[];
  session_id: string;
}

export interface IndexLocalResponse {
  files_indexed: number;
  project_root: string;
  indexed_at: number;
  message: string;
}

export interface ChatSession {
  id: string;
  project_id: string;
  title: string | null;
  created_at: string;
  last_message_at: string;
}

export interface ListSessionsResponse {
  sessions: ChatSession[];
}

export interface SupabaseProject {
  id: string;
  slug: string;
  project_root: string;
  github_url: string | null;
  total_files: number;
  indexed_at: string;
  last_accessed_at: string;
}

export interface ProjectSummary {
  languages?: Record<string, number>;
  total_lines?: number;
  directory_tree?: Record<string, { files: number; subdirs: Record<string, number> }>;
  total_symbols?: Record<string, number>;
  readme_content?: string;
  project_description?: string;
  dependency_files?: string[];
  framework_hints?: string[];
}

export interface ProjectSummaryResponse {
  status: string;
  summary: ProjectSummary;
}

export interface SymbolCategoryItem {
  file: string;
  symbol: string;
  detail: string;
}

export interface ProjectCategoriesResponse {
  status: string;
  filter: string | null;
  categories: Record<string, SymbolCategoryItem[]>;
  total: number;
}

export interface ImportItem {
  source: string;
  imported: string;
  target: string | null;
  internal: boolean;
}

export interface ProjectImportsResponse {
  status: string;
  imports: ImportItem[];
  internal_count: number;
  external_count: number;
  total: number;
}

export interface SearchCodeMatch {
  file: string;
  line: number;
  text: string;
}

export interface SearchCodeResponse {
  matches: SearchCodeMatch[];
  total: number;
  truncated?: boolean;
}
