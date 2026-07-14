# **ESPECIFICACIÓN DE DESARROLLO DE FRONTEND: PANTALLAS DE VENTAS Y DETALLE (BI PYXIS)**

Este documento define la estructura visual, el comportamiento interactivo, los esquemas de componentes y la lógica de negocio requerida para construir las pantallas de **Ventas General** y **Detalle de Ventas** adaptadas a los rubros de **Retail** y **Gastronomía**.

## **1\. COMPONENTE: BARRA SUPERIOR DE FILTROS Y CONTEXTO (HEADER GLOBAL)**

Controlador maestro que rige los datos de toda la sesión.

### **Elementos de UI**

* **Selector de Contexto Jerárquico:** Dropdown multinivel alineado a la izquierda. Permite seleccionar el alcance de visualización: `[Holding] > [Empresa / Sector] > [Marca] > [Local]`.  
* **Selector de Periodos Temporal (Checkboxes de Franja de Tiempo):** Grupo de checkboxes alineado a la derecha. Permite la selección múltiple de meses o periodos de comparación (ej: `[✓] Mayo`, `[✓] Junio`, `[✓] Julio`).  
* **Botón "Limpiar Filtros":** Visible únicamente cuando existe un filtro cruzado o de selección activa. Restablece todos los parámetros al estado por defecto del usuario.

  ### **Comportamiento e Interacciones**

* Al modificar cualquier selección en este Header, se dispara un estado de carga global de tipo *shimmer/skeleton* en todos los gráficos y tablas de la página.  
* El renderizado de los datos modificados por el cambio de contexto o periodo debe completarse en menos de 1.5 segundos de forma asíncrona.

  ## **2\. PANTALLA: VENTAS GENERAL (DASHBOARD TÁCTICO)**

  ### **componente A: Franja de Indicadores Clave (KPI Cards Grid)**

Estructura de rejilla de 4 columnas horizontales con diseño adaptativo según el tipo de entidad activa en el Selector de Contexto.

```
+-------------------+ +-------------------+ +-------------------+ +-------------------+
| VENTAS TOTALES    | | TRANSACCIONES     | | CUENTA PROMEDIO   | | TICKET PROMEDIO   |
| $30.916.959.091   | | 1.057.295         | | $29.242           | | $11.866           |
| (▲ 12% vs prev)   | | (▲ 4% vs prev)    | | (Cubierto Prom.)  | | (UPT: 2.4)        |
+-------------------+ +-------------------+ +-------------------+ +-------------------+
```

#### **Reglas de Renderizado Dinámico**

* **Card 1: Ventas Totales:** Suma acumulada de facturación. Si la entidad seleccionada opera con múltiples monedas, el frontend recibe la conversión estandarizada desde la API.  
* **Card 2: Transacciones:** Cantidad total de tickets de venta (Retail) o comandas/mesas cerradas (Gastronomía).  
* **Card 3: Cuenta Promedio / Cubierto (Foco Gastronomía):** Representa el valor promedio de consumo por mesa o comanda. Si el contexto seleccionado es estrictamente Retail, esta tarjeta cambia su etiqueta a **UPT (Unidades por Ticket)** y muestra un promedio decimal (ej: `2.4`).  
* **Card 4: Ticket Promedio (Foco Retail):** Valor monetario promedio de cada transacción de compra.

  ### **Componente B: Gráfico de Distribución Horaria de Ventas**

Componente de análisis temporal para identificar picos de venta, turnos críticos y optimización de personal.

```
+---------------------------------------------------------------------------------+
| Ventas hora                                            [Gráfico Barras] [Calor] |
|                                                                                 |
|  $2.5B |             █   █                                                      |
|  $2.0B |         █   █   █   █                                                  |
|  $1.5B |         █   █   █   █   █   █                                          |
|  $1.0B |     █   █   █   █   █   █   █   █                                      |
|    $0  +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+--+  |
|       6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  0   |
+---------------------------------------------------------------------------------+
```

