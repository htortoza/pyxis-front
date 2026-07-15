import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SidebarIconKey =
  | 'ventas'
  | 'margenes'
  | 'comparativos'
  | 'erp'
  | 'carga'
  | 'gobernanza'
  | 'tenant'
  | 'backoffice';

@Component({
  selector: 'app-sidebar-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-icon.html',
  styleUrl: './sidebar-icon.css',
})
export class SidebarIconComponent {
  readonly icon = input.required<SidebarIconKey>();
}
