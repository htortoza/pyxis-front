# Auditoría y migración de vocabulario hardcodeado — Fase 1b

## Objetivo

Recorrer todo el frontend ya construido y reemplazar cualquier texto de dimensión Sector/Marca/Tienda escrito directamente en el código (no solo las 4 superficies migradas en la Fase 1) por el mecanismo de resolución de etiquetas (`TenantVocabularyService`).

## Auditoría realizada

Barrido de `src/app` (`.ts` y `.html`, case-insensitive) por los strings "Sector(es)", "Marca(s)", "Tienda(s)", "Local(es)" usados como texto de interfaz, filtrando identificadores técnicos (`FilterNodeType`, `navSectorId`, ids de mock data, imports, comentarios de desarrollador). Resultado: **11 ocurrencias**, todas en `context-filter` (ninguna en Ranking Comercial, Detalle de Ventas, sidebar, header, ni en ningún otro componente — esas superficies ya quedaron limpias en la Fase 1). No existe feature de exportación CSV/XLSX en el repo, así que ese punto del brief no aplica todavía.

**`context-filter.html`:**
1. L25 — `placeholder="Buscar sector, marca o tienda..."`
2. L47 — `Todos los sectores` (botón de breadcrumb)
3. L76 — `placeholder="Buscar sector..."`
4. L122 — `placeholder="Buscar marca..."`
5. L130 — `Selecciona un sector` (estado vacío)
6. L173 — `placeholder="Buscar tienda..."`
7. L181 — `Selecciona una marca` (estado vacío)

**`context-filter.ts`** (dentro de `summaryText` y `triggerLabel`):
8. L153 — `` `${sectores} sector${sectores === 1 ? '' : 'es'}` ``
9. L154 — `` `${marcas} marca${marcas === 1 ? '' : 's'}` ``
10. L156 — `` `${tiendas} tienda${tiendas === 1 ? '' : 's'} seleccionada${tiendas === 1 ? '' : 's'}` ``
11. L166 — `` `${applied.length} tienda${applied.length === 1 ? '' : 's'} seleccionada${applied.length === 1 ? '' : 's'}` `` (trigger button)

## Fuera de alcance (sin cambios respecto al brief)

- "Corners", "Outlets" o cualquier categoría nueva de local — no se agrega, no se infiere.
- Interfaz de administración de overrides por tenant (fase 2).
- Cualquier preset de rubro distinto a "retail".
- Cambios a estructura de datos/algoritmos de `gobernanza-pyxis.md`/`ventas-pyxis.md`.

## Decisión de diseño 1: el esquema de vocabulario gana singular/plural

Varias de las 11 ocurrencias necesitan una forma distinta a la que el mecanismo de Fase 1 provee (un solo string plural por dimensión, ej. "Sectores"): placeholders y estados vacíos piden singular ("sector"), y `summaryText`/`triggerLabel` alternan singular/plural según cantidad. Derivar el singular recortando "s"/"es" del plural sería el mismo tipo de atajo frágil que la Fase 1 evitó a propósito (se rompe con cualquier override futuro irregular).

**Cambio:** `DimensionVocabulary` pasa de `Record<FilterNodeType, string>` a `Record<FilterNodeType, { singular: string; plural: string }>`. Como `MockUser.vocabularyOverrides` y `RUBRO_PRESETS` ya tipan sobre `DimensionVocabulary`/`Partial<DimensionVocabulary>`, sus propias declaraciones no cambian — solo el dato literal en `rubro-presets.mock.ts`.

`resolveDimensionLabel` y `TenantVocabularyService.labelFor` ganan un segundo parámetro `form: 'singular' | 'plural' = 'plural'`. Con el default en `'plural'`, las dos superficies ya migradas en Fase 1 (`context-filter` column titles, `ranking-panels` titles) siguen llamando `labelFor('sector')` sin cambiar una línea.

## Decisión de diseño 2: género gramatical queda fijo en el template

"Selecciona un sector" / "Selecciona una marca" y el sufijo "seleccionada(s)" usan concordancia de género (un/una, -a/-as) que no se puede derivar del texto resuelto — es gramática de copy, no vocabulario. El artículo/sufijo queda como texto fijo en el componente; solo el sustantivo (Sector/Marca/Tienda) se resuelve vía `labelFor()`. Para el tenant retail el resultado es idéntico a hoy. Limitación documentada: un override futuro con género distinto al de retail (ej. "Local", masculino) mostraría una concordancia incorrecta en estos dos mensajes puntuales — aceptable porque esta fase no pide resolver concordancia de género, solo evitar el nombre hardcodeado.

## Migración de las 11 ocurrencias

`ContextFilterComponent` gana computeds nuevos (mismo estilo que `breadcrumbSectorLabel`/`summaryText` ya existentes):

```typescript
protected readonly globalSearchPlaceholder = computed(
  () => `Buscar ${this.vocab.labelFor('sector', 'singular').toLowerCase()}, ${this.vocab.labelFor('marca', 'singular').toLowerCase()} o ${this.vocab.labelFor('tienda', 'singular').toLowerCase()}...`,
);
protected readonly sectorSearchPlaceholder = computed(() => `Buscar ${this.vocab.labelFor('sector', 'singular').toLowerCase()}...`);
protected readonly marcaSearchPlaceholder = computed(() => `Buscar ${this.vocab.labelFor('marca', 'singular').toLowerCase()}...`);
protected readonly tiendaSearchPlaceholder = computed(() => `Buscar ${this.vocab.labelFor('tienda', 'singular').toLowerCase()}...`);
protected readonly allSectorsLabel = computed(() => `Todos los ${this.vocab.labelFor('sector').toLowerCase()}`);
protected readonly selectSectorEmptyMessage = computed(() => `Selecciona un ${this.vocab.labelFor('sector', 'singular').toLowerCase()}`);
protected readonly selectMarcaEmptyMessage = computed(() => `Selecciona una ${this.vocab.labelFor('marca', 'singular').toLowerCase()}`);
```

`summaryText`/`triggerLabel` reemplazan el recorte manual de sufijo por la elección de `form` según cantidad, ej.:

```typescript
const label = this.vocab.labelFor('sector', sectores === 1 ? 'singular' : 'plural').toLowerCase();
parts.push(`${sectores} ${label}`);
```

El template usa las 4 propiedades de placeholder (`[placeholder]="..."`) y las 3 de texto (`{{ ... }}`) en lugar de los literales actuales.

## Testing

Se actualizan los specs existentes de Fase 1 al nuevo signature (`resolveDimensionLabel`/`labelFor` con `form`), agregando casos para `'singular'` y para el fallback cuando ni override ni preset definen esa forma. No hay tests de componente para `context-filter` hoy (patrón ya establecido en Fase 1: cambios de template se verifican por build + grep + chequeo visual, no por tests nuevos de componente).

## Criterio de aceptación

- Grep final (`grep -rniE '(sector|sectores|marca|marcas|tienda|tiendas)'` sobre `.html`/`.ts`, excluyendo `RUBRO_PRESETS`, tipos e identificadores) no debe encontrar ningún literal de interfaz fuera del propio `rubro-presets.mock.ts`.
- Build y suite de tests en verde.
- Verificación visual: con el tenant retail activo, `context-filter` se ve y comporta exactamente igual que antes de esta fase.
- Listado de las 11 ocurrencias (arriba) entregado para revisión antes de cerrar la fase.
