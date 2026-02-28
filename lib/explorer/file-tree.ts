import type { FileTreeNode } from "@/types/tree";

/**
 * Convert a flat list of file paths into a nested tree structure.
 * ["src/main.py", "src/utils.py", "README.md"] →
 * [{ id: "src", name: "src", children: [{id: "src/main.py", ...}, ...] }, ...]
 */
export function buildFileTree(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode = { id: "__root__", name: "", children: [] };

  for (const path of paths) {
    const parts = path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const fullPath = parts.slice(0, i + 1).join("/");
      const isFile = i === parts.length - 1;

      let child = current.children?.find((c) => c.name === part);
      if (!child) {
        child = {
          id: fullPath,
          name: part,
          ...(isFile
            ? { extension: part.split(".").pop() }
            : { children: [] }),
        };
        current.children!.push(child);
      }
      current = child;
    }
  }

  // Sort: folders first, then alphabetical
  const sortTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes
      .map((n) => ({
        ...n,
        children: n.children ? sortTree(n.children) : undefined,
      }))
      .sort((a, b) => {
        if (a.children && !b.children) return -1;
        if (!a.children && b.children) return 1;
        return a.name.localeCompare(b.name);
      });
  };

  return sortTree(root.children || []);
}
