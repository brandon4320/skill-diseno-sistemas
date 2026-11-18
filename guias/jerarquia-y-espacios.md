> Cuando un valor de esta guía choque con SKILL.md (escala de letra 11/12/13/14/16/20/24/32/40, espacios `--espacio-*`), manda SKILL.md.

# Jerarquía y espacios: cómo ordenar la información

La guía más importante de la skill. Los colores, los radios y las sombras hacen que una pantalla se vea linda; **la jerarquía hace que se entienda**. Una pantalla con buena jerarquía se lee en cinco segundos: qué pasa, qué hay que hacer y dónde se hace. Si a los cinco segundos alguien no puede decirlo, no se arregla con color: se arregla con orden, aire y peso.

Leela antes de armar cualquier pantalla y volvé a la tabla de la sección 9 cada vez que dudes dónde va el énfasis. Las referencias citadas están en `referencias/` (06, 07, 08 y 14 son el piso de terminación). Los ejemplos usan la marca inventada **Estudio Faro** (estudio de diseño; clientes Orbe Retail, Casa Lumen, Mesa Fina, Grupo Atlas; equipo Ana Ruiz, Sofía, Lucía, Tomás).

---

## 0. La regla en una línea

**Una pantalla, una pregunta. Un bloque, un foco. Un texto, un trabajo.**

- La pantalla responde una pregunta ("¿qué tengo que cobrar esta semana?"). El título y la primera fila la contestan.
- Cada bloque tiene **un solo** elemento que se ve primero. Todo lo demás lo acompaña.
- Cada texto hace un solo trabajo: nombrar, informar un dato, describir el estado o disparar una acción. Si un texto no hace ninguno de los cuatro, se saca (ver "Sin textos de relleno" en SKILL.md).

---

## 1. Antes de dibujar: clasificá todo en tres pilas

Antes de abrir el editor, listá todo lo que la pantalla podría mostrar y repartilo en tres pilas. Esto decide el orden, el tamaño y la densidad de todo lo que sigue.

| Pila | Qué es | Dónde va | Cuánto pesa |
|---|---|---|---|
| **Actuar** | Lo que hay que hacer hoy: vencido, por aprobar, por cobrar, la próxima reunión | Arriba y a la izquierda, o en el panel derecho fijo | Máximo. Con acción en la misma fila |
| **Saber** | El estado del negocio: cifras, avance, tendencias | Fila de KPIs y gráficos | Alto, pero sin acción propia (cada KPI lleva a su lista) |
| **Consultar** | Historial, detalle, configuración, todo lo demás | Abajo, en tablas, pestañas o la ficha | Bajo. Densidad alta, todo gris salvo el nombre y el monto |

**Regla:** si la pila *Actuar* está vacía, la pantalla lo dice ("Nada vencido · 3 cobros entran esta semana") y no inventa urgencias. Si tiene más de 7 cosas, se agrupan ("12 por facturar") y la cifra lleva a la lista.

> **Antes:** "Inicio" con 6 KPIs, un gráfico grande, una tabla de 40 movimientos y, al fondo, "2 tareas vencidas".
> **Después:** el subtítulo dice "2 tareas vencidas · reunión con Orbe en 40 min"; la reunión va en el panel derecho con "Unirme"; las vencidas encabezan la lista de pasos con la fecha en rojo; los KPIs bajan a segundo plano visual (bandeja gris), y la tabla de movimientos pasa a "Ver todo".

---

## 2. Sectorizar: qué va junto y con qué se separa

### 2.1 Qué va junto

Agrupá por **la pregunta que contesta**, no por el tipo de dato. "Cobranzas de Orbe Retail" junta facturas, pagos y el contacto de pagos; no se parte en "Facturas" por un lado y "Contactos" por otro.

- Va junto lo que se **mira a la vez para decidir algo**: la cifra, su contexto y su delta; la tarea, su fecha y su responsable; el evento, su hora y su link.
- Va junto lo que **se edita a la vez**: todos los datos de facturación de un cliente en un bloque; nada de dispersarlos en tres pestañas.
- Va separado lo que **cambia a ritmo distinto**: lo que se mueve cada hora (actividad, avisos) no comparte bloque con lo que cambia una vez por mes (datos fiscales, plan).

### 2.2 Las cinco herramientas para separar, de la más débil a la más fuerte

Usá **la más débil que alcance**. Cada nivel que subís agrega ruido. Una pantalla que separa todo con tarjetas con borde se ve como una planilla de cajitas.

