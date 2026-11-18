---
name: diseno-sistemas
description: Lenguaje visual y de UX para sistemas de gestión (CRM, ERP, tableros internos, portales B2B), en escritorio y celular. Sacado de 14 referencias (Axon, CloseCRM, Gr8r, Loops, Finora, Tessera, Solexa y apps móviles) analizadas por 15 agentes. Usar SIEMPRE al diseñar, rediseñar o revisar una pantalla, tablero, lista, ficha, calendario, formulario, hoja lateral o vista de celular de un sistema de gestión; también al decidir colores, tipografía, radios, espaciados, estados o botones.
---

# Diseño de sistemas: un solo lenguaje para todos

Neutro en la base, **vivo en los datos**. La estructura (fondos, menú, bordes) es calma y neutra, y encima los datos tienen color, forma y movimiento: gráficos, avance, personas y proyectos con su color. **Una pantalla sin gráficos, sin color por entidad y sin un protagonista se siente muerta**. Ver la sección "Vida" y abrir 06, 07, 08 y 14 antes de diseñar un tablero. Varios sistemas de una misma empresa se sienten de la misma familia porque comparten tokens, tipografía, radios, estados y piezas. Lo que cambia por sistema es el acento y el **tinte de los neutros**.

**Neutro no quiere decir gris.** La base puede tener el tono que pida la marca o el uso de cada sistema:
- **Tinte de marca:** fondo con un leve tinte del acento, por ejemplo un violeta o un azulado muy suave.
- **Fondo con tono:** un fondo con tono y un menú de marca oscuro y apagado (por ejemplo azul marino) en vez del blanco plano.
- **Cálido o frío** según el rubro.
- **Oscuro** para monitoreo.

La regla es la saturación y el contraste, no el color: los neutros llevan croma muy bajo (OKLCH C ≤ 0,02, o hasta ~0,03 en el lienzo), siempre del mismo tinte en todo el sistema. Tienen que dejar que los estados y el acento se lean como lo único con color de verdad. Los hex grises de este documento son el punto de partida, no una obligación: cada sistema arma su rampa de neutros con su tinte (ver `tokens.css`).

- Tokens listos para pegar: `tokens.css`. Nombres en español (`fondo`, `superficie`, `tinta`, `texto-2`, `acento`, `verde-fondo`…).
- **Ejemplos** en `ejemplos/`:
  - `tablero-crm.html`: pantalla completa de un CRM.
  - `componentes.html`: galería de todas las piezas, con claro, oscuro y celular.
  - `recetas-tailwind.md`: las piezas en React + Tailwind v4 para copiar.

  Abrilos y superalos.
- Capturas de referencia: `referencias/01…14-*.jpg`. Abrí la que corresponda antes de diseñar algo parecido.
- Análisis completo por tema, con valores y ejemplos: `analisis/01-estructura.md` … `analisis/15-homogeneidad.md`. Leé el del tema que estés tocando.

Si existe `marcas.local.md` en esta carpeta, leelo primero: tiene el acento, el tinte y las reglas propias de cada marca de quien usa la skill. Lo que diga ahí manda sobre los valores de ejemplo de este documento.

**Receta rápida para una pantalla nueva:**
1. Elegí qué pantalla es (tablero, lista, ficha, calendario, formulario, celular) y abrí su referencia y su ejemplo en `ejemplos/`.
2. Definí el acento y el tinte de los neutros del sistema (`tokens.css`).
3. Armá el marco: barra lateral sobre el lienzo y el panel con migas de pan.
4. Escribí la cabecera: título display grande y liviano, subtítulo con cifras reales, un solo botón relleno.
5. Fila de 3 a 6 KPIs: uno protagonista y el resto en bandeja con tarjeta adentro, cada uno con su dibujo.
6. Cuerpo: tarjetas de entidad para lo que está en curso, tabla o lista para el resto y un panel lateral de contexto.
7. Dale vida: color por entidad, avatares, un gráfico con estado y movimiento al cargar.
8. Diseñá los estados vacío, cargando y error (sección 6b).
9. Probala a 390 px y en oscuro.
10. Pasá la lista de la sección 8, comparándola al lado de las referencias.

Principios de base: fricción cero, una acción principal por pantalla, nada de textos de relleno, y todo botón que lleva a una lista te deja parado en la fila que corresponde.

