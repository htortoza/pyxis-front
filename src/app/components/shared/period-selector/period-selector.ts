import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

import type { Period } from '../../../data/models/period.model';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  imports: [Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-selector.html',
  styleUrl: './period-selector.css',
})
export class PeriodSelectorComponent {
  readonly periods = input.required<Period[]>();
  readonly selectedIds = input.required<string[]>();

  readonly selectionChanged = output<string[]>();

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: string): void {
    const current = this.selectedIds();
    const next = this.isSelected(id) ? current.filter((x) => x !== id) : [...current, id];
    this.selectionChanged.emit(next);
  }
}
