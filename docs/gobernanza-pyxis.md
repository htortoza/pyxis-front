# **ESPECIFICACIÓN TÉCNICA DE DESARROLLO: MÓDULO DE GOBERNANZA (BI PYXIS)**

Este documento contiene la especificación de ingeniería para el diseño, estructura de datos, lógica de negocio e interacción del frontend del **Módulo de Gobernanza de Bi Pyxis**. Está diseñado como un mapa de implementación directa para desarrolladores o herramientas de generación de código (CLI).

## **1\. El Modelo Conceptual de Accesos (RBAC \+ CBAC)**

La gobernanza de Bi Pyxis desacopla de forma estricta las capacidades operativas del usuario de su alcance de visualización de datos de negocio.

### **Role-Based Access Control (RBAC \- Permisos Funcionales)**

Define las rutas, vistas y acciones de mutación que el usuario puede ejecutar en la interfaz. Los roles predefinidos son:

* `HOLDING_ADMIN`: Control total sobre todos los tenants del holding, creación de usuarios, configuración del motor de mapeo ERP y visualización de logs globales.  
* `CLIENT_ADMIN`: Gestión de usuarios locales del tenant asignado, visualización de alertas y logs de carga de datos locales. No tiene acceso al diseño del mapeo ERP.  
* `VIEWER_ESTRATEGICO`: Acceso exclusivo de lectura al Visor Estratégico. Bloqueo total de exportaciones de datos en crudo (CSV/XLSX) y ocultación absoluta de vistas de configuración técnica.

### **Context-Based Access Control (CBAC \- Permisos de Datos)**

Define el "lente" o contexto de datos que restringe la información mostrada en los dashboards del Visor Estratégico. Funciona como una restricción de fila (Row-Level Security) aplicada en el cliente y el servidor. El usuario puede tener asignados múltiples nodos pertenecientes a tres dimensiones organizacionales distintas:

* **Dimensión Societaria:** `Holding` \> `Empresa` \> `Sociedad SAP`.  
* **Dimensión Comercial:** `Sectores` \> `Marcas` \> `Tiendas/Locales`.  
* **Dimensión Geográfica:** `Países` \> `Regiones/Zonas` \> `Ubicaciones Físicas`.

### **Reglas de Negocio del Frontend**

1. **Herencia Descendente:** Al marcar un nodo padre (ej. *Sector Retail*), el sistema selecciona automáticamente y de forma recursiva todos los nodos descendientes (las marcas y tiendas bajo ese sector).  
2. **Exclusión Explícita (Excepciones):** Un administrador puede desmarcar una tienda específica dentro de una marca heredada. Esta acción remueve la tienda del alcance permitido y marca visualmente a los nodos padres en un estado "Indeterminado" (`■`).  
3. **Estado Indeterminado:** Un nodo intermedio debe renderizar un estado indeterminado (`indeterminate = true` en el elemento DOM del checkbox) si y solo si al menos uno de sus descendientes está seleccionado y al menos uno de sus descendientes está desmarcado.

## **2\. Tipado de Datos de Negocio (TypeScript)**

Los siguientes tipos de datos definen la estructura estricta utilizada para tipar las propiedades de los componentes, el estado global y las llamadas de la API:

TypeScript

```
export type UserRole = 'HOLDING_ADMIN' | 'CLIENT_ADMIN' | 'VIEWER_ESTRATEGICO';

export type DimensionType = 'SOCIETARIA' | 'COMERCIAL' | 'GEOGRAFICA';

export type NodeType = 'HOLDING' | 'SECTOR' | 'EMPRESA' | 'MARCA' | 'ZONA' | 'TIENDA';

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  role: UserRole;
  isActive: boolean;
}

export interface HierarchyNode {
  id: string;
  label: string;
  type: NodeType;
  parentId: string | null;
  children?: HierarchyNode[];
}

export interface UserAccessScope {
  userId: string;
  dimension: DimensionType;
  allowedNodeIds: string[];  // IDs de nodos seleccionados explícitamente o por herencia completa
  excludedNodeIds: string[]; // IDs de nodos hijos desmarcados manualmente dentro de ramas seleccionadas
}

export interface RoleMetadata {
  id: UserRole;
  label: string;
  description: string;
}
```

## **3\. Arquitectura del Layout y Estilo Visual (Tailwind CSS)**

La interfaz se despliega sobre un contenedor de pantalla dividida (**Split Layout 60/40**) sin scroll en el cuerpo principal. El scroll se gestiona de manera independiente dentro de cada columna para maximizar la usabilidad del administrador.

