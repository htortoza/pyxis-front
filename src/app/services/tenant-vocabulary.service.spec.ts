import { TestBed } from '@angular/core/testing';

import { TenantVocabularyService } from './tenant-vocabulary.service';

describe('TenantVocabularyService', () => {
  let service: TenantVocabularyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantVocabularyService);
  });

  it('resolves the retail preset labels for the current tenant', () => {
    expect(service.labelFor('sector')).toBe('Sectores');
    expect(service.labelFor('marca')).toBe('Marcas');
    expect(service.labelFor('tienda')).toBe('Tiendas');
  });
});
