import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { PeriodGranularity } from '../../../data/models/period.model';
import { CalendarPeriodPickerComponent } from '../calendar-period-picker/calendar-period-picker';
import { MonthPeriodPickerComponent } from '../month-period-picker/month-period-picker';

/**
 * Panel presentacional -- sin trigger ni popover propios, embebido en el mini-modal "Período"
 * de FiltersModalComponent. Los "Accesos Rápidos" (presets) NO viven acá -- están en
 * SavedViewsSidebarComponent, para ser 1-clic sin necesidad de abrir este modal. Para Mes
 * delega en MonthPeriodPickerComponent (mismo componente que usa ComparisonSelectorComponent);
 * para Día/Semana delega en CalendarPeriodPickerComponent (calendario real de mes).
 */
@Component({
  selector: 'app-period-picker',
  standalone: true,
  imports: [Button, CalendarPeriodPickerComponent, FormsModule, MonthPeriodPickerComponent, ToggleSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-picker.html',
  styleUrl: './period-picker.css',
})
export class PeriodPickerComponent {
  readonly granularity = model.required<PeriodGranularity>();
  readonly periodIds = model.required<Set<string>>();
  readonly compare = model.required<boolean>();

  /** Cambiar de granularidad resetea la selección -- un id de Día no tiene sentido en Semana. */
  setGranularity(granularity: PeriodGranularity): void {
    if (granularity === this.granularity()) return;
    this.granularity.set(granularity);
    this.periodIds.set(new Set());
  }
}