```
+---------------------------------------------------------------------------------+
|                                 GLOBAL HEADER                                   |
+---------------------------------------------------------------------------------+
| COLUMNA IZQUIERDA (60% de ancho)            | COLUMNA DERECHA (40% de ancho)    |
| - Scroll vertical independiente             | - Fijo / Persistente              |
| - Formulario básico de usuario              | - Resumen de permisos en tiempo   |
| - Selector de rol funcional                 |   real                            |
| - Pestañas de dimensiones de datos          | - Métricas rápidas de cobertura   |
| - Árbol jerárquico (Tree View) interactivo  | - Acceso al simulador de visor    |
| - Buscador dinámico con filtro reactivo     |                                   |
+---------------------------------------------+-----------------------------------+
```

### **Paleta de Componentes de Estilo (Tailwind CSS Tokens)**

* **Contenedor de Pantalla Completa:**  
* HTML

```
<div class="flex w-full h-screen overflow-hidden bg-slate-100"></div>
```

*   
* **Columna de Configuración (Izquierda):**  
* HTML

```
<div class="w-3/5 h-full overflow-y-auto bg-white p-8 border-r border-slate-200 space-y-6"></div>
```

*   
* **Columna de Validación (Derecha):**  
* HTML

```
<div class="w-2/5 h-full bg-slate-50 p-8 flex flex-col justify-between overflow-y-auto"></div>
```

*   
* **Campos de Entrada (Formulario):**  
* HTML

```
<input class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" />
```

*   
* **Tarjeta Descriptiva del Rol Activo:**  
* HTML

```
<div class="p-4 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-900 leading-relaxed mt-2 animate-fade-in"></div>
```

*   
* **Botón de Pestaña de Dimensión Activo:**  
* HTML

```
<button class="bg-white text-slate-900 shadow-sm border border-slate-200 py-1.5 px-3 rounded-md text-xs font-semibold focus:outline-none"></button>
```

*   
* **Botón de Pestaña de Dimensión Inactivo:**  
* HTML

```
<button class="text-slate-500 hover:text-slate-950 py-1.5 px-3 text-xs font-medium transition-colors focus:outline-none"></button>
```

* 

## **4\. Lógica de Interacción del Árbol de Permisos (Algoritmos)**

El comportamiento de los elementos interactivos del árbol de jerarquías debe implementarse bajo la siguiente lógica de negocio:

### **Algoritmo de Propagación de Checkbox (Tristate Logic)**

Cuando el usuario hace clic sobre el checkbox de un nodo específico (`targetNode`):

#### **1\. Propagación Hacia Abajo (Descendentes)**

* Si el estado del checkbox cambia a **Seleccionado (Checked \= true)**:  
  * Agregar el `id` del `targetNode` al arreglo `checked_ids`.  
  * Recorrer de forma recursiva todos los hijos y descendientes de `targetNode`.  
  * Agregar cada uno de ellos al arreglo `checked_ids`.  
  * Eliminar cada uno de ellos del arreglo `excluded_ids` e `indeterminate_ids` si estuvieran presentes.  
* Si el estado del checkbox cambia a **Desmarcado (Checked \= false)**:  
  * Remover el `id` del `targetNode` del arreglo `checked_ids`.  
  * Recorrer recursivamente todos los hijos y descendientes de `targetNode`.  
  * Remover cada uno de ellos de `checked_ids`, `excluded_ids` e `indeterminate_ids`.

#### **2\. Propagación Hacia Arriba (Ascendentes)**

* Obtener el nodo padre directo (`parentNode`) del `targetNode`.  
* Mientras el `parentNode` no sea nulo:  
  * Obtener el listado de todos los hijos del `parentNode`.  
  * **Condición de Selección Completa:** Si todos los hijos del `parentNode` se encuentran incluidos en `checked_ids`:  
    * Agregar `parentNode` a `checked_ids`.  
    * Remover `parentNode` de `indeterminate_ids` y `excluded_ids`.  
  * **Condición de Selección Parcial (Indeterminada):** Si al menos uno de los hijos del `parentNode` está en `checked_ids` o en `indeterminate_ids`, pero no todos los hijos están en `checked_ids`:  
    * Agregar `parentNode` a `indeterminate_ids`.  
    * Remover `parentNode` de `checked_ids`.  
    * Identificar qué hijos específicos no están seleccionados y agregarlos a `excluded_ids` para el payload de la API.  
  * **Condición de Deselección:** Si ningún hijo del `parentNode` está seleccionado:  
    * Remover `parentNode` de `checked_ids` y de `indeterminate_ids`.  
  * Asignar el abuelo del `targetNode` como el nuevo `parentNode` para continuar el bucle hacia arriba de la jerarquía.

### **Algoritmo de Filtro por Búsqueda (Debounce & Highlight)**

Para evitar caídas de rendimiento en el re-renderizado del árbol:

1. Aplicar un temporizador de retraso (**Debounce de 300 milisegundos**) sobre la captura del evento del teclado en el campo de búsqueda.  
2. Al procesar la búsqueda, ejecutar una función que marque una bandera de visibilidad en el estado plano de los nodos del árbol:  
   * Si el nombre del nodo contiene la cadena de búsqueda (case-insensitive), establecer `isVisible = true` y forzar `isVisible = true` en todos sus nodos ascendientes directos hasta llegar a la raíz.  
   * Si el nodo no coincide y ninguno de sus descendientes contiene la cadena de búsqueda, establecer `isVisible = false`.  
