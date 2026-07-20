# Vocabulario de dimensiones por tenant — Fase 1 (preset de rubro "retail")

## Objetivo

Reemplazar los nombres hardcodeados de las dimensiones Sector / Marca / Tienda en la interfaz por un mecanismo de resolución de etiquetas, para que un futuro tenant con otro rubro (ej. MasterFrut) pueda tener nombres distintos sin reescribir componentes.

## Alcance de esta fase

**Incluido:**
- El mecanismo de resolución con su cadena de fallback completa: override de tenant → preset de rubro → nombre técnico genérico. Solo el nivel "preset de rubro" se ejercita en esta fase (no hay overrides de tenant todavía), pero los tres niveles quedan implementados.
- Un único preset de rubro: `retail`, con los mismos nombres que se ven hoy (Sectores / Marcas / Tiendas).
- Migración de las dos superficies de UI que **existen hoy en este repo** y hardcodean estos nombres:
  - Columnas del filtro en cascada (`context-filter.html`).
  - Encabezados de los paneles de Ranking Comercial (`ranking-panels.html`).

**Explícitamente fuera de alcance (fase futura, spec propio):**
- Árbol de gobernanza, árbol de Vistas Guardadas con breadcrumbs, y simulador de acceso: ninguno de los tres existe todavía en este repo (`Pyxis-front`). `docs/gobernanza-pyxis.md` es una especificación legacy escrita para React/Tailwind/Zustand, inconsistente con el stack real (Angular 21 + PrimeNG + Signals), y no corresponde a código existente. Construirlos es un proyecto grande e independiente del mecanismo de labels — se aborda en una sesión separada, con su propio spec y plan, y en ese momento consumirá el mecanismo ya construido acá.
- La regla de visibilidad de tarjetas ("ocultar cuando la dimensión tiene exactamente 1 valor distinto en el alcance visible del usuario"), descrita en `actualizacion-prioridades-y-contextos.md` — ese archivo no existe en el repo y la regla no está implementada en ningún lado hoy. El mecanismo de labels se diseña para que, cuando esa regla se implemente, ambas compongan sin fusionarse (una decide si se muestra, la otra decide con qué nombre) — pero implementarla no es parte de esta fase.
- Interfaz de administración para editar overrides por tenant (fase 2).
- Cualquier preset de rubro que no sea `retail` (ej. "gastronomía").
- Registro de auditoría de cambios a overrides.

## Estado actual verificado en el código

- `context-filter.html` líneas 65, 111, 162: literales `"Sectores"`, `"Marcas"`, `"Tiendas"` como títulos de columna.
- `ranking-panels.html` líneas 13, 20, 27: literales `title="Sectores"`, `title="Marcas"`, `title="Tiendas"` (el cuarto panel, `"Productos"`, no es una dimensión Sector/Marca/Tienda y queda fuera de alcance).
- `FilterNodeType = 'sector' | 'marca' | 'tienda'` ya existe en `data/utils/sector-marca-tienda-tree.utils.ts:4` — se reutiliza como tipo de clave de dimensión, sin duplicar el union.
- El tenant actual se modela hoy vía `CURRENT_USER` (`data/mock/mock-user.mock.ts`), un `MockUser` constante que ya expone `tenantId` y que `SavedViewsService` consume directamente (`this.currentUser.tenantId`). No existe un `TenantService`/`SessionService` separado, y esta fase no lo introduce — se extiende `MockUser` siguiendo el mismo patrón.

## Modelo de datos (archivos nuevos)

- `data/models/tenant-vocabulary.model.ts`
  - `RubroId = 'retail'` (union de un solo miembro; se extiende cuando exista un segundo preset).
  - `DimensionVocabulary = Record<FilterNodeType, string>`.
- `data/mock/rubro-presets.mock.ts`
  - `RUBRO_PRESETS: Record<RubroId, DimensionVocabulary>` con `retail: { sector: 'Sectores', marca: 'Marcas', tienda: 'Tiendas' }` — los mismos strings que hoy están hardcodeados.

## Modelo de datos (archivos editados)

- `data/models/mock-user.model.ts`: agrega a `MockUser` los campos `rubro: RubroId` y `vocabularyOverrides?: Partial<DimensionVocabulary>` (el segundo, el "asiento" para el override de tenant que una futura UI de administración completará; no se usa en esta fase).
- `data/mock/mock-user.mock.ts`: `CURRENT_USER.rubro = 'retail'`, sin `vocabularyOverrides`.

## Resolución: función pura + servicio

- `data/utils/tenant-vocabulary.utils.ts`
  - `resolveDimensionLabel(dimension: FilterNodeType, vocab: Pick<MockUser, 'rubro' | 'vocabularyOverrides'>): string`
  - Cadena de fallback: `vocab.vocabularyOverrides?.[dimension] ?? RUBRO_PRESETS[vocab.rubro][dimension] ?? capitalize(dimension)`.
  - `capitalize` es un helper local trivial (`'sector' → 'Sector'`), el nivel de "nombre técnico genérico" final, que solo se alcanza si un preset de rubro no define la dimensión.
  - Función pura, sin dependencias de Angular — misma separación que `saved-views.utils.ts` respecto a `SavedViewsService`.
- `services/tenant-vocabulary.service.ts`
  - `TenantVocabularyService`, `@Injectable({ providedIn: 'root' })`.
  - `readonly currentUser = CURRENT_USER;` (mismo patrón que `SavedViewsService`).
  - `labelFor(dimension: FilterNodeType): string` — llama a `resolveDimensionLabel` con `this.currentUser`.

## Migración de componentes

- `context-filter.ts` / `.html`: inyectar `TenantVocabularyService`, reemplazar los 3 títulos de columna literales por `{{ vocab.labelFor('sector') }}`, `{{ vocab.labelFor('marca') }}`, `{{ vocab.labelFor('tienda') }}`.
- `ranking-panels.ts` / `.html`: inyectar el servicio, reemplazar `title="Sectores"` / `"Marcas"` / `"Tiendas"` por `[title]="vocab.labelFor('sector')"` etc. El panel de `"Productos"` no se toca.

## Testing

- Un spec (`tenant-vocabulary.utils.spec.ts`, estilo Jasmine como `app.spec.ts`) que cubre los 3 escalones del fallback: override presente, solo preset, y preset sin la dimensión (fallback genérico).

## Criterio de aceptación

Con el tenant `retail` activo, la interfaz se ve y comporta exactamente igual a hoy (mismos strings "Sectores"/"Marcas"/"Tiendas"), verificable por inspección de código: ningún componente migrado contiene el string hardcodeado, y ambos lo obtienen de `TenantVocabularyService.labelFor(...)`.
