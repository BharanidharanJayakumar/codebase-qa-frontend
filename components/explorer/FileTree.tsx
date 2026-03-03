"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Folder, FileCode, FileText, File, Search, X } from "lucide-react";
import type { FileTreeNode } from "@/types/tree";

const CODE_EXTENSIONS = new Set([
  "js", "jsx", "ts", "tsx", "py", "go", "rs", "java", "cs", "rb",
  "php", "c", "cpp", "swift", "kt", "scala", "sh", "bash", "sql",
  "html", "css", "scss", "vue", "svelte",
]);

function getFileIcon(node: FileTreeNode) {
  if (node.children) return null; // folders handled separately
  if (node.extension && CODE_EXTENSIONS.has(node.extension)) {
    return <FileCode size={14} className="flex-shrink-0 text-[var(--muted-foreground)]" />;
  }
  if (node.extension && ["md", "txt", "rst", "csv"].includes(node.extension)) {
    return <FileText size={14} className="flex-shrink-0 text-[var(--muted-foreground)]" />;
  }
  return <File size={14} className="flex-shrink-0 text-[var(--muted-foreground)]" />;
}

function filterTree(nodes: FileTreeNode[], query: string): FileTreeNode[] {
  if (!query) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes.reduce<FileTreeNode[]>((acc, node) => {
    if (node.children) {
      const filteredChildren = filterTree(node.children, query);
      if (filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren });
      }
    } else if (node.name.toLowerCase().includes(lowerQuery)) {
      acc.push(node);
    }
    return acc;
  }, []);
}

interface FileTreeProps {
  nodes: FileTreeNode[];
  onSelect: (filePath: string) => void;
  selectedFile?: string;
}

function FileTreeItem({
  node,
  depth,
  onSelect,
  selectedFile,
  expanded,
  onToggle,
}: {
  node: FileTreeNode;
  depth: number;
  onSelect: (path: string) => void;
  selectedFile?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isFolder = !!node.children;
  const isSelected = node.id === selectedFile;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) {
            onToggle();
          } else {
            onSelect(node.id);
          }
        }}
        className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-[var(--muted)] ${
          isSelected ? "bg-[var(--muted)] text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="flex-shrink-0">
          {isFolder ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            getFileIcon(node)
          )}
        </span>
        {isFolder && <Folder size={14} className="flex-shrink-0 text-[var(--muted-foreground)]" />}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && expanded && node.children && (
        <FileTreeChildren
          nodes={node.children}
          depth={depth + 1}
          onSelect={onSelect}
          selectedFile={selectedFile}
          forceExpand={false}
        />
      )}
    </div>
  );
}

function FileTreeChildren({
  nodes,
  depth,
  onSelect,
  selectedFile,
  forceExpand = false,
}: {
  nodes: FileTreeNode[];
  depth: number;
  onSelect: (path: string) => void;
  selectedFile?: string;
  forceExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    if (forceExpand || depth <= 1) {
      return Object.fromEntries(nodes.filter((n) => n.children).map((n) => [n.id, true]));
    }
    return {};
  });

  return (
    <div>
      {nodes.map((node) => (
        <FileTreeItem
          key={node.id}
          node={node}
          depth={depth}
          onSelect={onSelect}
          selectedFile={selectedFile}
          expanded={forceExpand || !!expanded[node.id]}
          onToggle={() =>
            setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }))
          }
        />
      ))}
    </div>
  );
}

export function FileTree({ nodes, onSelect, selectedFile }: FileTreeProps) {
  const [search, setSearch] = useState("");

  const filteredNodes = useMemo(
    () => filterTree(nodes, search),
    [nodes, search],
  );

  if (nodes.length === 0) {
    return (
      <div className="p-4 text-sm text-[var(--muted-foreground)]">
        No files loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="px-2 pb-1">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded border border-[var(--border)] bg-[var(--background)] py-1.5 pl-7 pr-7 text-xs outline-none placeholder:text-[var(--muted-foreground)] focus:ring-1 focus:ring-[var(--primary)]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <div className="overflow-y-auto flex-1 py-1">
        {filteredNodes.length === 0 ? (
          <div className="px-4 py-2 text-xs text-[var(--muted-foreground)]">
            No matching files
          </div>
        ) : (
          <FileTreeChildren
            nodes={filteredNodes}
            depth={0}
            onSelect={onSelect}
            selectedFile={selectedFile}
            forceExpand={!!search}
          />
        )}
      </div>
    </div>
  );
}