3. Para los nodos visibles que contengan coincidencia directa, envolver la porción del texto coincidente en una etiqueta HTML con estilos de resaltado: `<span class="bg-yellow-100 font-semibold text-slate-900">coincidencia</span>`.

## **5\. Implementación del Simulador de Acceso (Sandbox)**

El simulador permite auditar los permisos en tiempo real sin salir de la configuración de usuario.

1. **Activación de la Simulación:**  
   * El administrador hace clic en el botón `Simular como Usuario`.  
   * El frontend bloquea la pantalla con una capa de superposición (`bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center`).  
   * Se muestra un esqueleto animado de carga (shimmer/skeleton loader) que emula la carga de datos del dashboard estratégico.  
2. **Aislamiento del Entorno (Sandboxing):**  
   * Se monta el componente del **Visor Estratégico** en modo restringido.  
   * El componente de simulación intercepta temporalmente el estado global del contexto de datos (`ActiveContextStore`), inyectando los `checked_ids` actuales de la configuración en lugar de las credenciales del administrador.  
   * Se bloquean físicamente todos los botones e interacciones no relacionadas con la visualización (se deshabilitan los clics en exportaciones, menús de soporte o configuraciones del sistema).  
3. **Barra Flotante de Control de Simulación:**  
   * En la parte superior de la pantalla de simulación se renderiza un banner persistente e inamovible con el estilo: `bg-slate-900 text-white py-3 px-6 flex justify-between items-center w-full z-[60] shadow-xl`.  
   * El banner muestra el mensaje: *"Usted está simulando la vista del usuario con restricciones de datos aplicadas en tiempo real."*  
   * Incluye un botón de color de advertencia (`bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded-md transition-colors`) con la etiqueta `Finalizar Simulación`. Al hacer clic, se destruye el entorno del simulador y se retorna al formulario de edición de la columna izquierda con el estado previo intacto.

## **6\. Arquitectura de Estado Global en el Frontend (Zustand)**

El manejo del contexto de datos seleccionado por el usuario en el dashboard debe gestionarse mediante un almacén de estado ligero, accesible por todos los componentes del Visor Estratégico.

TypeScript

```
import { create } from 'zustand';

interface ActiveContextState {
  currentContextId: string | null;
  activeDimension: DimensionType;
  allowedEntityIds: string[];
  setContext: (contextId: string, dimension: DimensionType, entityIds: string[]) => void;
  clearContext: () => void;
}

export const useActiveContext = create<ActiveContextState>((set) => ({
  currentContextId: null,
  activeDimension: 'COMERCIAL',
  allowedEntityIds: [],
  
  setContext: (contextId, dimension, entityIds) => set({ 
    currentContextId: contextId, 
    activeDimension: dimension,
    allowedEntityIds: entityIds
  }),
  
  clearContext: () => set({ 
    currentContextId: null, 
    activeDimension: 'COMERCIAL',
    allowedEntityIds: [] 
  }),
}));
```

### **Inyección Automática de Parámetros en Peticiones HTTP**

Cada componente de visualización de datos (gráfico de barras, tarjetas de KPIs, tablas de márgenes) debe suscribirse al estado de `useActiveContext`. Al cambiar el contexto, se dispara una nueva consulta a la API inyectando el alcance de datos autorizado:

TypeScript

```
// Ejemplo de petición HTTP estructurada para el Visor Estratégico
const fetchDashboardKPIs = async (contextId: string | null, allowedIds: string[]) => {
  const queryParams = new URLSearchParams({
    context_id: contextId || '',
    allowed_entities: allowedIds.join(','),
  });
  
  const response = await fetch(`/api/visor/kpis/sales?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Error al cargar datos del dashboard');
  return response.json();
};
```

### **Invalidación de Sesión en Tiempo Real (WebSockets / SSE)**

Para asegurar que los cambios de permisos aplicados por un administrador se reflejen de inmediato en la sesión de un usuario activo:

1. El cliente se suscribe a un canal privado de mensajería bidireccional mediante WebSockets al iniciar sesión: `/ws/users/{userId}`.  
2. Al guardar una actualización de gobernanza, el servidor emite una notificación con el payload: `{"event": "ACCESS_UPDATED", "timestamp": "2026-07-14T17:43:00Z"}`.  
3. El cliente intercepta el mensaje en el frontend:  
   * Invalida de inmediato el caché en memoria de todas las llamadas HTTP de los dashboards.  
   * Dispara un re-fetch automático del alcance de datos actual.  
   * Muestra un banner sutil y transitorio en la esquina superior del dashboard: *"Tus permisos de acceso han sido actualizados por administración. La información en pantalla ha sido actualizada."* sin forzar la desconexión del usuario.

