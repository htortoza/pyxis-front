import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { PeriodGranularity } from '../../../data/models/period.model';
import { CalendarPeriodPickerComponent } from '../calendar-period-picker/calendar-period-picker';
import { MonthPeriodPickerComponent } from '../month-period-picker/month-period-picker';

/**
 * Panel presentacional -- sin trigger ni popover propios, embebido en el mini-modal
 * "Comparación" de FiltersModalComponent. El picker explícito de Periodo Específico delega en
 * los mismos componentes que usa PeriodPickerComponent: MonthPeriodPickerComponent para 'mes',
 * CalendarPeriodPickerComponent para Día/Semana -- ambos pickers de periodo (el principal y
 * este) deben verse y comportarse exactamente igual.
 */
@Component({
  selector: 'app-comparison-selector',
  standalone: true,
  imports: [Button, CalendarPeriodPickerComponent, FormsModule, MonthPeriodPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-selector.html',
  styleUrl: './comparison-selector.css',
})
export class ComparisonSelectorComponent {
  /** Granularidad activa en el draft del modal -- de solo lectura acá, la dueña es PeriodPickerComponent. */
  readonly granularity = input.required<PeriodGranularity>();

  readonly mode = model.required<ComparisonMode>();
  readonly alignment = model.required<ComparisonAlignment>();
  readonly explicitPeriodIds = model.required<Set<string>>();

  /** El toggle de alineación solo tiene sentido en modo periodo_anterior y granularidad Día/Semana. */
  protected readonly showAlignment = computed(
    () => this.mode() === 'periodo_anterior' && this.granularity() !== 'mes',
  );
  protected readonly showExplicitPicker = computed(() => this.mode() === 'periodo_especifico');
}
