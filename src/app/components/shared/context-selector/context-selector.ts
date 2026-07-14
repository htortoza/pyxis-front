import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TreeNode } from 'primeng/api';
import type { TreeNodeSelectEvent } from 'primeng/tree';
import { TreeSelect } from 'primeng/treeselect';

function findNodeByKey(nodes: TreeNode[], key: string): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children?.length) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

@Component({
  selector: 'app-context-selector',
  standalone: true,
  imports: [TreeSelect, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-selector.html',
  styleUrl: './context-selector.css',
})
export class ContextSelectorComponent {
  readonly treeNodes = input.required<TreeNode[]>();
  readonly selectedId = input.required<string>();

  readonly nodeSelected = output<string>();

  readonly selectedNode = computed<TreeNode | null>(() =>
    findNodeByKey(this.treeNodes(), this.selectedId()),
  );

  onNodeSelect(event: TreeNodeSelectEvent): void {
    const key = event.node.key;
    if (key) {
      this.nodeSelected.emit(key);
    }
  }
}
