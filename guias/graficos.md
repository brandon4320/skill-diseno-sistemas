# Gráficos

Qué gráfico usar según la pregunta, cómo dibujarlo y qué no hacer. Va con SKILL.md §1b (Vida), §3 (Color) y §5 (Gráficos), con `analisis/07-graficos.md` y con las referencias 06, 07, 08, 13 y 14.

**Ejemplo vivo:** `ejemplos/graficos.html` tiene cada tipo hecho en SVG propio, con tooltip, animación de entrada, claro y oscuro, y la versión de celular. Abrilo antes de dibujar uno y copiá de ahí las medidas.

---

## 1. Primero la pregunta, después el gráfico

Antes de elegir, escribí la pregunta que responde el gráfico en una frase. Si la respuesta es un solo número, no hace falta un gráfico: va un KPI con su dibujo chico (rayitas, bloques o sparkline).

| La pregunta | Qué es | Gráfico | Cuándo no |
|---|---|---|---|
| ¿Cómo viene? | Evolución en el tiempo | **Línea con área**, con el período anterior en gris punteado | Menos de 5 puntos: barras o la cifra sola |
| ¿Cuál es más? | Comparación entre categorías | **Barras verticales** (hasta 6) con el valor arriba de cada columna | Nombres largos o más de 6: **barras horizontales de ranking** |
| ¿Quién va primero? | Orden | **Ranking horizontal** numerado, con el líder en color | Si el orden no importa, barras verticales |
| ¿Cómo se reparte cada mes? | Composición en el tiempo | **Barras apiladas** (hasta 3 series) con el mes en curso rayado | Si importa la tendencia de cada parte: una línea por serie |
| ¿De qué se compone? | Partes de un total | **Dona** solo con 2 a 4 partes; **barra de reparto** con 5 o 6 | Más de 6 partes: ranking con "Otros" |
| ¿Llegamos? | Avance contra una meta | **Anillo** (uno protagonista), **rayitas** (continuo, en un KPI), **bloques** (discreto: "3 de 6") | Nunca una torta |
| ¿Cuándo pasa? | Distribución en el calendario | **Mapa de calor por día**, tipo GitHub | Menos de 8 semanas de datos: barras por día |
| ¿Cómo se reparten los valores? | Distribución de una medida | **Histograma**: barras verticales pegadas por rango ("0–15 días", "16–30"…) | Menos de 20 valores: tabla |
| ¿Una cosa mueve a la otra? | Relación entre dos medidas | **Dispersión** con las dos medianas y la tendencia | Menos de 10 puntos: tabla |
| ¿Dónde se pierde? | Conversión por etapas | **Embudo** con el % que pasa entre etapas y la mayor caída marcada | Etapas que no son una secuencia: barras |

---

## 2. Anatomía de la tarjeta de gráfico

De arriba hacia abajo, siempre en este orden:

1. **Título** funcional en display, 17 px, peso 500: "Facturación por mes", no "Análisis".
2. **Subtítulo** gris de 12–13 px con **unidad y período** ("En miles de US$ · ene–nov 2026") y, en la misma línea, la **leyenda**.
3. A la derecha del título: **segmentado** de período o de serie (2 a 4 opciones), el botón de **tabla** y, si lleva a una lista, "Ver todo".
4. **Cifra** de 28–32 px con su **delta** y su período ("+29 % vs. mismo período 2025"). Es la conclusión del gráfico escrita.
5. **El gráfico**: 200–260 px de alto en escritorio, 180–220 en celular.
6. **Pie** opcional, solo si suma: la meta, la mayor caída, la fuente del dato.

Tarjeta: `superficie`, borde de 1 px, radio 20, padding 20 (16 en celular). Sin sombra si está quieta.

---

## 3. Ejes y grilla

- **Eje Y:** de 3 a 5 marcas en números redondos (0 · 20 · 40 · 60). Las barras **siempre** arrancan en 0. Una línea puede no arrancar en 0 solo si el subtítulo lo dice.
- **Rótulos** de 11 px en `texto-3`, `tabular-nums`, abreviados ("20", "1,2 M"). La unidad va una sola vez, en el subtítulo, nunca en cada marca. Excepción: en la dispersión, la última marca de cada eje lleva la unidad ("90 días", "40 mil").
- **Grilla** solo horizontal, punteada (`3 4`), del color `grilla`. La base (el 0) va sólida en `borde`. Nada de grilla vertical; la única excepción son los separadores de columna de las barras con encabezado (08).
- **Eje X:** meses en tres letras ("Ene"). El período activo o el último cerrado va en `tinta` 600. Si no entran, uno sí y uno no. **Nunca rótulos girados.**
- **Sin título de eje** (salvo dispersión) y sin etiquetas de valor sobre cada barra. Excepción: cuando son 6 categorías o menos, el valor va como encabezado de la columna (08) y el de la activa en `tinta`.