## 1. Marco de la app (referencias 02, 03, 07, 13)
- El lienzo es `bg-fondo` (#F4F4F5). La barra lateral va **directo sobre el lienzo**, de 240–256 px.
- El contenido va en un panel `bg-panel` o `bg-superficie`, `rounded-[var(--radius-marco)]`, separado 8 px del borde y de la barra, con borde de 1 px.
- **Barra lateral:**
  - Arriba, logo o selector de empresa. Opcionalmente, buscador ⌘K.
  - Grupos con rótulo de 11 px en `texto-3`, mayúscula y `tracking-wider`.
  - Ítems de 32–36 px con ícono de 16 px gris y conteo gris a la derecha.
  - El ítem activo es una pastilla `bg-superficie` (o `bg-tinta text-white`): nunca color de marca.
  - Usuario (avatar, nombre y rol) al pie.
- **Barra superior del panel:** 56 px con `border-b`. A la izquierda, migas de pan ("Sección / **Página**", el padre en gris). A la derecha, buscador ⌘K, avisos y avatar.
- **Cabecera de página:**
  - Título de 20–24 px, peso 500–600, `tracking-tight`.
  - Debajo, un subtítulo gris con **cifras reales del estado**: "12 por facturar · 3 vencidas", nunca una descripción genérica.
  - Acciones a la derecha, en la misma fila.
- **Orden vertical fijo:** cabecera → filtros y vista (segmentado) → fila de KPIs → cuerpo.
- **Cuerpo con contexto:** `grid-cols-[1fr_360px]`, con lista o calendario a la izquierda y panel de detalle a la derecha (01, 02, 07).
- **Ficha:** 3 columnas `[1fr_1.6fr_1fr]`, con datos, actividad en pestañas con conteo y la empresa relacionada (03).

## 1b. Vida (lo que hace que no sea una planilla prolija)

Mirá 06 (Gr8r), 07 (Loops), 08 (Finora) y 14 (Solexa). Todo tablero lleva al menos 5 de estos recursos:

1. **Color por entidad.** Cada proyecto, cliente, persona o servicio tiene su color fijo, de la paleta de datos y asignado por id. Aparece en:
   - su ícono o avatar;
   - su barra de avance;
   - su sparkline;
   - la rayita de la tabla.
   Es lo que más vida da (06: cada proyecto y cada persona con su color).
2. **Toda cifra con un dibujo.** Un sparkline con área degradé, una barra de ticks (07: rayitas finas coloreadas hasta el %), una barra segmentada (06: bloques de 1 de 10) o un anillo de avance (09, 13, 14). Un número solo es un número muerto.
3. **Un protagonista por pantalla.** Una tarjeta llena de color con degradé del acento, cifra grande en blanco y un gráfico de línea blanco con un punto marcado (08 "Total Expenses", 09 "halfway there").
4. **Tarjetas de entidad**, no solo tablas. Para lo que está "en curso" (proyectos, servicios, oportunidades grandes) van tarjetas en grilla como en 06:
   - pastilla de prioridad y etiquetas;
   - título grande con descripción de 2 líneas;
   - barra segmentada con "3 de 6 hechas · Vence 15 dic";
   - sparkline de actividad;
   - "Próximos pasos" con checks y "+ Agregar".
5. **Gente con cara.** Foto o avatar ilustrado. Si no hay, monograma de color. Pilas de avatares superpuestos para participantes. El equipo va en tarjetas con su barra de carga (06 "Team").
6. **Gráficos con estado.** La barra o el punto activo va sólido y el resto rayado o tenue. Tooltip oscuro con "valor | participación | vs. otro" (08). Mes en curso rayado "MTD" (07).
7. **Fondo con clima.** Un degradé muy suave del tinte del sistema en la parte de arriba del panel (08), o una foto o ilustración en la franja de cabecera (14) o en la tarjeta de promo o plan (06 y 14, ilustración de línea).
8. **Movimiento con propósito.** Al cargar, las cifras cuentan hasta su valor (~600 ms), las barras crecen desde 0 y las líneas se dibujan. Al pasar el mouse, la tarjeta sube 1–2 px y el borde se marca. El éxito se ve en el lugar con un toast. Todo `ease-out` y respetando `prefers-reduced-motion`.

9. **Bandeja con tarjeta adentro (lo que se ve "premium").** El KPI no es una caja plana: es una bandeja `bg-suave` con radio 16 y padding 4 que lleva:
   - arriba, el rótulo con ícono y ⋯ sobre la bandeja (07);
   - adentro, una tarjeta blanca con radio 12, el número y su dibujo;
   - abajo, el pie sobre la bandeja con ícono, contexto y delta (06).
   Mismo patrón para los íconos: un cuadrado blanco de 36–40 px con borde y sombra mínima, sobre la bandeja (08).
10. **Aire.** Padding generoso (20–24 en tarjetas grandes) y gaps de 16–20. Cifras de 28–40 px. Lo premium respira: si se ve apretado, sacá cosas antes que achicar.

**Límite:** el color vive en los datos, las entidades y un protagonista. El marco (menú, fondos, bordes, textos) sigue neutro.

## 2. Tipografía (análisis 02)
- **Dos voces, no una:**
  - **Display** para títulos, saludo y cifras: una geométrica o grotesca con carácter como Outfit, General Sans, Satoshi o Plus Jakarta (08 usa una de este tipo).
  - **Texto** para la interfaz: Plus Jakarta Sans, Manrope o Inter.
  - **Mono** con personalidad (JetBrains Mono, Geist Mono) para códigos (PR-0241, FAC-01101) y, en tableros técnicos o de monitoreo, también para las cifras (14).
  - Geist o Inter solas quedan "básicas".
- **Títulos grandes y livianos:** el saludo o título de página va a 36–44 px en peso **400**, con `tracking-tight` (06 "Good evening, Alex", 08). Lo grande no necesita negrita.
- Escala: **11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40**. Una tarjeta no mezcla más de 3 tamaños.
- Pesos: 400 texto y títulos grandes, 500 títulos de tarjeta y acciones, 500–600 cifras. Nada de 700.
- **Dato = rótulo gris de 12–13 px arriba y valor `tinta` de 14 px abajo.** Nunca "Rótulo: valor" en la misma línea dentro de una ficha.
- Cifras con `tabular-nums`, montos alineados a la derecha. **El símbolo de moneda, los centavos y la unidad** van en `texto-3`, un paso más chicos: `$ 24.957`<span>,81</span>.
- Metadatos en una línea de 12 px gris, unidos con " · ": "Cobranzas · FAC-01101 · hace 2 min".
- La mayúscula queda solo para los rótulos de grupo del menú. Encabezados de tabla, botones y pestañas van en minúscula inicial.

## 3. Color (análisis 03)
- Hay tres planos (`fondo` → `panel` → `superficie`) y la profundidad sale del tono más un borde de 1 px y sombras mínimas (ver la sección 4).
- **Neutros a medida de cada sistema:**
  - **Una sola rampa:** cada sistema elige el tinte de sus neutros (de su marca o de su uso) y lo usa en toda la rampa: fondo, panel, bordes y los tres textos.
  - **Croma bajo:** el tinte tiene que notarse como "clima", no como color. Si el fondo compite con una pastilla de estado, está demasiado saturado.
  - **Sin mezclas:** nunca combinar una rampa fría y una cálida en el mismo sistema.
  - **Puede ir más allá del gris:** un fondo con tono o un menú oscuro de marca también son válidos. La condición es que el contenido siga en superficies claras y legibles, con los estados como la única nota fuerte.
- Texto en `tinta` / `texto-2` / `texto-3`, que son neutros con el mismo tinte. Prohibido `#000` sobre `#FFF`.
- **Un solo acento por sistema**, usado solo en el botón principal, el toggle, el foco, el punto de no leído y la pestaña activa del celular. Nunca en títulos, fondos de tarjeta ni el menú.
- **Acento por sistema:** cada sistema o empresa tiene un solo acento (su color de marca). Si no tiene marca definida, grafito `#18181B`. El resto de la skill es igual para todos.

- **Estados = pastilla:** fondo al 10 % + texto saturado + punto de 6 px. Nunca un fondo saturado con texto blanco y **nunca solo color**: siempre con palabra.
  - Verde: hecho, cobrado, en línea.
  - Ámbar: pendiente, parcial, por vencer.
  - Rojo: vencido, falló, sin conexión.
  - Azul: en curso, informativo.
  - Gris: borrador, anulado, reintegrado.
- **Lo normal no se colorea.** El rojo es solo para lo que exige actuar. Si hay más de 3 rojos en la pantalla, se agrupan en un aviso.
- **La paleta de datos** (`dato-1…6`, máximo 6) vive solo en gráficos, barras de progreso e íconos de tipo. En una tabla se repite como rayita de 3 px, nunca pintando la fila.
- Lo proyectado, parcial o no seleccionado va **rayado o al 30 %**; lo real, sólido. Por ejemplo, el mes en curso "MTD" (07, 08).
- Como máximo **una** tarjeta héroe rellena de color por pantalla (08, 09).
- Antes de terminar, contá los colores: grises + 1 acento + hasta 4 de estado + hasta 6 de datos.

## 4. Superficies, radios y espacios (análisis 04)

**Radios en capas.** Cada nivel adentro va un poco menos redondeado que el que lo contiene (radio interno ≈ radio externo − padding). No inventar otros valores:

| Elemento | Radio |
|---|---|
| Marco de la app (todo el sistema en una caja) | 26 |
| Panel principal | 20 |
| Tarjeta / bandeja / hoja | 20 |
| Tarjeta dentro de la bandeja | 16 |
| Botón / campo / buscador / ícono en cuadro | 11–12 |
| Botón chico / pastilla / etiqueta | 7–9, o redonda para filtros y "+12 %" |

En celular, las tarjetas van a 20–24.

**Espacios.** Escala 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40, sin 10, 14 ni 18.
- Padding: 16–20 en tarjeta (12 si es densa o en celular) y 26–28 en panel.
- Gap de grilla: 14.
- Entre bloques grandes: 28.
- Entre secciones: 32–40 de aire más un título. Nunca una línea gruesa ni un fondo de color.

**Bordes y sombras.**
- Borde siempre de 1 px `borde`. Nada de 2 px ni bordes de color, salvo el foco.
- **Sombras en tres niveles, siempre suaves y del tono de la tinta (nunca negro puro):**
  - **Mínima** (`0 1px 2px /.05`): en botones con borde, la tarjeta dentro de la bandeja, el ítem activo del menú y los íconos en cuadro. Es lo que les da "relieve" premium.
  - **Al pasar el mouse** (`0 14px 30px -18px /.3`, junto con subir 2 px): en las tarjetas clickeables.
  - **Flotante** (`0 24px 48px -16px /.22`): en menú, hoja, modal y toast. El botón negro principal lleva sombra propia y un brillo arriba (`inset 0 1px 0 /.12`).
  - Una tarjeta quieta de contenido va con borde, sin sombra grande.

**Subdivisiones.** Para subdividir una tarjeta, usá bandas a todo el ancho (`border-t` o un fondo `suave`) o el patrón bandeja + tarjeta blanca (ver "Vida", punto 9). Lo que no va es apilar tres niveles de cajas con borde. Las métricas en fila se separan con `divide-x`.

## 5. Piezas

### Tarjeta KPI (06, 07, 13, 14 · análisis 06)
- Lleva **rótulo + número + línea de contexto**, siempre. Un número sin su "de qué" o "respecto de qué" no va.
- El número va en `tinta` (24–28 px, 600, `tabular-nums`). El color va solo en el delta, la pastilla o la barra.
- **El delta** dice su período ("+12 % vs. mes anterior", "+3 esta semana"), lleva flecha ↗/↘ y su color sale de si es **bueno o malo para el negocio**, no del signo: si baja la mora, es verde.
- Si hay algo vencido, el pie lleva un ícono de alerta y un texto rojo con cuántos ("2 vencidas · Requiere atención").
- El avance contra una meta va como barra fina de 3–6 px + "3 de 6" o "71 % de lo esperado". Nunca una torta.
- Van en filas de 3 a 6 del mismo tamaño. Cada una lleva a su lista filtrada (pie clickeable o ↗).

### Listas y tablas (01, 07 · análisis 08)
- **Tabla:**
  - Sin líneas verticales.
  - Encabezado de 12 px gris en `bg-suave` (o solo hairline: elegí uno por sistema).
  - Filas de 40 px con `divide-divisor`.
  - Montos a la derecha y estado en pastilla, como máximo 2 pastillas por fila (estado + prioridad).
- **Lista de actividad o avisos:**
  - Filas de dos líneas, de 56–64 px.
  - Tile de ícono de 32–40 px con fondo de estado al 10 %.
  - Título y metadatos.
  - Acción en línea.
  - ⋯ a la derecha.
- Las listas temporales se agrupan con "Hoy / Ayer / Esta semana".
- **No leído** es un punto `acento` de 6 px a la izquierda. Junto al título va "78 sin leer · Marcar todo leído".
- Los textos largos se truncan con `truncate` y se ven completos en la ficha.
- **Terminado** es un check verde relleno en lugar del círculo vacío. Las tareas no se tachan. Solo se tachan, en gris, los montos anulados.

### Acciones (01, 02, 06 · análisis 10)
- **Un solo botón relleno por pantalla**, arriba a la derecha. Los secundarios van en `bg-superficie border`, de 32–36 px, radio 10, con ícono de 16 + texto de 13–14 en peso 500.
- **La acción de la fila va en la fila**, de 24–28 px. Solo se rellena la que resuelve una decisión pendiente (Aprobar, Cobrar, Facturar), y hay como máximo 2 visibles por fila.
- **Menú ⋯** con grupos separados por línea: lo reversible arriba, silenciar u ocultar en el medio, ajustes o borrar al final. Los atajos de teclado van a la derecha.
- **Éxito en el lugar:**
  - La fila se tiñe de verde tenue y el botón pasa a ser una pastilla "✓ Aprobado". La fila no desaparece en el momento.
  - Aparece un toast abajo a la derecha que dice qué pasó, con el ID y el monto, más la consecuencia ("Quedó en Cobranzas"), **Deshacer** y ×.
- **Deshacer antes que confirmar.** El modal queda solo para lo irreversible.
- "+ Agregar …" va al final de su propia lista, en gris.
- Correo, teléfono y Meet van como botones cuadrados de 36 px, solo ícono, con tooltip.
- Nunca un botón deshabilitado sin decir por qué: si no aplica, no se muestra.

### Selector segmentado
- Lo usa todo cambio de vista o período de 2 a 4 opciones (Día/Semana/Mes, Mes/Año, Todos/Míos).
- Es un riel `bg-suave` con la opción activa en pastilla `bg-superficie shadow-pastilla`. En oscuro, la activa es pastilla blanca con texto negro.
- Las pestañas de una ficha llevan conteo gris: "Actividad 16".

### Formularios y ajustes (01, 04 · análisis 11)
- Las ediciones secundarias se abren en una **hoja lateral derecha** de 380–440 px, sin cambiar de página.
- **Pie de la hoja:** "Volver a lo predeterminado" como enlace a la izquierda; Cancelar (con borde) y Guardar (relleno) a la derecha.
- **Preferencias por canal:** tabla de casillas con eventos en las filas (título y explicación gris) y canales en las columnas.
- Las opciones binarias son toggles con su explicación debajo. Los selects llevan ícono.
- **Ajustes en dos niveles:** columna interna con grupos (Personal / Empresa / Integraciones) y el contenido a la derecha.
- El uso contra un límite va como barra apilada con leyenda de punto + valor.

### Calendario (02, 10 · análisis 09)
- **Eventos:** tarjeta `superficie` con borde y el ícono del proveedor (Meet) en color, o fondos pastel por tipo con texto `tinta` (10). Nunca saturados.
- **Ahora:** línea negra con la pastilla de la hora; el encabezado del día de hoy va en negro.
- **Panel derecho "Próxima reunión":** agenda, link, duración, anfitrión, participantes y notas. Al pie, "Reprogramar" (con borde) y "Unirse" (relleno).
- **Filtros:** chips redondos, con el activo en negro.

### Celular (09, 11, 12 · análisis 12)
- Fondo `#F2F2F2`, tarjetas `superficie` `rounded-2xl` sin borde y márgenes de 16 px.
- **Arriba:** saludo o título centrado con botones circulares de 40 px. Debajo, **la cifra protagonista** de 32–36 px con su delta.
- **Contenido:**
  - Accesos rápidos en grilla de 3–4 (ícono + rótulo).
  - Secciones con "Ver todo".
  - Filas con tile de 40 px, dos líneas y monto a la derecha.
- **La acción principal es una píldora negra a todo el ancho**, fija abajo, de 52–56 px con `pb-[env(safe-area-inset-bottom)]`. También puede ser un botón flotante de acento.
- La barra inferior es de 4 íconos, con la pestaña activa en pastilla de acento.
- Los toques miden 44 px como mínimo.

### Gráficos (05, 07, 08, 14 · análisis 07)
- Ejes mínimos, grilla tenue y sin bordes.
- La leyenda va arriba, con punto + nombre (+ valor).
- Barras apiladas por canal o estado. El ítem activo va sólido y el resto rayado o tenue.
- Tooltip oscuro con el valor, la participación y la comparación.
- Sparklines sin ejes dentro de las tarjetas.

### Oscuro (14)
- Los fondos suben de luz por capa: #0A0A0A → #111113 → #18181B, con borde #27272A y **sin sombras**.
- Las barras normales van en gris claro y se colorean solo con un estado.
- Si hay foto, va solo en la franja de cabecera (~150 px) con degradé hacia el fondo y los controles en pastillas translúcidas encima. **Nunca hay foto detrás de cifras o tablas.**

## 6. Textos e íconos (análisis 14)
- **Un solo juego de íconos con dos pesos: Phosphor** (`@phosphor-icons/react` o `@phosphor-icons/web`). La versión *regular* va en todo lo normal y la *fill* en el ítem activo del menú y dentro de los cuadritos de color. El tamaño es 17 px en el menú y los botones, y 14–15 px en botones chicos y pies de tarjeta. Prohibido mezclar juegos de íconos.
- **Íconos grises en la interfaz.** El color va solo:
  - dentro de un cuadro de estado o de tipo;
  - en el cuadradito de color de cada entidad, con el ícono relleno en blanco (proyectos del menú, títulos de tarjeta);
  - en el logo del proveedor (Meet, Gmail) dentro de un cuadro blanco con borde.
- **Cada ícono dice algo:** billetera para el pipeline, sello para lo ganado, diana para la tasa, teléfono para los seguimientos, tendencia ↗/↘ para la variación. Nada de un ícono genérico repetido.
- Avatares con foto, ilustración (estilo de 06) o monograma pastel con iniciales. Varios juntos van en pila superpuesta con borde blanco de 2,5 px.
- Títulos funcionales que dicen qué hay. Saludo personal solo en el inicio ("Buenas tardes, Ana").
- Metadatos útiles: "3 de 6 hechas · Vence 9 dic", "hace 2 min", "vuelve mañana 09:00".
- Sin taglines, ayudas obvias ni rótulos de relleno.

## 6b. Vacío, cargando y error (toda pantalla los tiene)
- **Cargando:** esqueletos con la forma final (bloques `bg-suave` con brillo suave que pasa), nunca un spinner en el medio de la pantalla. Si tarda menos de 300 ms, no mostrar nada.
- **Vacío:** ilustración de línea chica (como la tarjeta de plan de 06), una frase que dice qué va a aparecer acá y el botón que lo crea: "Todavía no hay oportunidades. Cargá la primera y aparece en el pipeline. [+ Nueva oportunidad]". Si un filtro es lo que deja la pantalla vacía, decirlo y ofrecer limpiarlo.
- **Error:** en el lugar, no en un modal. Qué pasó en palabras de la persona y "Reintentar". Los datos que ya estaban quedan a la vista.
- **Guardando:** el botón dice "Guardando…" con el ancho fijo, y después éxito en el lugar (fila teñida y toast con Deshacer).

## 6c. Formato de datos
- **Números:** usar `Intl.NumberFormat` con el idioma del sistema (en español: `1.234.567,89`). Montos grandes en tarjetas, abreviados ("US$ 184,2 mil", "$ 1,2 M"), y completos en tablas.
- **Moneda:** siempre con su símbolo o código ("US$", "$"). Si conviven monedas, el código va en gris y nunca se suman.
- **Fechas:** relativas si son cercanas ("hace 2 min", "ayer 16:00", "mañana") y cortas si no ("9 dic", "9 dic 2025" si es de otro año). Hora en 24 h donde se use así.
- **Porcentajes y deltas:** "+12,4 %" con espacio fino antes del %, flecha y período.
- **Vacíos:** "—" en gris, nunca "0" si no hay dato, ni "null" o "undefined".

## 6d. Accesibilidad y uso real
- Contraste AA: el texto normal sobre su fondo da 4,5:1 o más. `texto-3` solo para metadatos, nunca para texto que haya que leer para decidir.
- Foco visible en todo lo clickeable: anillo de 2 px del acento con 2 px de separación (`focus-visible:ring-2 ring-acento/40 ring-offset-2`).
- Toques de 44 px como mínimo en celular. Los íconos sin texto llevan `aria-label` y tooltip.
- El estado nunca va solo por color: siempre palabra, ícono o forma.
- Teclado: ⌘K busca, Esc cierra, Enter confirma, flechas en listas. Las acciones frecuentes no se animan.
- `prefers-reduced-motion`: sin cuentas ni dibujos animados, aparece directo.

## 6e. Del escritorio al celular
- Menos de 1280 px: los KPIs pasan a 2 columnas, las tarjetas de entidad a 2 y el panel lateral baja abajo.
- Menos de 768 px:
  - Sin barra lateral: va barra inferior de 4 íconos con el activo en pastilla.
  - Una columna, con márgenes de 16.
  - La acción principal en píldora negra fija abajo.
  - Las tablas pasan a tarjetas de 2 líneas (título y monto arriba, estado y fecha abajo).
- La cifra protagonista sigue arriba. Lo que se ve primero en celular es lo que hay que hacer hoy.

## 7. Antipatrones (si aparece uno, rehacer)
- Fondos o menús de marca **saturados**, que compiten con los datos. Un tono de marca apagado (azul marino, verde petróleo) sí va. Tampoco van degradés decorativos ni sombras marcadas en tarjetas.
- Neutros de tintes distintos mezclados en un mismo sistema.
- Varios botones rellenos o botones de color por acción (verde guardar, rojo borrar).
- Filas pintadas por estado o pastillas saturadas con texto blanco.
- Estado comunicado solo con color.
- Encabezados de tabla en MAYÚSCULA negrita, grillas con líneas verticales o tarjetas dentro de tarjetas.
- KPI sin contexto, porcentaje sin período o número coloreado.
- Torta para mostrar avance.
- Una sola letra "neutra" (Geist o Inter sola) en todo, o tres o más familias. Van dos voces (display + interfaz) y una mono. Tampoco 700 en todos lados.
- Íconos de juegos mezclados, o todos del mismo peso sin un activo relleno.
- Formularios que reemplazan la página para editar algo menor.
- Modal de confirmación para algo reversible.
- Foto detrás de datos o texto blanco sobre foto sin degradé.

## 8. Antes de entregar una pantalla
1. ¿Hay un solo botón relleno? ¿Las acciones de la fila están en la fila?
2. ¿Tiene vida? Color por entidad, cifras con dibujo, un protagonista, caras y movimiento al cargar. ¿Usa la letra display con títulos grandes y livianos? Ponela al lado de 06 y 08: si se ve más pobre o más plana, no está terminada.
2b. ¿La cabecera tiene un subtítulo con cifras reales? ¿Cada KPI tiene contexto y lleva a su lista?
3. ¿Los colores entran en el conteo (1 acento, estados con palabra, datos ≤ 6)? ¿Lo normal quedó neutro, con el tinte del sistema, y los estados siguen siendo lo único que resalta?
4. ¿Los radios van en capas (26/20/16/12/8)? ¿Los espacios están en la escala? ¿Las sombras son suaves en sus tres niveles? ¿Los íconos son de un solo juego, con el activo relleno?
5. ¿Los montos llevan `tabular-nums`, van a la derecha y tienen la moneda y los centavos en gris?
6. ¿Toda acción reversible tiene Deshacer y el éxito se ve en el lugar?
7. ¿Funciona a 390 px de ancho (toques de 44 px, acción fija abajo) y en oscuro? ¿Tiene sus estados vacío, cargando y error? ¿Los números y fechas tienen el formato de la sección 6c?
8. Probala en el navegador, compará contra la referencia del mismo tipo de pantalla y mirá a 2× los bordes, las alineaciones y los números.
