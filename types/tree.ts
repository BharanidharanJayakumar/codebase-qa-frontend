export interface FileTreeNode {
  id: string;
  name: string;
  children?: FileTreeNode[];
  extension?: string;
}