---

## 4. Leyenda

- Arriba, en la línea del subtítulo: cuadradito de 8 px con radio 3 + nombre en `texto-2` (+ valor en `tinta` si ayuda).
- Solo con 2 series o más. Con una serie, el título ya la nombra.
- Mismo orden que el dibujo: en un apilado, de abajo hacia arriba es de izquierda a derecha.
- Lo que no es sólido se explica en la leyenda con su forma: período anterior con un trazo punteado, proyección con un círculo hueco, presupuesto con la rayita.
- En apiladas y líneas con varias series, la leyenda es un botón que muestra u oculta la serie (`aria-pressed`). Nunca se puede apagar la última.
- Dona y barra de reparto llevan la leyenda al costado o abajo, con valor y %, porque el dibujo no tiene etiquetas.
- Nunca una leyenda en una caja aparte.

---

## 5. Tooltip

- **Oscuro en claro y claro en oscuro:** fondo `tinta`, texto blanco de 12 px, radio 10, padding 7×10, sombra flotante. En el tema oscuro se invierte (fondo casi blanco, texto `tinta`).
- **Hasta 3 datos**, separados por una barrita: **valor | participación o detalle | comparación**. El valor va primero en 600; el período o el nombre, en gris; la comparación, en verde o rojo según sea **buena o mala para el negocio**.
- Va arriba del punto o de la barra, centrado, y se corre para no salirse de la tarjeta. Aparece en 150 ms, sin demora.
- **Línea:** guía vertical punteada en el mes + un punto con aro en cada serie.
- **Barras:** la zona de hover es la columna entera, no solo la barra. La columna activa queda sólida y el resto se atenúa al 40 % o queda rayado.
- **Mes en curso:** dice hasta cuándo es el dato y la proyección: "US$ 26,8 mil al 17 nov | proyección US$ 51,0 mil".
- Se abre también con el **foco** del teclado y con un **toque** en el celular. Se cierra al salir, con Esc o tocando afuera.

---

## 6. Colores

- **Una serie, un color.** Por defecto, `dato-1`. Los colores categóricos (`dato-1…6`) van en el mismo orden en todo el sistema, y la misma categoría lleva el mismo color en todos los gráficos y en la tabla de detalle (rayita de 3 px).
- **Las entidades** (cliente, proyecto, persona) usan su color fijo, el mismo del menú y de las tarjetas.
- **Verde y rojo solo dicen bueno o malo** (delta, estado). En un gráfico que convive con estados, no uses `dato-3` (verde) ni `dato-5` (coral) para categorías.
- **Dona:** un solo color en tres tonos (100 %, 58 % y 28 % mezclado con `superficie`), porque son partes de un mismo todo.
- **Mapa de calor:** un solo color en 5 niveles: `suave` para el cero y el color al 22, 45, 70 y 100 %.
- **Ranking:** el líder (o el seleccionado) en color, el resto en `barra-neutra`.
- **Área de la línea:** degradé del color de la serie, del 24 % arriba a 0 abajo. Nada más lleva degradé.
- **Oscuro:** los colores de datos no se apagan; lo neutro pasa a gris claro sobre fondo oscuro. Las variables CSS hacen el cambio solas (ver §14).
- Prohibido: arcoíris en series ordenadas, 3D, sombras dentro del gráfico, bordes de barra y más de 6 colores en un gráfico.

---

## 7. Estados del dato

Cada estado se dibuja distinto y **nunca solo con color**:

