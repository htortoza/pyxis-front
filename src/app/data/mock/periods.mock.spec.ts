import { PERIODS_DIA, PERIODS_MES, PERIODS_SEMANA } from './periods.mock';

describe('periods.mock', () => {
  it('PERIODS_MES spans 2024-01 through 2026-12 with the existing order formula', () => {
    expect(PERIODS_MES.length).toBe(36);
    expect(PERIODS_MES[0].id).toBe('2024-01');
    expect(PERIODS_MES[0].order).toBe(2024 * 12 + 1);
    expect(PERIODS_MES[0].startDate).toBe('2024-01-01');
    expect(PERIODS_MES[0].endDate).toBe('2024-01-31');
    expect(PERIODS_MES.at(-1)?.id).toBe('2026-12');
    expect(PERIODS_MES.at(-1)?.endDate).toBe('2026-12-31');
  });

  it('PERIODS_DIA covers every day from 2024-01-01 to 2026-12-31 with sequential order', () => {
    expect(PERIODS_DIA[0]).toEqual(
      expect.objectContaining({ id: '2024-01-01', granularity: 'dia', order: 1, startDate: '2024-01-01', endDate: '2024-01-01' }),
    );
    expect(PERIODS_DIA[1].order).toBe(2);
    expect(PERIODS_DIA.at(-1)?.id).toBe('2026-12-31');
  });

  it('PERIODS_SEMANA groups days into consecutive non-overlapping 7-day windows', () => {
    expect(PERIODS_SEMANA[0]).toEqual(
      expect.objectContaining({ granularity: 'semana', order: 1, startDate: '2024-01-01', endDate: '2024-01-07' }),
    );
    expect(PERIODS_SEMANA[1].startDate).toBe('2024-01-08');
    expect(PERIODS_SEMANA[1].endDate).toBe('2024-01-14');
  });
});
