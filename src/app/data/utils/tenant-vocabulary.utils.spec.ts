import { resolveDimensionLabel } from './tenant-vocabulary.utils';

describe('resolveDimensionLabel', () => {
  it('uses the tenant override when present', () => {
    expect(resolveDimensionLabel('sector', { sector: 'Rubros' }, { sector: 'Sectores' })).toBe('Rubros');
  });

  it('falls back to the rubro preset when there is no override', () => {
    expect(resolveDimensionLabel('marca', undefined, { marca: 'Marcas' })).toBe('Marcas');
  });

  it('falls back to the capitalized dimension key when the preset lacks that dimension', () => {
    expect(resolveDimensionLabel('tienda', undefined, {})).toBe('Tienda');
  });
});
