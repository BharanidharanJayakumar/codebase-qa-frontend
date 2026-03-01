"use client";

import { useState } from "react";
import type { FileTreeNode } from "@/types/tree";

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
        <span className="w-4 text-center text-xs flex-shrink-0">
          {isFolder ? (expanded ? "▾" : "▸") : ""}
        </span>
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && expanded && node.children && (
        <FileTreeChildren
          nodes={node.children}
          depth={depth + 1}
          onSelect={onSelect}
          selectedFile={selectedFile}
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
}: {
  nodes: FileTreeNode[];
  depth: number;
  onSelect: (path: string) => void;
  selectedFile?: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand first level
    if (depth <= 1) {
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
          expanded={!!expanded[node.id]}
          onToggle={() =>
            setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }))
          }
        />
      ))}
    </div>
  );
}

export function FileTree({ nodes, onSelect, selectedFile }: FileTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="p-4 text-sm text-[var(--muted-foreground)]">
        No files loaded
      </div>
    );
  }

  return (
    <div className="overflow-y-auto py-1">
      <FileTreeChildren nodes={nodes} depth={0} onSelect={onSelect} selectedFile={selectedFile} />
    </div>
  );
}