#### **Requerimientos del Gráfico**

* **Eje X (Escala de Tiempo Operativo):** Debe comenzar a las **06:00 AM** y terminar a las **05:00 AM** del día siguiente para capturar correctamente el turno nocturno y de madrugada de la gastronomía y el retail de entretenimiento.  
* **Eje Y (Ventas en Monto):** Escala numérica adaptativa de acuerdo al volumen de facturación del contexto seleccionado.  
* **Series Múltiples:** Las barras se agrupan por color para cada uno de los periodos seleccionados en el Header (ej: Rosa para Mayo, Azul para Junio, Amarillo para Julio).  
* **Selector de Vista (Tabs Toggle):**  
  * `Gráfico de Barras`: Visualización estándar agrupada por hora y periodo.  
  * `Gráfico de Calor (Heatmap)`: Matriz de densidad de 7x24 (Días de la semana vs. Horas del día). La opacidad del color del bloque indica la concentración de la facturación en ese bloque horario específico.

    ### **Componente C: Paneles de Ranking Comercial (Filtro Cruzado Activo)**

Fila de 4 contenedores verticales de listas compactas para identificar el rendimiento de los activos del holding.

```
+--------------------+ +--------------------+ +--------------------+ +--------------------+
| SECTORES           | | LOCALES            | | MARCAS             | | PRODUCTOS          |
|--------------------| |--------------------| |--------------------| |--------------------|
| Costanera  $5.3B   | | Antofagasta $2.3B  | | Barra Chalaca $1.9B| | Lomo Saltado $1.9B |
| Parque A.  $2.9B   | | Open Kenn. $1.7B  | | Kairos        $1.2B| | Coca Cola Z. $0.4B |
| Vespucio   $2.6B   | | Tanta Cost. $1.5B  | | Frida Kahlo   $1.2B| | Limonada M.  $0.3B |
| Ver más...         | | Ver más...         | | Ver más...         | | Seleccionar [Top v]|
+--------------------+ +--------------------+ +--------------------+ +--------------------+
```

#### **Requerimientos de Interacción**

* **Panel Sectores / Locales / Marcas:** Muestra el listado ordenado descendentemente por monto de venta.  
* **Panel Productos:** Incluye un selector dropdown en su esquina derecha para alternar la ordenación de la lista entre `Más ventas` (Volumen de facturación) y `Más unidades` (Volumen físico de salida).  
* **Filtro Cruzado al Clic (Cross-Filtering):** Al hacer clic en cualquier ítem de cualquiera de las listas (ej: hacer clic en la marca *Barra Chalaca*), el frontend captura el ID de la entidad y actualiza el estado del dashboard para filtrar todos los componentes (Gráficos, KPIs y Tablas) por esa selección en tiempo real, sin recargar la página.

  ## **3\. PANTALLA: DETALLE DE VENTAS (EXPLORADOR GRANULAR)**

  ### **Componente A: Panel Acordeón de Filtros Multidimensionales**

Fila colapsable de botones de selección múltiple tipo "Grid de Tags" para acotar el universo de datos antes del análisis de la tabla.

```
+---------------------------------------------------------------------------------+
| DETALLE VENTAS                                             [✓] Mayo [✓] Junio   |
|                                                                                 |
| Sectores: [ Alto ] [ Costanera Center ] [ Isidora ] [ Open ] [ Tobalaba ]       |
| Marcas:   [ 7 CORTES ] [ DULCE LUNA ] [ BARRA CHALACA ] [ FRIDA KAHLO ]         |
| Locales:  [ Antofagasta ] [ Argentina Parque ] [ Japo Costanera ] [ La Mar ]    |
+---------------------------------------------------------------------------------+
```

#### **Requerimientos**

* Cada tag funciona como un selector on/off. Al activarse, cambia su color de fondo a un tono gris oscuro o azul y añade un icono de selección.  
* El panel se puede colapsar para ahorrar espacio vertical cuando el usuario comience a navegar por la tabla jerárquica.

  ### **Componente B: Tabla de Ventas Jerárquica (Tree-Table Component)**

