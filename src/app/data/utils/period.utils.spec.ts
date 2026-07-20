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
