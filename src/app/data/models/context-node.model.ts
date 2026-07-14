/** Vertical containment axis only -- Sector/Marca are horizontal tags, not tree levels. */
export type NodeType = 'HOLDING' | 'EMPRESA' | 'TIENDA';

export interface ContextNode {
  id: string;
  label: string;
  type: NodeType;
  parentId: string | null;
  /** Cross-cutting horizontal dimensions -- only ever set on TIENDA (leaf) nodes. */
  marcaId?: string;
  sectorId?: string;
}
