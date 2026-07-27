import { comparisonBand, cumplimientoBand } from './signed-amount';

describe('comparisonBand', () => {
  it('defaults to today\'s higher-good behavior with 1 argument', () => {
    expect(comparisonBand(6)).toBe('good');
    expect(comparisonBand(-3)).toBe('medium');
    expect(comparisonBand(-10)).toBe('bad');
    expect(comparisonBand(null)).toBe('medium');
  });

  it('inverts the classification for "lower-good" metrics (e.g. %Vencido)', () => {
    expect(comparisonBand(6, 'lower-good')).toBe('bad'); // rise in %vencido is bad
    expect(comparisonBand(-6, 'lower-good')).toBe('good'); // drop in %vencido is good
  });

  it('treats moves within the sensitivity band as "medium" regardless of direction (e.g. DSO)', () => {
    expect(comparisonBand(2, 'lower-good', 5)).toBe('medium');
    expect(comparisonBand(-2, 'lower-good', 5)).toBe('medium');
  });

  it('sensitivity band does not affect calls that omit it (default 0)', () => {
    expect(comparisonBand(0)).toBe('good');
    expect(comparisonBand(0, 'lower-good')).toBe('good');
  });
});

describe('cumplimientoBand', () => {
  it('is "good" at or above 80% cumplimiento', () => {
    expect(cumplimientoBand(0)).toBe('good'); // 100% del target
    expect(cumplimientoBand(-20)).toBe('good'); // 80% del target, borde inclusive
  });

  it('is "medium" between 50% and 80% cumplimiento', () => {
    expect(cumplimientoBand(-21)).toBe('medium');
    expect(cumplimientoBand(-50)).toBe('medium'); // 50% del target, borde inclusive del lado medium
  });

  it('is "bad" below 50% cumplimiento', () => {
    expect(cumplimientoBand(-51)).toBe('bad');
  });

  it('is "medium" when there is no meta to compare against', () => {
    expect(cumplimientoBand(null)).toBe('medium');
  });
});