| Estado | Cómo se dibuja | Ejemplo |
|---|---|---|
| Real, cerrado | Sólido | Octubre en la línea |
| Activo o seleccionado | Sólido + rótulo en `tinta`; el resto, rayado o al 40 % | La columna de Imprenta (08) |
| Período en curso | Mismos colores rayados a 45° + chip "Mes en curso" arriba | Noviembre en las apiladas (07, "MTD") |
| Proyección | Trazo punteado hasta el valor proyectado y punto hueco; en barras, una caja punteada | La línea de octubre a noviembre |
| Período anterior | Línea gris punteada de 1,5 px, sin área ni punto | 2025 debajo de 2026 |
| Meta o presupuesto | Rayita horizontal de 20–24 px sobre la barra, o una marca en el anillo | El presupuesto de cada rubro |
| Resto hasta el 100 % | Carril rayado gris o `suave` | El fondo de cada barra de ranking |
| Por encima del límite | Bloques extra en rojo + texto "2 de más" | La carga de una persona |
| Sin dato | Hueco y "—" en el tooltip, nunca 0 | Un día sin registro |

**Rayado:** patrón de 6 px girado 45°: fondo del color al 16 % y raya de 2,4 px al 62 %, los dos mezclados con `superficie`.

---

## 8. Cantidades máximas

| Qué | Máximo | Si hay más |
|---|---|---|
| Series en una línea | 3 + el período anterior en gris | Separar en dos gráficos o un segmentado |
| Series apiladas | 3 (4 como extremo) | Agrupar en "Otros" |
| Barras verticales por categoría | 6 en escritorio, 5 en celular | Barras horizontales |
| Filas de ranking | 8 + "Otros N" + "Ver los 14" | Lista completa en otra pantalla |
| Partes de una dona | 2 a 4 | 5 o 6: barra de reparto; más: ranking |
| Períodos en barras | 12 cerrados + el mes en curso | Línea |
| Puntos en una línea | ~60 | Agrupar por semana o por mes |
| Marcas en el eje Y | 3 a 5 | — |
| Datos en un tooltip | 3 | El resto va en la tabla |
| Rayitas en un KPI | 30 a 50 | — |
| Bloques | 5 a 12 | Rayitas o barra continua |
| Semanas en el mapa de calor | Hasta 53 en escritorio (las que llenen el ancho), 13 en celular | Agrupar por mes |
| Etapas de un embudo | 3 a 6 | Agrupar etapas |
| Puntos en una dispersión | 10 a 300 | Menos: tabla; más: mapa de calor 2D |
| Gráficos grandes por pantalla | 1 en un tablero operativo, hasta 4 en uno de análisis | Pestañas |

---

## 9. Receta por tipo

**Línea con área.** Trazo de 2,4 px con puntas redondas y curva suave (Catmull-Rom). Área con degradé solo bajo lo real. El último cerrado lleva un punto con aro y una burbuja oscura con su valor (08). Lo proyectado va punteado y con punto hueco. El año anterior va en gris punteado. Al pasar el mouse: guía vertical y tooltip.

**Barras por categoría.** Ancho del 72 % del paso, con radio 9 solo arriba. Base rayada y la activa sólida. Arriba de cada columna, el nombre (12 px gris) y el valor (display, 18 px). Detrás, la silueta que une las barras al 9 % del color (08). La rayita de presupuesto va encima de cada barra. Click fija la activa.

**Ranking horizontal.** Fila de dos renglones: puesto en mono, cuadrado de la entidad con iniciales, nombre con detalle gris, monto a la derecha con el % gris. Abajo, un carril rayado de 8 px con la barra (el líder en color y con una manija más oscura en la punta, el resto en gris). Al pasar el mouse, la barra toma el color. "Otros N" va siempre último y sin número.

**Barras apiladas.** Ancho del 52 % del paso (máximo 30 px), 2 px de hueco entre segmentos y radio 4. El mes en curso va rayado, con la caja punteada hasta la proyección y el chip "Mes en curso". La leyenda prende y apaga cada serie.

**Dona (2 a 4 partes).** Grosor igual al 30–35 % del radio, 3° de hueco entre partes, sin etiquetas en el aro. En el centro, el total en display y el período. Al pasar por una parte (o por su fila de leyenda), el centro muestra esa parte y el resto baja al 30 %.

**Barra de reparto (5 o 6 partes).** Una barra de 12 px con radio completo, 2 px entre partes, y lo libre rayado. Arriba a la derecha va el total contra el límite ("384 h de 480"). Abajo, la leyenda en grilla con cuadradito, nombre gris y valor en `tinta`.

