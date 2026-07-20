import { PERIODS_SEMANA } from '../mock/periods.mock';
import { PERIOD_PRESETS } from './period.utils';

describe('PERIOD_PRESETS', () => {
  const TODAY = { year: 2026, month: 7, day: 20 };

  it('has the 6 existing Mes presets plus 2 new Semana presets', () => {
    expect(PERIOD_PRESETS.filter((p) => p.granularity === 'mes').length).toBe(6);
    expect(PERIOD_PRESETS.filter((p) => p.granularity === 'semana').map((p) => p.key)).toEqual([
      'ultimas-3-semanas',
      'ultimas-12-semanas',
    ]);
  });

  it('"ultimas-3-semanas" resolves to exactly 3 weeks ending on the week containing today', () => {
    const preset = PERIOD_PRESETS.find((p) => p.key === 'ultimas-3-semanas')!;
    const ids = preset.resolve(PERIODS_SEMANA, TODAY);
    expect(ids.length).toBe(3);
    const currentWeek = PERIODS_SEMANA.find((p) => p.startDate <= '2026-07-20' && '2026-07-20' <= p.endDate)!;
    expect(ids).toContain(currentWeek.id);
  });

  it('"ultimas-12-semanas" resolves to exactly 12 weeks', () => {
    const preset = PERIOD_PRESETS.find((p) => p.key === 'ultimas-12-semanas')!;
    expect(preset.resolve(PERIODS_SEMANA, TODAY).length).toBe(12);
  });
});

import { PERIODS_DIA, PERIODS_MES } from '../mock/periods.mock';
import { previousPeriodWindow } from './period.utils';

describe('previousPeriodWindow', () => {
  it('calendario alignment shifts back by the exact selected-period count for Mes', () => {
    const selected = PERIODS_MES.filter((p) => ['2026-05', '2026-06', '2026-07'].includes(p.id));
    const previous = previousPeriodWindow(selected, 'calendario', 'mes', PERIODS_MES);
    expect(previous.map((p) => p.id).sort()).toEqual(['2026-02', '2026-03', '2026-04']);
  });

  it('calendario alignment for a single Dia shifts back exactly 1 day', () => {
    const selected = PERIODS_DIA.filter((p) => p.id === '2026-07-20');
    const previous = previousPeriodWindow(selected, 'calendario', 'dia', PERIODS_DIA);
    expect(previous.map((p) => p.id)).toEqual(['2026-07-19']);
  });

  it('dia_semana alignment for a single Dia shifts back exactly 7 days (same weekday)', () => {
    const selected = PERIODS_DIA.filter((p) => p.id === '2026-07-20'); // lunes
    const previous = previousPeriodWindow(selected, 'dia_semana', 'dia', PERIODS_DIA);
    expect(previous.map((p) => p.id)).toEqual(['2026-07-13']); // lunes anterior
  });

  it('dia_semana alignment for 8 selected Dias shifts back 14 days (next multiple of 7)', () => {
    const selected = PERIODS_DIA.filter((p) => p.id >= '2026-07-13' && p.id <= '2026-07-20');
    expect(selected.length).toBe(8);
    const previous = previousPeriodWindow(selected, 'dia_semana', 'dia', PERIODS_DIA);
    expect(previous.length).toBe(8);
    expect(previous[0].id).toBe('2026-06-29');
    expect(previous.at(-1)?.id).toBe('2026-07-06');
  });

  it('dia_semana alignment for Semana gives the same result as calendario (spec: a full week already aligns weekdays)', () => {
    const selected = PERIODS_SEMANA.slice(10, 11);
    const viaCalendario = previousPeriodWindow(selected, 'calendario', 'semana', PERIODS_SEMANA);
    const viaDiaSemana = previousPeriodWindow(selected, 'dia_semana', 'semana', PERIODS_SEMANA);
    expect(viaDiaSemana).toEqual(viaCalendario);
  });

  it('returns an empty array when nothing is selected', () => {
    expect(previousPeriodWindow([], 'calendario', 'mes', PERIODS_MES)).toEqual([]);
  });
});