Este es el componente más complejo de la pantalla de detalle. Debe estructurar grandes volúmenes de datos jerárquicos y permitir la comparación temporal por columnas.

#### **Estructura de Columnas (Headers)**

La cabecera de la tabla debe construirse dinámicamente según la cantidad de periodos seleccionados en el Header Global:

```
+-----------------------+---------------------+---------------------+---------------------+---------------------+
|                       |        MAYO         |        JUNIO        |        JULIO        |     CONSOLIDADO     |
+-----------------------+----------+----------+----------+----------+----------+----------+----------+----------+
| CATEGORÍA / ARTÍCULO  | Total ($)| Cantidad | Total ($)| Cantidad | Total ($)| Cantidad | Suma Tot | Cant Tot |
+-----------------------+----------+----------+----------+----------+----------+----------+----------+----------+
```

#### **Estructura de Filas Jerárquicas (Anidamiento en 3 Niveles)**

El cuerpo de la tabla debe soportar la expansión y contracción de nodos sin perder la posición del scroll.

* **Nivel 1: Familia (Nodo Raíz)**  
  * Muestra un botón de expansión `[+]` o `[-]` junto al nombre (ej: `[+] Alimentos`, `[+] Con Alcohol`).  
  * Muestra la sumatoria agregada de todas sus subfamilias para cada periodo.  
* **Nivel 2: Subfamilia (Nodo Hijo)**  
  * Visible solo al expandir la Familia correspondiente.  
  * Hereda la sangría visual para denotar jerarquía.  
  * Muestra un botón de expansión `[+]` junto al nombre (ej: `[+] 7 Cortes`, `[+] A la Carta`).  
* **Nivel 3: Artículo / SKU (Nodo Hoja)**  
  * Visible solo al expandir la Subfamilia.  
  * No contiene botón de expansión.  
  * Muestra el dato más granular (ej: *Entraña 200g*, *Lomo Liso 250g*).

```
[-] Alimentos                           $11.857.813.330   1.199.480   $10.658.146.322   1.070.947
    [-] 7 Cortes                            $45.230.500       1.825       $41.502.700       1.583
        Entraña 200g                         $7.782.800         322        $7.644.300         307
        Filete 250g                          $5.051.200         248        $3.744.300         171
    [+] A la Carta                          $22.539.187       1.338       $23.505.774       1.304
```

    ## **4\. REQUERIMIENTOS LÓGICOS Y CASOS DE BORDE (INNEGOCIABLES)**

    ### **A. Gestión de Descuentos e Importes Negativos**

* Los descuentos procedentes de los sistemas ERP (como SAP) se consolidan bajo un nodo especial al final de la tabla (ej: `zDescuento` o `zMermas`).  
* **Regla de Formateo:** Todos los importes negativos de la tabla deben formatearse entre paréntesis, sin el símbolo de resta convencional y pintarse en color rojo suave para destacar la erosión del margen:  
  * *Ejemplo de renderizado:* `($5.378.026.949)` en lugar de `-$5.378.026.949`.

    ### **B. Rendimiento de Celdas y Buscador Inline**

* La tabla jerárquica debe incluir un buscador inline de texto.  
* Al escribir en el buscador (ej: "Lomo"), la tabla debe expandir de forma automática todas las Familias y Subfamilias que contengan artículos con la coincidencia, ocultando momentáneamente el resto de las ramas que no coincidan para mantener la densidad de información.

  ### **C. Control de Cero Ventas (Filas Vacías)**

* Para maximizar la legibilidad y evitar la contaminación visual en holdings con catálogos de miles de SKUs, el componente de tabla debe ocultar por defecto aquellas filas de artículos que registren un valor de `$0` y cantidad `0` en todos los meses/periodos seleccionados de la vista activa.  
  * 