**Anillo de avance.** Trazo de 12–14 px con punta redonda sobre un carril `suave`, y el % en el centro con "de la meta". Una marca radial muestra **lo esperado a hoy**, así se ve si va adelantado o atrasado. Al lado: lo logrado, la meta y una pastilla "12 pts sobre el ritmo". Los anillos chicos (40–48 px) van con el color de cada persona.

**Rayitas.** De 30 a 50 trazos de 2–3 px con 2,5 px de hueco y 16 px de alto. Las prendidas van en el color de la métrica y el resto en gris. Se usan para avances continuos dentro de un KPI (07).

**Bloques.** De 5 a 12 bloques de 6–7 px de alto con 3 px de hueco y radio 3, en el color de la entidad. Se usan para avances discretos ("3 de 6 hechas") y carga del equipo (06). Lo que pasa del límite va en bloques rojos agregados, con texto.

**Mapa de calor por día.** Celdas de 13–18 px (el tamaño sale del ancho) con 3 px de hueco y radio 3,5–4. Semanas en columnas y lunes arriba. Rótulos "Lun / Mié / Vie" a la izquierda y el mes arriba, donde empieza. El día de hoy lleva un borde `tinta`, y los días futuros no se dibujan. Abajo a la derecha, "Menos ▢▢▢▢▢ Más". Arriba, el total y el día más cargado.

**Embudo.** Columnas de izquierda a derecha con barras centradas en altura proporcional, unidas por trapecios del 12 % del color. Entre cada par va una pastilla con el % que pasa, y la peor en ámbar. Arriba de cada columna, el nombre y la cantidad. La cifra de la tarjeta es la conversión total.

**Dispersión.** Puntos de 5,5 px de radio con aro `superficie`. Dos medianas punteadas que arman cuadrantes. El cuadrante que importa se tiñe al 5 %, con su nombre ("Grandes y rápidas") y sus puntos en color pleno; el resto, al 38 %. La tendencia va como recta punteada.

**Sparkline** (dentro de un KPI). Sin ejes, trazo de 1,5–1,8 px, área tenue y un punto marcado. Abajo, el conteo y la ventana ("12 movimientos · 14 días").

---

## 10. Movimiento

- La entrada se dispara **una sola vez**, cuando la tarjeta aparece en pantalla (`IntersectionObserver`):
  - **líneas:** se dibujan en 1,1–1,2 s (`stroke-dashoffset` con `pathLength="1"`);
  - **barras:** crecen desde la base en 0,8 s, escalonadas 35–80 ms;
  - **donas y anillos:** se cierran en 1 s;
  - **celdas y puntos:** aparecen por columna, con 10–25 ms entre cada una;
  - **cifras:** cuentan hasta su valor en 600–900 ms.
- Todo con `cubic-bezier(.23,1,.32,1)`.
- Si cambia el período o la serie, la animación se repite. Al redimensionar, no.
- Al pasar el mouse, solo cambia la opacidad (150–200 ms). Nada rebota y nada se mueve en loop.
- Con `prefers-reduced-motion`, todo aparece directo y las cifras ya están en su valor.

---

## 11. Cargando, vacío y error

- **Cargando:** un esqueleto con la forma del gráfico (barras grises de alturas distintas con el brillo que pasa) y el mismo alto que el final. Así la página no salta.
- **Vacío:** la grilla tenue, una frase que dice qué va a aparecer y el botón que lo crea: "Todavía no hay cobros en noviembre. Aparecen acá cuando registres el primero." Si lo vacía un filtro, decirlo y ofrecer limpiarlo.
- **Error:** dentro de la tarjeta, con "Reintentar". Si había datos, quedan a la vista con "Actualizado hace 12 min".
- **Un solo período:** no se dibuja una línea con un punto; va la cifra sola.

---

## 12. Celular (390 px)

- El gráfico ocupa todo el ancho de la tarjeta, con padding de 16 y 180–220 px de alto.
- Con más de 5 categorías, las barras verticales **pasan a horizontales**.
- El mapa de calor muestra 13 semanas. En el eje X, un rótulo sí y uno no. Los nombres largos del embudo se acortan ("Negoc.").
- El tooltip se abre con un toque y queda hasta tocar afuera. La zona de toque es la columna entera.
- La leyenda baja a su propio renglón y se parte en varias líneas, nunca con scroll lateral.
- La página nunca scrollea en horizontal por un gráfico.

---

## 13. Accesibilidad

