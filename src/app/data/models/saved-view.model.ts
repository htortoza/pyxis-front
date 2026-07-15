export type SavedViewScope = 'personal' | 'equipo';

export interface SavedView {
  id: string;
  label: string;
  ownerId: string;
  ownerName: string;
  tenantId: string;
  scope: SavedViewScope;
  periodIds: string[];
  compareToPrevious: boolean;
  /** FilterTreeNode ids (Sector/Marca/Tienda filter tree, from sector-marca-tienda-tree.utils). */
  checkedNodeIds: string[];
  createdAt: string; // ISO timestamp
  lastUsedAt: string; // ISO timestamp, bumped every time the view is applied -- drives "most recently used" sort
}

export interface ApplyViewResult {
  view: SavedView;
  /** Node ids from view.checkedNodeIds that were dropped because they're outside the current allowed scope. Empty = applied fully clean. */
  droppedNodeIds: string[];
}