| Fuerza | Herramienta | Valores | Cuándo |
|---|---|---|---|
| 1 | **Aire** | 8–12 entre ítems de un grupo; 16–24 entre grupos dentro de una tarjeta | Siempre primero. Separa dato de dato, paso de paso |
| 2 | **Divisor** | 1 px `divisor` (#eef0f3), a todo el ancho o con sangría igual al texto | Filas de una lista o tabla; nunca entre un título y su contenido |
| 3 | **Banda o bandeja** | Fondo `suave`/`bandeja` a todo el ancho de la tarjeta, o bandeja con radio 16 y padding 4 | Subdividir una tarjeta (gráfico dentro de la tarjeta de proyecto en 06; pie del KPI) |
| 4 | **Tarjeta** | `superficie` + borde 1 px + radio 20, padding 16–20 | Un bloque que se entiende solo y se puede mover de lugar |
| 5 | **Título de sección + aire** | Título 16–20 px display 500, 32–40 de aire arriba, 12 abajo | Cambio de tema dentro de la página: "Proyectos en curso", "Equipo" |

**Reglas de sectorización:**
1. **Nunca dos herramientas fuertes juntas para lo mismo.** Tarjeta con borde *y* título grande *y* fondo de color para un solo bloque es triple separación. Elegí tarjeta + título chico, o título de sección + aire.
2. **Nunca tres niveles de cajas con borde.** Panel → tarjeta → tarjeta con borde es el máximo; el tercer nivel va como banda o bandeja, sin borde propio (salvo la tarjeta blanca dentro de la bandeja, que es el patrón premium de SKILL.md §1b.9).
3. **Las secciones de una página se separan con aire y título, nunca con una línea gruesa ni un fondo de color.**
4. **Una tarjeta = un tema.** Si una tarjeta necesita dos títulos, son dos tarjetas.
5. **El marco se separa por tono, el contenido por aire.** Lienzo → panel → tarjeta suben de luz 2–4 %; dentro de la tarjeta ya no se cambia de tono salvo para una banda.

> **Antes:** ficha de cliente con "Datos", "Contacto", "Dirección", "Fiscal" y "Notas", cada uno en su tarjeta con borde, título de 18 px y divisor debajo del título.
> **Después:** una sola tarjeta "Datos de Mesa Fina" con cuatro grupos separados por 24 de aire y un rótulo de grupo de 12 px gris; sin divisores debajo de los rótulos. Las notas, que cambian todos los días, van a la columna de actividad.

---

## 3. Orden: por importancia y por tarea

### 3.1 El orden vertical de la página es fijo

`cabecera → filtros y vista → KPIs → cuerpo (lo de hoy primero) → consulta`

No se negocia: nunca KPIs debajo de una tabla, nunca filtros debajo de lo que filtran. Así todas las pantallas de todos los sistemas se leen igual.

### 3.2 Dentro del cuerpo, lo de hoy arriba

- **Las listas de tareas o pasos se ordenan por urgencia, no por fecha de carga:** vencido → hoy → mañana → esta semana → después → sin fecha. Lo hecho baja al final o se oculta detrás de "3 hechas".
- **Las listas temporales (actividad, avisos) van de lo más nuevo a lo más viejo**, agrupadas "Hoy / Ayer / Esta semana".
- **Las tablas de consulta se ordenan por la columna que responde la pregunta de la pantalla**: Cobranzas por vencimiento, Pipeline por monto o por fecha de cierre, Equipo por carga.
- **Las tarjetas de entidad (proyectos, servicios) se ordenan por lo que necesita atención:** primero la que tiene algo vencido, después la de vencimiento más cercano.

### 3.3 Izquierda manda, derecha acompaña

- La columna izquierda (ancha, `1fr`) lleva **el trabajo**: lista, calendario, tablero.
- La columna derecha (fija, 340–380 px) lleva **el contexto o lo siguiente**: la próxima reunión, el detalle de la fila elegida, el resumen del plan. Va con sus botones al pie (02: "Reprogramar" con borde + "Unirme" relleno).
- En celular la derecha baja **debajo**, salvo que sea la pila *Actuar*: entonces sube arriba de todo (la próxima reunión en 40 min va antes que los KPIs).

> **Antes:** pasos de un proyecto en orden de carga: "Armar manual de marca (15 dic) · Mockups de fachada (12 dic) · Cerrar paleta con Sofía (vencido) · Presentar 3 rutas (hoy)".
> **Después:** "Cerrar paleta con Sofía — **vencido** · Presentar 3 rutas — Hoy · Mockups de fachada — 12 dic · Armar manual — 15 dic". La primera fila es lo que hay que hacer; la fecha vencida va en rojo 500, el resto en `texto-3`.

---

## 4. Cuántas cosas por bloque

La memoria de corto plazo agarra 4 ± 1 cosas. Pasado eso, se agrupa o se recorta con "+N más". Estos son los topes de la skill:

| Elemento | Tope | Si hay más |
|---|---|---|
| KPIs en una fila | 3–6 (ideal 4) | Segunda vista o segmentado "Ventas / Operación" |
| Tamaños de letra en una tarjeta | 3 | Bajá un nivel a gris en vez de agregar un tamaño |
| Pesos en una tarjeta | 2 (400 y 500; 600 solo en la cifra) | — |
| Colores de estado en una tarjeta | 1 (2 si una es la prioridad) | Agrupar en un aviso |
| Pasos o tareas visibles en una tarjeta | 3–5 | "+ 4 más" en gris, que abre la lista |
| Filas en una tarjeta de lista (no tabla) | 5–7 | "Ver todo" a la derecha del título |
| Pastillas por fila de tabla | 2 (estado + prioridad) | El resto va como texto gris |
| Etiquetas (tags) en una tarjeta | 2 visibles | "+3" |
| Piezas de un metadato | 3 unidas con " · " | Lo cuarto va a la ficha |
| Acciones visibles por fila | 2 | Menú ⋯ |
| Botones rellenos por pantalla | 1 | — |
| Columnas de una tabla operativa | 5–8 | Ocultas en "Columnas", completas en la ficha |
| Ítems de un grupo del menú lateral | 3–7 | Sub-grupo o "Ver más" |
| Series en un gráfico | 3–6 | "Otros" en `dato-6` gris |
| Participantes en pila de avatares | 3–4 | "+5" en un círculo gris |

**Regla:** cuando algo no entra, **se recorta antes que se achica**. Bajar la letra a 11 px para que entren 8 pasos es peor que mostrar 4 y "+ 4 más".

---

## 5. Densidad según el uso

No toda pantalla respira igual. La densidad sale de **cada cuánto se mira y cuánto tiempo**.

| Uso | Ejemplos | Alto de fila | Padding de tarjeta | Letra base | Cifras | Gap |
|---|---|---|---|---|---|---|
| **Vistazo** (se mira 10 s, varias veces por día) | Inicio, tablero de dirección | 34–40 (pasos) | 20–24 | 13–14 | 30–40 | 14–20 |
| **Operación** (se trabaja horas encima) | Cobranzas, Pipeline, bandeja de avisos | 40 (tabla) / 56–64 (lista de 2 líneas) | 16–20 | 13–14 | 24–28 | 14 |
| **Consulta / auditoría** (se busca algo puntual) | Historial, movimientos de caja, registro de cambios | 36–40 | 12–16 | 13 | 14 en la tabla | 12 |
| **Monitoreo** (pantalla siempre abierta) | Estado de equipos, sitios (14) | tarjetas de 180–200 alto en grilla de 4 | 16 | 12–13 | 28–32 mono | 12–16 |
| **Celular** | cualquiera a 390 px | 56–64 (toque de 44 mínimo) | 16 | 15–16 | 32–36 | 12 |

**Reglas de densidad:**
1. **Lo premium respira, lo operativo rinde.** Un tablero de vistazo con filas de 32 px se ve barato; una tabla de cobranzas con filas de 64 px obliga a scrollear de más. Elegí por el uso, no por gusto.
2. **Dentro de una misma pantalla, una sola densidad por zona.** Los KPIs pueden respirar y la tabla de abajo ser densa, pero dos tarjetas lado a lado van con el mismo padding.
3. **La densidad se logra con altura de fila y padding, nunca con letra más chica que 12 px** (11 px solo para rótulos de grupo del menú y la unidad de una cifra).
4. **Si se ve apretado, sacá cosas.** Si se ve vacío, no agregues relleno: subí la cifra o agregá el dibujo (sparkline, barra) que falta.

---

## 6. Ritmo de espacios

### 6.1 La escala

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40`, más las dos excepciones que fija SKILL.md: **14** de gap de grilla y **28** entre bloques grandes. Nada de 10, 18, 22, 30 inventados en el momento.

### 6.2 Proximidad: lo relacionado más cerca que lo distinto

La distancia es la forma más barata de decir "esto va con esto". **El espacio de adentro tiene que ser claramente menor que el de afuera: como mínimo el doble.** Si un título está a 16 de su contenido y a 16 del bloque anterior, flota y no se sabe de quién es.

La escalera concreta, de lo más pegado a lo más suelto:

| Relación | Espacio | Ejemplo |
|---|---|---|
| Rótulo → su valor | 2–4 | "Vence" / "9 dic" |
| Cifra → su contexto | 2–4 | "US$ 41.600" / "69 % de la meta" |
| Título → su metadato | 2–4 | "Identidad Orbe Retail" / "4 de 10 hechas · Vence 9 dic" |
| Ícono → su texto | 8–10 | ícono 17 + "Cobranzas" |
| Ítem → ítem del mismo grupo | 8–12 (o la altura de fila) | pasos de un proyecto |
| Grupo → grupo dentro de una tarjeta | 16–24 | "Participantes" → "Notas" en el panel de reunión |
| Título de sección → su contenido | 12 | "Proyectos en curso 4" → grilla |
| Tarjeta → tarjeta (gap de grilla) | 14 | KPIs, tarjetas de proyecto |
| Bloque → bloque | 28 | KPIs → proyectos |
| Sección → sección | 32–40 + título | "Proyectos" → "Equipo" |
| Borde del panel → contenido | 24 arriba y abajo, 28 a los costados (16 en celular) | `.cont{padding:24px 28px}` |

**Las tres pruebas de proximidad:**
1. **El título está más cerca de lo suyo que de lo anterior.** Título de sección: 32–40 arriba, 12 abajo. Nunca simétrico.
2. **El rótulo está pegado a su valor** (2–4) y lejos del dato siguiente (16+). Si "Teléfono" queda a la misma distancia del número de arriba que del de abajo, no se sabe de cuál es.
3. **Padding interno ≥ gap externo no siempre; padding interno ≤ espacio entre bloques sí.** Una tarjeta con 20 de padding vive en un gap de 14 entre hermanas y 28 hacia el bloque siguiente.

> **Antes:** KPI con rótulo, cifra y "vs. octubre" separados por 12 cada uno, y 12 hasta el KPI vecino. Se lee como seis cosas sueltas.
> **Después:** rótulo → 8 → cifra → 2 → contexto dentro de la tarjeta blanca; pie de la bandeja a 8; 14 hasta el vecino. Se lee como un KPI.

### 6.3 Ritmo vertical

- Todos los bloques del mismo nivel arrancan con el mismo patrón: título 16–20 display 500 + conteo gris + acciones a la derecha, 12 hasta el contenido. Si una sección lo hace distinto, se nota como error.
- Las alturas de fila de una misma lista son iguales. Una fila con dos líneas en una lista de una línea rompe el ritmo: o todas llevan metadato o ninguna.
- Las tarjetas de una fila tienen la misma altura (`align-items:stretch`) y el pie siempre pegado abajo (`margin-top:auto`), aunque el contenido varíe.

---

## 7. Alineaciones y grilla

1. **Un solo borde izquierdo por columna.** El título de la página, los KPIs, los títulos de sección y la primera columna de la tabla arrancan en la misma x. Si el título de una tarjeta tiene 20 de padding y el de la de al lado 16, se ve torcido aunque nadie sepa decir por qué.
2. **El texto se alinea al texto, no al ícono.** En listas con tile de ícono, el metadato de la segunda línea arranca donde arranca el título, no debajo del ícono. Lo mismo el divisor: con sangría igual al texto, o a todo el ancho; nunca a medias.
3. **Los números a la derecha, el texto a la izquierda.** Montos, cantidades y porcentajes alineados a la derecha con `tabular-nums`, para que las unidades queden encolumnadas. El encabezado de una columna numérica también va a la derecha.
4. **Las cifras de una fila de KPIs comparten línea base.** Rótulos del mismo largo o de una sola línea, con `truncate` si hace falta, para que los números no salten.
5. **Título y acciones de la cabecera alineados abajo** (`align-items:flex-end`): el botón se apoya en la línea base del título grande, no en el medio de la fecha de arriba.
6. **Nada centrado en escritorio** salvo estados vacíos y el título de la barra en celular. Párrafos, títulos y cifras van a la izquierda.
7. **Grillas declaradas, no inventadas:**
   - KPIs: `repeat(4,1fr)` o `1.25fr repeat(3,1fr)` cuando el primero es el protagonista.
   - Tarjetas de entidad: `repeat(4,1fr)` → 2 por debajo de 1280 → 1 por debajo de 768.
   - Cuerpo con contexto: `1fr 360px`.
   - Ficha: `1fr 1.6fr 1fr`.
   - Ancho máximo de texto corrido: 64–72 caracteres (`max-width:68ch`).
8. **Columnas fijas para lo que se repite.** El tile de ícono (32–40), el avatar (28–34), la fecha (ancho fijo, a la derecha) y el ⋯ (28) tienen ancho fijo, así el texto variable siempre arranca en la misma x.

---

## 8. Dónde darle relevancia a los textos

Esta es la parte que más se rompe. La regla madre:

> **Pesan tres cosas: el dato, la acción y el nombre. Todo lo demás va en gris.**

- **El dato** es lo que la persona vino a ver: el monto, la cantidad, la fecha de vencimiento, el porcentaje.
- **La acción** es lo que puede hacer: el botón, el link "Ver todo", el "+ Agregar".
- **El nombre** es de quién o de qué se habla: el cliente, el proyecto, la persona, el comprobante.

Rótulos, unidades, monedas, centavos, separadores, conteos, fechas que no apuran, explicaciones, encabezados de tabla, migas de pan del nivel de arriba: **gris**. No porque no importen, sino porque se leen una vez y después se reconocen por posición.

### 8.1 La escalera de énfasis (cinco niveles, fijos)

| Nivel | Qué es | Letra | Peso | Color | Ejemplo |
|---|---|---|---|---|---|
| **1. Protagonista** | La cifra o el título que contesta la pregunta del bloque | 24 / 32 / 40 display | 500 (300–400 si es un saludo o título de página de 36+) | `tinta` | "US$ 41.600", "Buenas tardes, Ana" |
| **2. Nombre** | Título de tarjeta, nombre de entidad, título de fila | 15–20 display (tarjeta) / 13–14 interfaz (fila) | 500 | `tinta` | "Identidad Orbe Retail", "Casa Lumen" |
| **3. Texto** | Contenido que se lee: la frase de un aviso, el paso, una descripción corta | 13–14 interfaz | 400 | `tinta` (descripción de 2 líneas: `texto-2`) | "Cerrar paleta con Sofía" |
| **4. Rótulo** | Lo que dice qué es el dato: rótulo de KPI, rótulo de campo, encabezado de tabla | 12–13 interfaz | 500 | `texto-2` | "Ganado en noviembre", "Vence" |
| **5. Metadato** | Contexto que se consulta: cuándo, dónde, cuántos, unidad | 11–12 interfaz | 400–500 | `texto-3` | "hace 2 min · Cobranzas", "US$", ",81", "kWh" |

**Cómo se usan:**
- **Un nivel 1 por bloque.** Si dos cosas son nivel 1, una baja a 2.
- **Una palanca a la vez.** Para subir un texto un nivel, cambiá *una* cosa: tamaño, o peso, o color. Más grande + más negrita + color de acento es gritar.
- **El orden de las palancas es: posición > tamaño > color > peso.** Lo que está arriba a la izquierda ya pesa; lo grande pesa más que lo negrito; pasar de `texto-3` a `tinta` pesa más que pasar de 400 a 500. El 600 queda para cifras; el 700 no existe.
- **El gris tiene dos tonos y cada uno su trabajo.** `texto-2` para lo que hay que leer para entender (rótulos, descripciones, subtítulo de cabecera). `texto-3` para lo que se consulta o se reconoce (metadatos, unidades, conteos). Nunca `texto-3` para algo que se necesita para decidir (SKILL.md §6d).

### 8.2 Rótulo gris, valor negro (y nunca al revés)

El rótulo dice *qué es*; se lee la primera vez y después se reconoce por lugar. El valor es *lo que cambia*; es lo que se viene a buscar. Por eso:

- Rótulo arriba, 12–13 px, `texto-2`, 500. Valor abajo, 14 px, `tinta`, 400–500. Separación 2–4.
- **Nunca "Rótulo: valor" en la misma línea dentro de una ficha.** En línea solo en leyendas de gráfico y en metadatos ("Deals: 1.2 GB" en 05, con el rótulo gris y el valor negro).
- **Referencia buena: 12** ("Start date" gris chico, "January 25, 2026" negro 600 grande). **Referencia a corregir: 03**, donde "Email", "Phone" y "Address" van más oscuros que su valor: el ojo lee los rótulos, que son siempre iguales, y saltea los datos, que son lo único que cambia. Invertilo.

> **Antes (ficha):** **Teléfono** (14/600 tinta) · +54 11 4567-8901 (14/400 texto-2)
> **Después:** Teléfono (12/500 texto-2) ↓4 · **+54 11 4567-8901** (14/500 tinta) con el botón de llamar de 28 a la derecha.

### 8.3 Cuándo el número es el protagonista y cuándo el texto

Preguntate **qué pregunta contesta el bloque**:

| Si la pregunta es… | Protagonista | El otro va… | Ejemplo |
|---|---|---|---|
| **¿Cuánto?** | El número | El rótulo arriba en gris, el contexto abajo en gris | KPI "Pipeline abierto" → **US$ 184,2 mil** |
| **¿Qué pasó? / ¿qué hago?** | La frase | El número dentro de la frase, en `tinta` 500 o mono | Aviso: "Sofía pidió aprobar **FAC-01101 · US$ 3.840** de Mesa Fina" |
| **¿Quién / cuál?** | El nombre | El número a la derecha, mismo peso o uno menos | Fila: **Casa Lumen** ……… US$ 12.400 |
| **¿Cómo va?** | El avance (barra + "4 de 10") | El nombre arriba como título | Tarjeta de proyecto |
| **¿Cuándo?** | La hora o la fecha | El título del evento arriba, más chico | Panel "Próxima reunión · en 40 min" → **Hoy · 15:30 – 16:15** como dato, título del evento como nivel 2 |

Reglas que salen de esto:
1. **En un KPI el número va solo y grande; el rótulo nunca compite** (06: "Open tasks" 13 gris, "26" grande, "Across 4 active projects" 12 gris).
2. **En una lista de movimientos, nombre a la izquierda y monto a la derecha con el mismo peso (500)**: son las dos columnas que el ojo cruza (07, 11, 12). El método de pago, la fecha y el canal van en gris.
3. **En una tarjeta de monitoreo con muchas iguales, el número manda y el nombre es rótulo** (14: "SPX-001" 13/500, "140.9 kWh" 28 mono). Funciona porque las tarjetas son intercambiables y lo que distingue es la cifra.
4. **En una tarjeta de entidad única (un proyecto, un cliente), el nombre manda** (06: "Orion API Gateway" 20 px) y los números van como avance y metadato.
5. **Si un número no es protagonista, no lo agrandes:** dentro de una frase va en el tamaño de la frase, en `tinta` 500 o en mono si es un código.

### 8.4 Las partes del número que no son el número

En toda cifra hay una parte que importa y partes que acompañan. Las que acompañan van en `texto-3` y **un paso más chicas**:

- Moneda: `US$` / `$` → `texto-3`, 60–65 % del tamaño de la cifra, 400. (11: "$" gris chico.)
- Centavos: en tarjetas y en tablas van completos y en `texto-3`, igual que la moneda (SKILL.md manda). En celular, sin centavos.
- Unidad y denominador: `kWh`, `%`, `/ 20`, `pts` → `texto-3`, 50 % del tamaño (14: "17 / 20").
- El delta: solo el número y la flecha con color; "vs. octubre" en `texto-2` (07: "↗ +15.2%" verde, "vs. prior period" gris).
- Abreviados: "US$ 184,2 **mil**" con "mil" en `texto-3`.

```html
<div class="n num"><span class="mon">US$</span> 41.600<span class="dec">,00</span></div>
<style>
.n{font:500 32px/1.1 var(--display);letter-spacing:-.03em;color:var(--tinta)}
.n .mon{font-size:20px;font-weight:400;color:var(--texto-3);margin-right:2px}
.n .dec{color:var(--texto-3)}
</style>
```

### 8.5 Títulos que dicen el estado

Un título que solo nombra la sección ("Gastos", "Dashboard", "Cobranzas") desperdicia el lugar más leído de la pantalla. **El título nombra; el subtítulo cuenta cómo está.** En la pantalla de inicio o en un informe, el título puede contar el estado directamente (08: "Spending Up, Savings Ahead").

| Antes | Después (título + subtítulo) |
|---|---|
| Cobranzas | **Cobranzas** · "US$ 18.420 por cobrar · 3 vencidas · 2 entran esta semana" |
| Proyectos | **Proyectos en curso 4** · "1 con pasos vencidos · el más cercano vence el 9 dic" |
| Dashboard | **Buenas tardes, Ana** · arriba: "Martes 17 de noviembre"; abajo los KPIs |
| Informe mensual | **Noviembre viene arriba de la meta** · "69 % con 13 días por delante" |
| Equipo | **Equipo 5** · "Tomás con 8 abiertos y 1 vencido" |
| Notificaciones | **Avisos** · "78 sin leer · 4 esperan tu aprobación" |
| Tareas (vacía) | **Tareas** · "Nada vencido. La próxima es mañana 10:00" |

Reglas:
1. **El subtítulo lleva cifras reales**, unidas con " · ", en `texto-2` 13–14. Nunca una descripción ("Gestioná tus cobranzas de forma fácil").
2. **Lo que exige acción va primero en el subtítulo** y puede llevar el color del estado *solo en esa pieza* ("**3 vencidas**" en rojo 500, el resto gris).
3. **El título de una tarjeta lleva su conteo en gris pegado** ("Proyectos en curso **4**" con el 4 en `texto-3`), sin caja.
4. **Un título de estado no reemplaza el dato:** si dice "viene arriba de la meta", el KPI de al lado muestra cuánto.
5. **Nunca un título que mienta por omisión:** si hay vencidos, el subtítulo los nombra aunque la pantalla sea de otra cosa.

### 8.6 Un solo foco por bloque

Cada bloque tiene **un** elemento que se ve primero. Para comprobarlo, entrecerrá los ojos (o aplicá `filter:blur(4px)` a la página): en cada bloque tiene que quedar una sola mancha fuerte, y tiene que ser la correcta.

Cómo se resuelven los empates más comunes:

| Empate | Quién gana | Qué hace el otro |
|---|---|---|
| Cifra grande vs. pastilla de estado roja | La cifra | La pastilla baja al pie, o queda como punto + palabra en 12 px |
| Título de tarjeta vs. botón relleno adentro | El título | El botón pasa a borde, o a la fila; el relleno es uno por pantalla |
| Nombre vs. monto en una fila | Empate permitido (500 y 500), son las dos columnas | Todo lo demás de la fila en gris |
| Dos KPIs con color | Ninguno; color solo en el delta | El número siempre `tinta` |
| Gráfico vs. cifra en la misma tarjeta | La cifra arriba a la izquierda | El gráfico neutro con una sola serie o barra activa sólida (08) |
| Descripción vs. título de tarjeta | El título | Descripción `texto-2` 12–13, 2 líneas con `line-clamp` |
| Alerta vs. todo el bloque | La alerta, *si exige actuar* | Si no exige actuar, no es alerta: gris |

**El color también es foco.** Un rojo en un bloque se lleva toda la atención: usalo solo donde hay que actuar. En 06, el KPI "Overdue" mantiene el "2" en negro y pone el rojo solo en "Needs attention" del pie; en 09, el rojo va solo en la hora de lo atrasado. Eso es foco bien usado: el número es el dato, el rojo es la urgencia, y no compiten.

### 8.7 Qué texto lleva el peso en una fila

Una fila se lee en este orden: **nombre → dato → estado → cuándo → acción.** Asignale el peso en ese orden y nada más:

```
[ícono 32]  Casa Lumen                        US$ 12.400   ● Pendiente   vence 9 dic   [Cobrar]  ⋯
            FAC-01098 · Web · hace 2 días
            ↑ 14/500 tinta                    ↑ 14/500     ↑ pastilla    ↑ 12 gris     ↑ 28 px
            ↑ 12/400 texto-3 (mono en el código)  tinta, der.  ámbar 12/600  (rojo si venció)
```

- **Primera palabra distintiva.** "Casa Lumen — Web" y no "Web — Casa Lumen": el ojo lee 2–3 palabras por fila al bajar (ver 8.8).
- **Los códigos (FAC-01098, PR-0241) en mono `texto-3` dentro del metadato**, salvo en tablas de comprobantes, donde el código es el nombre y va en mono `tinta` 500.
- **Truncá el final, nunca el principio.** "Identidad Orbe Retail: manual de…" sí; "…de marca para 40 locales" no.
- **La fecha se pinta solo si apura**: vencida en `rojo` 500, hoy en `tinta` 500, el resto `texto-3` 400.
- **El anulado se tacha en gris** ($64.00 tachado en 07), nunca se pinta.

### 8.8 Cómo escanea la vista: F y Z

La gente no lee las pantallas de un sistema: las **escanea**. Hay dos recorridos, y cada tipo de bloque tiene el suyo.

**Patrón F: listas, tablas, fichas, avisos.**
El ojo baja por el borde izquierdo y entra a la derecha solo en las primeras filas o cuando algo lo llama.
- La **primera columna** lleva el nombre y la **primera palabra** tiene que distinguir la fila.
- Las primeras 2–3 filas se leen enteras: poné ahí lo urgente (ver 3.2).
- La columna derecha (monto, estado) se lee "en vertical" para comparar: por eso va alineada, con `tabular-nums` y el mismo peso.
- En el medio va lo que se consulta, en gris.
- Lo que llama al ojo hacia la derecha tiene que ser **un estado que exige acción**: un rojo, un botón relleno. Si todas las filas tienen algo de color, ninguna llama.

**Patrón Z: tableros, cabeceras, tarjetas, hojas.**
El ojo va de arriba a la izquierda a arriba a la derecha, baja en diagonal y cruza abajo.
- **Arriba a la izquierda:** qué es y cómo está (título + subtítulo con cifras; rótulo + cifra del KPI).
- **Arriba a la derecha:** la acción principal, o el delta / el ⋯.
- **La diagonal:** el dibujo (gráfico, barra) que conecta.
- **Abajo a la derecha:** la salida — "Unirme", "Guardar", "Ver todo ↗", el delta del pie.
- En una hoja lateral: título arriba a la izquierda, × arriba a la derecha, "Volver a lo predeterminado" abajo a la izquierda, Cancelar + Guardar abajo a la derecha.

**En celular el recorrido es una I:** de arriba abajo, en una columna. La cifra protagonista va primero, después lo de hoy, y la acción queda fija abajo, donde termina la I.

### 8.9 Escribir para el escaneo

El peso visual no sirve si el texto está mal ordenado.
- **Lo distintivo adelante:** "3 vencidas" y no "Hay 3 facturas que están vencidas". "Orbe Retail pidió cambios" y no "Se registró un pedido de cambios de Orbe Retail".
- **Cifras con su "de qué" pegado:** "4 de 10 hechas", "69 % de la meta", "faltan 13 días".
- **Verbos en las acciones:** "Cobrar", "Unirme", "Reprogramar"; nunca "OK", "Aceptar" o "Ir".
- **Una idea por línea de metadato**, máximo 3 piezas con " · ".
- **Sin la palabra del rótulo repetida en el valor:** rótulo "Vence", valor "9 dic" (no "Vence el 9 dic").

---

## 9. Tabla: en este tipo de bloque, el énfasis va en…

| Bloque | Lleva el peso (nivel 1–2, `tinta`) | Va en gris | Color solo en | Ejemplo Estudio Faro |
|---|---|---|---|---|
| **Cabecera de página** | Título (36–44/300–400 en inicio; 22–24/500 en el resto) | Fecha o ceja arriba; subtítulo con cifras | La pieza del subtítulo que exige actuar | "Cobranzas" · "US$ 18.420 por cobrar · **3 vencidas**" |
| **Migas de pan** | La página actual (500 `tinta`) | Las secciones de arriba | — | Estudio Faro / **Cobranzas** |
| **KPI en bandeja** | La cifra (24 o 32/500 display) | Rótulo con ícono (sobre la bandeja), contexto, unidad, moneda | Delta del pie (número + flecha) | "Ganado en noviembre" → **US$ 41.600** → "69 % de la meta" · ↗ +3 cierres |
| **KPI protagonista (relleno)** | La cifra en blanco (34–40) | Rótulo y contexto en blanco al 70–80 % | — (el relleno ya es el color) | "Pipeline abierto" **US$ 184,2 mil** |
| **KPI con alerta** | La cifra (sigue `tinta`) | Rótulo, contexto | Ícono + texto del pie ("2 vencidos · requieren atención") | "Seguimientos" **11** |
| **Tarjeta de entidad (proyecto)** | Nombre (20/500 display) y avance ("4 de 10") | Descripción 2 líneas, etiquetas, metadatos | Barra de avance y sparkline (color de la entidad); fecha vencida | **Identidad Orbe Retail** · ▮▮▮▮▯▯ 40 % |
| **Tarjeta de monitoreo (muchas iguales)** | La cifra (28 mono) | Nombre-código, unidad, sub-métricas | Pastilla de estado y barra si está fuera de rango | SPX-004 **85,3** kWh ● Sin conexión |
| **Tarjeta de persona** | Nombre (15–16/500) | Rol, "1 hecha esta semana" | Barra de carga (color de la persona); "1 vencido" | **Lucía Paz** · Diseñadora · 6 abiertos |
| **Fila de tabla** | Nombre (1.ª col.) y monto (der.), ambos 500 | Encabezados, método, canal, fecha | Pastilla de estado; monto tachado si se anuló | **Mesa Fina** … **US$ 3.840,00** ● Cobrado |
| **Fila de aviso / actividad** | La frase (13–14/400 `tinta`, con nombre e importe en 500) | Metadato "Cobranzas · FAC-01101 · hace 2 min" | Punto de no leído (acento); botón de la decisión | "Sofía pidió aprobar **FAC-01101 · US$ 3.840**" |
| **Lista de pasos / tareas** | El texto del paso (13/400) | Fecha, responsable, "+ Agregar" | Fecha vencida (rojo); check verde al hacerse | "Cerrar paleta con Sofía" · **vencido** |
| **Ficha (datos)** | Valores (14/500) | Rótulos arriba (12/500 `texto-2`) | Pastilla de estado del cliente | Condición IVA / **Responsable inscripto** |
| **Panel "próxima reunión"** | Título del evento (20–22/500) y la hora | "Próxima reunión · en 40 min", rótulos, notas | Punto vivo verde; ícono del proveedor | **Presentación de identidad** · Hoy 15:30 – 16:15 |
| **Gráfico** | La serie o barra activa y su valor | Ejes, grilla, leyenda, meses | Serie activa sólida, el resto rayado o al 30 % | Barra de noviembre sólida, "MTD" rayado |
| **Leyenda / uso contra límite** | El valor ("1,2 GB", "69 %") | El rótulo ("Deals:"), el total | Punto o cuadrito de la serie | Proyectos: **12 GB** de 20 GB |
| **Tooltip** | El valor (blanco 600) | Participación y comparación (blanco 55 %) | El delta negativo/positivo | **US$ 42,8 mil** │ 18 % │ vs. Web −18 % |
| **Toast** | Qué pasó, con ID e importe (13/600) | La consecuencia ("Quedó en Cobranzas") | "Deshacer" (link) | **Cobrado FAC-01101 · US$ 3.840** |
| **Estado vacío** | La frase que dice qué va a aparecer | Nada más | El botón que lo crea | "Todavía no hay propuestas. Cargá la primera…" [+ Nueva propuesta] |
| **Formulario / hoja lateral** | El valor cargado en cada campo y el título de la hoja | Rótulos, ayuda bajo el campo, "Volver a lo predeterminado" | Botón Guardar; error en rojo bajo el campo | Rótulo "Moneda" → **US$** |
| **Menú lateral** | Ítem activo (pastilla blanca, ícono relleno) | Ítems inactivos `#3b3f4a`/`texto-2`, rótulos de grupo, conteos | Cuadritos de color de cada proyecto | **Cobranzas** 12 |
| **Segmentado / pestañas** | La opción activa (pastilla blanca, `tinta`) | Las otras (`texto-2`), conteos (`texto-3`) | — | **Mes** · Semana · Año |
| **Inicio en celular** | La cifra protagonista (32–36) | Saludo chico, contexto, rótulos de sección | Delta; tab activa (acento) | "Por cobrar" **US$ 18.420** ↗ +12,4 % vs. octubre |
| **Fila en celular** | Nombre (15/500) y monto (15/600, der.) | Fecha y método (13 gris) | Tile de estado al 10 % | **Casa Lumen** … **US$ 12.400** / 9 dic · Transferencia |

---

## 10. Antes y después completos

### 10.1 KPI

**Antes**
```
┌──────────────────────────────┐
│ GANADO EN NOVIEMBRE  (11/700 mayúscula, tinta)
│ US$ 41.600,00        (28/700, verde)
│ Respecto al mes anterior subió un 12,4 % (13/400 tinta)
└──────────────────────────────┘
```
Problemas: el rótulo grita en mayúscula negrita; el número está coloreado (el color es del delta, no del dato); el contexto es una oración larga en `tinta` que compite; no hay meta ni dibujo.

**Después**
```
bandeja suave r20 p4
  [◎ 16 texto-3] Ganado en noviembre   (12,5/600 texto-2)            ⋯
  ┌ tarjeta blanca r16 p14·16 ─────────────────┐
  │ US$ 41.600          (US$ 18/400 texto-3 · cifra 30/500 tinta)
  │ 69 % de la meta de US$ 60.000   (12 texto-3, a 2 px)
  │ ▮▮▮▮▮▮▮▮▮▮▮▮▯▯▯▯▯  (ticks 16 alto, a 12 px)
  └────────────────────────────────────────────┘
  [↗ verde] +3 cierres esta semana        (12/500, número verde, resto texto-2)
```

### 10.2 Cabecera de página

**Antes:** "Panel de Cobranzas" (24/700) · "Acá vas a poder ver y gestionar todas tus cobranzas" (14 gris) · 4 botones: [Exportar] [Importar] [Filtrar] [+ Nueva factura] todos rellenos de colores distintos.

**Después:**
- Ceja: "Martes 17 de noviembre" (13/500 `texto-2`).
- Título: "Cobranzas" (24/500 display, `tracking -0.02em`), a 6 de la ceja.
- Subtítulo: "US$ 18.420 por cobrar · **3 vencidas** · 2 entran esta semana" (14/400 `texto-2`, "3 vencidas" en rojo 500), a 4 del título.
- A la derecha, alineados abajo: [Exportar] con borde 36 px · [+ Nueva factura] relleno `tinta`. Importar y Filtrar se van: Filtrar es la barra de filtros de abajo; Importar, al ⋯.
- 28 hasta la fila de filtros.

### 10.3 Fila de una tabla de cobranzas

**Antes:** `FAC-01098 | Casa Lumen | Web | $12400 | 09/12/2025 | PENDIENTE | [Ver] [Editar] [Cobrar] [Anular]` — todo 13/400 `tinta`, estado en mayúscula sobre fondo ámbar saturado con texto blanco, 4 botones.

**Después** (40 px de alto, `divide-divisor`):
- Col. 1 (con avatar-monograma 28 del color del cliente): **Casa Lumen** 14/500, en una sola línea (en tabla no hay metadato debajo).
- Col. 2: `FAC-01098` 12,5 mono `texto-2`.
- Col. 3: "Web" 13 `texto-2`.
- Col. 4, a la derecha: **US$ 12.400,00** 14/500 `tinta`, `tabular-nums`, "US$" `texto-3`.
- Col. 5: pastilla ámbar al 10 % "● Pendiente" 12/600.
- Col. 6: "9 dic" 12,5 `texto-3` (si venció: "venció 9 dic" rojo 500).
- Col. 7: [Cobrar] 28 px, borde (relleno solo si es la decisión pendiente de la pantalla) · ⋯ con Ver, Editar, Anular.

### 10.4 Lista de tareas en celular (390 px)

**Antes:** título "Mis tareas" centrado, 14 tareas en filas de 36 px con letra 12, la vencida mezclada en el medio, botón "Agregar" arriba a la derecha de 28 px.

**Después:**
- Arriba: "Hoy" (20/500) + "5 · 1 vencida" en gris (la vencida en rojo).
- Sección "Vencidas 1": tarjeta blanca r20, fila de 64 px: tile 40 → "Cerrar paleta con Sofía" (15/500) / "Orbe Retail · venció ayer" (13, "venció ayer" en rojo).
- Sección "Hoy 4": cuatro filas iguales; hora a la derecha en `texto-3`.
- "Ver las 9 de esta semana" en gris al pie.
- Píldora negra fija abajo "+ Nueva tarea" 52 px con `safe-area`.

---

## 11. Cómo verificar la jerarquía (antes de entregar)

1. **Prueba de los 5 segundos.** Mostrá la pantalla 5 s a alguien (o a vos con la vista fresca). Tiene que poder decir: qué pantalla es, cómo está y qué hay que hacer. Si no, el título o el subtítulo no dicen el estado (8.5).
2. **Prueba del desenfoque.** `document.body.style.filter='blur(4px)'`: una mancha fuerte por bloque, la cifra o el nombre correcto, y la acción principal reconocible arriba a la derecha.
3. **Prueba del gris.** `filter:grayscale(1)`: la jerarquía tiene que seguir funcionando sin color. Si lo único que distingue lo urgente es el rojo, falta palabra o forma.
4. **Conteo de `tinta`.** En cada tarjeta, contá los textos en `tinta` 500+. Más de 3 es que hay rótulos o metadatos que deberían ser grises.
5. **Conteo de tamaños y pesos.** ≤ 3 tamaños y ≤ 2 pesos por tarjeta (más el 600 de la cifra).
6. **Prueba de proximidad.** Para cada título y rótulo: ¿está más cerca de lo suyo que de lo anterior? Medí en el navegador (al menos el doble).
7. **Prueba del borde izquierdo.** Poné una línea vertical en la x del título de página: KPIs, títulos de sección y primera columna tienen que tocarla.
8. **Prueba del peor caso.** Nombre de 60 caracteres, monto de 9 cifras, 0 elementos, 40 elementos: el foco tiene que seguir en el mismo lugar (truncado, "+N más", estado vacío).

---

## 12. Antipatrones de jerarquía (si aparece uno, rehacer)

- **Todo en `tinta` 500.** Si todo pesa, nada pesa. Rótulos y metadatos a gris.
- **Rótulo más oscuro o más grande que su valor** (como en 03).
- **Número coloreado** en vez del delta, o un KPI entero en verde porque "está bien".
- **Dos protagonistas en un bloque:** cifra grande + pastilla roja grande + botón relleno.
- **Títulos que solo nombran** ("Dashboard", "Panel de control") sin subtítulo con cifras.
- **Lo urgente al fondo** o mezclado por fecha de carga.
- **Espacios simétricos:** título a la misma distancia de lo de arriba que de lo de abajo.
- **Separar con todo a la vez:** tarjeta + borde + título grande + divisor + fondo para un mismo bloque.
- **Achicar la letra para que entre** en vez de recortar con "+N más".
- **Mayúscula negrita para dar importancia.** La importancia sale del tamaño y de la posición, no del grito.
- **Texto corrido centrado** o párrafos de más de 72 caracteres de ancho.
- **Metadatos que necesitan leerse para decidir** escondidos en `texto-3` 11 px.
- **El código adelante del nombre** en listas de personas o clientes ("CLI-0042 Casa Lumen").
- **Truncar el principio** de un texto o cortar el nombre para que entre el metadato.
