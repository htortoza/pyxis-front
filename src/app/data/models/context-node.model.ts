export type NodeType = 'HOLDING' | 'SECTOR' | 'MARCA' | 'LOCAL';

export interface ContextNode {
  id: string;
  label: string;
  type: NodeType;
  parentId: string | null;
}
