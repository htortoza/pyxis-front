import { cumplimientoBand } from './signed-amount';

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
