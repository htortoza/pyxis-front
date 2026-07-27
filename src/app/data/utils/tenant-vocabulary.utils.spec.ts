import { RUBRO_PRESETS } from '../mock/rubro-presets.mock';
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

  it('resolves the contraparte dimension from the retail preset without touching FilterNodeType', () => {
    expect(resolveDimensionLabel('contraparte', undefined, RUBRO_PRESETS.retail)).toBe('Recaudador');
  });

  it('lets a tenant override the contraparte label', () => {
    expect(resolveDimensionLabel('contraparte', { contraparte: 'Cobrador' }, RUBRO_PRESETS.retail)).toBe(
      'Cobrador',
    );
  });

  it('falls back to the capitalized dimension key when the preset lacks contraparte', () => {
    expect(resolveDimensionLabel('contraparte', undefined, {})).toBe('Contraparte');
  });
});