4. COMPONENTE: GRÁFICO DE CALOR DE VENTAS (HEATMAP 7x24)
Este componente permite identificar de forma inmediata los patrones de compra semanales y horarios, cruzando los 7 días de la semana con las 24 horas del día operativo.

A. Estructura de Maquetación y Grilla (Grid Layout)
El componente se maqueta como una matriz bidimensional fija utilizando CSS Grid.

Eje Y (Filas): 7 filas que representan los días de la semana (Lunes a Domingo).

Eje X (Columnas): 24 columnas que representan las horas del día, alineadas con el día operativo de Bi Pyxis (comenzando a las 06:00 y terminando a las 05:00 del día siguiente).

Esquina Superior Izquierda: Celda vacía de intersección para alinear las etiquetas.

      06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22  23  00  01  02  03  04  05
Lun  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [█] [█] [░] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Mar  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [█] [█] [░] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Mie  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [░] [█] [█] [░] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Jue  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [░] [█] [█] [▒] [ ] [▒] [▒] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Vie  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [▒] [█] [█] [█] [▒] [█] [█] [▒] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Sab  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [▒] [█] [█] [█] [▒] [█] [█] [▒] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
Dom  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [░] [▒] [▒] [░] [ ] [░] [░] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ]
B. Lógica de Pintado y Escala de Colores (Heatmap Density)
El color de fondo de cada celda (grid-cell) se determina dinámicamente según la proporción de su venta respecto a la venta máxima registrada en una sola hora dentro del periodo y contexto activos.

Escala de Opacidad (Uso del color primario, ej. Naranja Corporativo #FF5722):
Sin Ventas (0%): bg-slate-50 border border-slate-100 (Gris neutro muy claro).

Densidad Baja (1% - 25% de la venta máx.): Fondo con 10% de opacidad (bg-orange-500/10).

Densidad Media-Baja (26% - 50% de la venta máx.): Fondo con 30% de opacidad (bg-orange-500/30).

Densidad Media-Alta (51% - 75% de la venta máx.): Fondo con 60% de opacidad (bg-orange-500/60).

Densidad Alta / Pico de Ventas (76% - 100% de la venta máx.): Fondo con 100% de opacidad (bg-orange-500).

C. Comportamiento Interactivo (Tooltips y Hover)
Cada celda de la matriz debe reaccionar al pasar el cursor (hover) y mostrar un panel flotante dinámico con el desglose del rendimiento del negocio en ese bloque exacto.

Requerimientos del Hover:
Al posicionar el cursor sobre una celda, esta debe aplicar un borde de alta visibilidad (outline outline-2 outline-indigo-600 outline-offset-1 z-10).

Se despliega un Tooltip Flotante con la siguiente estructura de datos:

+----------------------------------------------------+
| Sábado, 15:00 hrs                                 |
|----------------------------------------------------|
| Ventas Totales:     $4.520.300                     |
| Transacciones:      142                            |
| Ticket Promedio:    $31.833                        |
| % de la Venta Día:  14.2%                          |
+----------------------------------------------------+
D. JSON Schema: Datos de Entrada para el Heatmap
El componente debe recibir un arreglo plano de objetos con la información pre-calculada por el backend para evitar ciclos de renderizado costosos en el navegador:

JSON
[
  {
    "dayOfWeek": 1, 
    "hour": 14,
    "salesAmount": 2350000.00,
    "transactions": 85,
    "ticketAverage": 27647.05,
    "percentageOfDay": 8.5,
    "intensityRatio": 0.85
  },
  {
    "dayOfWeek": 1,
    "hour": 15,
    "salesAmount": 2800000.00,
    "transactions": 110,
    "ticketAverage": 25454.54,
    "percentageOfDay": 10.1,
    "intensityRatio": 1.00
  }
]
(Donde dayOfWeek mapea 1 = Lunes, 7 = Domingo; hour mapea de 0 a 23; e intensityRatio es el valor de 0.00 a 1.00 que calcula el backend para asignar la clase de opacidad en CSS).