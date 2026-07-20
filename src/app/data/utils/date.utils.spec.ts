import { addDaysIso, daysBetweenIso, getDayOfWeek, parseIsoDate, toIsoDate } from './date.utils';

describe('date.utils', () => {
  it('toIsoDate formats a Date as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date('2026-07-20T00:00:00Z'))).toBe('2026-07-20');
  });

  it('parseIsoDate round-trips through toIsoDate', () => {
    expect(toIsoDate(parseIsoDate('2026-01-05'))).toBe('2026-01-05');
  });

  it('addDaysIso adds days, including across a month boundary', () => {
    expect(addDaysIso('2026-07-20', 1)).toBe('2026-07-21');
    expect(addDaysIso('2026-07-31', 1)).toBe('2026-08-01');
  });

  it('addDaysIso subtracts days with a negative offset', () => {
    expect(addDaysIso('2026-08-01', -1)).toBe('2026-07-31');
  });

  it('getDayOfWeek returns 0 for a known Sunday and 1 for a known Monday', () => {
    expect(getDayOfWeek('2026-07-19')).toBe(0); // domingo
    expect(getDayOfWeek('2026-07-20')).toBe(1); // lunes
  });

  it('daysBetweenIso returns the number of days between two dates', () => {
    expect(daysBetweenIso('2026-07-01', '2026-07-08')).toBe(7);
    expect(daysBetweenIso('2026-07-08', '2026-07-01')).toBe(-7);
  });
});
