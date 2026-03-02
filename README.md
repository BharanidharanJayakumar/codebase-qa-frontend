# Codebase QA Frontend

Next.js 15 web interface for the Codebase QA system. Paste a GitHub URL, ask questions about any codebase, and browse source code — all in one place.

## Features

- **Three-panel layout** — File tree, chat, and code viewer side by side
- **SSE streaming** — Real-time streamed answers from the LLM
- **Syntax highlighting** — Server-side Shiki highlighting for 27+ languages
- **Dark mode** — System-aware with manual toggle (next-themes)
- **Follow-up suggestions** — AI-generated follow-up questions after each answer
- **File references** — Click relevant files in chat to view their source code
- **Responsive** — Mobile-friendly tabbed layout, desktop three-panel

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4** with CSS variables
- **Shiki** for syntax highlighting (server-side API route)
- **SWR** for data fetching and caching
- **next-themes** for dark mode

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — paste a GitHub URL to index |
| `/dashboard` | View and manage indexed projects |
| `/project/[id]` | Chat + file tree + code viewer |

## Quick Start

```bash
npm install
cp .env.local.example .env.local  # Set NEXT_PUBLIC_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

## Docker

```bash
docker compose up
```

Starts the full stack: engine (8080), backend (8000), frontend (3000).

## Project Structure

```
app/
  page.tsx                    # Landing page
  dashboard/page.tsx          # Project dashboard
  project/[projectId]/page.tsx # Three-panel workspace
  api/highlight/route.ts      # Shiki highlighting endpoint
  error.tsx                   # Error boundary page
  not-found.tsx               # 404 page
components/
  landing/UrlInputForm.tsx    # GitHub URL input
  dashboard/ProjectGrid.tsx   # Project cards
  chat/ChatPanel.tsx          # Chat with SSE streaming
  explorer/FileTree.tsx       # Expandable file tree
  explorer/CodeViewer.tsx     # Syntax-highlighted code
  Navbar.tsx                  # Global navigation
  ThemeToggle.tsx             # Dark/light mode switch
  ErrorBoundary.tsx           # React error boundary
lib/
  api/                        # API client + fetchers
  hooks/                      # SWR hooks
  chat/                       # Session storage
  explorer/                   # File tree builder, language detection
types/
  api.ts                      # TypeScript API types
  tree.ts                     # File tree node type
```

## Related Repos

- [codebase-qa-agent](https://github.com/BharanidharanJayakumar/codebase-qa-agent) — RAG engine (Agentfield + Groq)
- [codebase-qa-backend](https://github.com/BharanidharanJayakumar/codebase-qa-backend) — FastAPI proxy
