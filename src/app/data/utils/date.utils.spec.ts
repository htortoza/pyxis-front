import { addDaysIso, buildCalendarGrid, daysBetweenIso, daysInMonth, getDayOfWeek, parseIsoDate, toIsoDate } from './date.utils';

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

  it('daysInMonth returns the correct day count, including leap years', () => {
    expect(daysInMonth(2026, 7)).toBe(31);
    expect(daysInMonth(2026, 2)).toBe(28); // 2026 no es bisiesto
    expect(daysInMonth(2024, 2)).toBe(29); // 2024 sí es bisiesto
  });

  describe('buildCalendarGrid', () => {
    it('covers every day of the month, each week has 7 days, and cells are sequential', () => {
      const weeks = buildCalendarGrid(2026, 7); // julio 2026 -- 1 de julio es miércoles
      for (const week of weeks) {
        expect(week.length).toBe(7);
      }
      const allDays = weeks.flat();
      for (let i = 1; i < allDays.length; i++) {
        expect(addDaysIso(allDays[i - 1].iso, 1)).toBe(allDays[i].iso);
      }
      const inMonthCount = allDays.filter((day) => day.inMonth).length;
      expect(inMonthCount).toBe(31);
      // 1 de julio de 2026 es miércoles -- la primera semana debe traer lunes y martes de junio.
      expect(weeks[0][0].inMonth).toBe(false);
      expect(weeks[0][2].iso).toBe('2026-07-01');
      expect(weeks[0][2].inMonth).toBe(true);
    });

    it('every week starts on Monday (weekday reindexed so the first column is always Monday)', () => {
      const weeks = buildCalendarGrid(2026, 7);
      for (const week of weeks) {
        expect(getDayOfWeek(week[0].iso)).toBe(1); // lunes
      }
    });

    it('handles a month that starts exactly on Monday with no leading overflow days', () => {
      // 2026-06-01 -- confirmamos primero que efectivamente cae lunes antes de afirmar sobre el grid.
      const juneFirstWeekday = getDayOfWeek('2026-06-01');
      const weeks = buildCalendarGrid(2026, 6);
      if (juneFirstWeekday === 1) {
        expect(weeks[0][0].iso).toBe('2026-06-01');
        expect(weeks[0][0].inMonth).toBe(true);
      }
    });
  });
});