- El SVG lleva `role="img"` y un `aria-label` con **la conclusión**, no la descripción: "Facturación 2026: US$ 355 mil hasta octubre, 29 % más que en 2025. Octubre fue el mejor mes."
- Cada gráfico con ejes tiene el botón **"Ver como tabla"**, que muestra una `<table>` real con los mismos datos.
- Las columnas, puntos y partes se pueden enfocar con Tab (`tabindex="0"`, con su `aria-label`), y el foco abre el tooltip.
- Nunca solo color: lo parcial va rayado y con chip, lo comparado punteado, la meta con una marca y lo excedido con texto.
- Las series se distinguen también en gris: alterná luz entre colores vecinos y no pongas verde y rojo como dos series.
- Texto mínimo de 11 px. `texto-3` es solo para ejes y metadatos; lo que hay que leer para decidir va en `texto-2` o `tinta`.

---

## 14. Implementación

- **SVG propio, medido:** leé el `clientWidth` del contenedor, armá el `viewBox` con ese ancho y redibujá al redimensionar (con un debounce de ~120 ms y solo si cambió el ancho). No uses `preserveAspectRatio="none"` en gráficos con texto, porque estira las letras.
- **HTML/CSS para lo que es una barra sola** (rayitas, bloques, ranking, reparto) y **SVG para lo que tiene ejes o curvas** (línea, barras, apiladas, dona, anillo, mapa de calor, embudo, dispersión).
- **Colores por variable:** `style="fill:var(--d1)"` y patrones con `color-mix(…var(--d1)…, var(--superficie))`. Así el oscuro funciona sin redibujar.
- **Patrones y degradés** en un `<svg>` oculto de 0×0 al principio del `body`, con ids únicos, compartidos por todos los gráficos.
- **Animar solo `transform`, `opacity` y `stroke-dashoffset`.** Para que las barras crezcan desde la base: `transform-box: fill-box; transform-origin: 50% 100%`.
- Montos y fechas con `Intl` en `es-AR`: "US$ 45,0 mil", "mar 11 nov", "+29 %" con espacio fino.
- **Si usás una librería** (Recharts, Visx, Chart.js), aplicale estas mismas reglas: sacale la grilla vertical, los bordes y la leyenda en caja, y usá el tooltip, el rayado y los colores de acá.

---

## 15. Antipatrones (si aparece uno, rehacer)

- Torta llena, dona de más de 4 partes o torta para mostrar avance.
- Mes en curso dibujado igual que un mes cerrado (parece una caída).
- Barras que no arrancan en 0.
- Rótulos girados, valores sobre todas las barras, leyenda en caja, título de eje en un gráfico de barras.
- Más de 6 colores, arcoíris en series ordenadas, verde y rojo usados como categorías.
- Tooltip blanco con 6 renglones, o un gráfico sin tooltip ni tabla.
- 3D, sombras, bordes de barra, grilla oscura o vertical.
- Un gráfico sin cifra ni conclusión arriba: el que mira tiene que adivinar qué mirar.
- Animaciones en loop, rebotes o redibujar al hacer scroll.
- Un número sin dibujo en un KPI, o un gráfico grande para un solo número.

---

## 16. Antes de entregar un gráfico

1. ¿Responde una pregunta y la conclusión está escrita arriba (cifra + delta con período)?
2. ¿Es el tipo correcto para esa pregunta (tabla de §1) y entra en los máximos de §8?
3. ¿El subtítulo dice la unidad y el período? ¿El eje Y tiene de 3 a 5 marcas y las barras arrancan en 0?
4. ¿Lo parcial va rayado con chip, lo proyectado punteado y lo anterior en gris punteado?
5. ¿El tooltip tiene como mucho 3 datos y la comparación va coloreada por bueno o malo?
6. ¿Los colores son de `dato-1…6` o de la entidad, con verde y rojo solo para estados?
7. ¿Anima al entrar una sola vez y respeta `prefers-reduced-motion`?
8. ¿Se puede leer con teclado (foco y tooltip), tiene `aria-label` con la conclusión y "Ver como tabla"?
9. ¿Funciona a 390 px sin scroll lateral y en oscuro? ¿Tiene sus estados de cargando, vacío y error?
10. Ponelo al lado de 07 y 08: si se ve más plano, faltan el rayado, la silueta, la burbuja del último valor o la cifra arriba.
