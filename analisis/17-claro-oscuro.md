## Claro y oscuro: la misma pantalla con un deslizador (referencia 20)

**Fuente:** el video de 9,7 s (1600 × 1200) de un panel de ventas de un restaurante. Un deslizador vertical recorre la pantalla y muestra a la izquierda la versión clara y a la derecha la oscura: corta por la mitad los KPIs, el anillo, las barras, el gráfico, la tabla, las pastillas, los botones y el menú. `referencias/20-saffron-claro-oscuro.jpg` es una hoja con 9 cuadros.

**Cómo se midió.** Se exportaron 39 cuadros a resolución completa (4 por segundo). Para cada modo se eligió el cuadro que lo muestra casi entero (el claro con el deslizador a la derecha y el oscuro con el deslizador a la izquierda). Se leyó el color en las mismas coordenadas de cada cuadro:
- para superficies, la mediana de 5 × 5 px;
- para bordes y grillas, un barrido de píxel a píxel;
- para textos, el 2,5 % de píxeles más lejano del fondo (el núcleo de la letra, sin el suavizado).

Hay compresión de video, así que los valores son **±2 en cada canal**. Los contrastes están calculados con la fórmula de WCAG.

---

### 1. Mapeo elemento por elemento

| Elemento | Claro | Oscuro | Qué pasa |
|---|---|---|---|
| Lienzo (marco, barra lateral, barra superior) | `#f2f2f2` | `#0a0a0a` | Se invierte. No es negro puro |
| Panel principal | `#fefefe` | `#111111` | Sube un escalón (+7) |
| Bandeja (rótulo de KPI, bloque de gráfico, tabla) | `#f5f5f5` | `#181818` | Sube otro escalón (+7) |
| Tarjeta dentro de la bandeja | `#fefefe` | `#1f1f1f` | Sube otro escalón (+7). **En los dos modos la tarjeta queda por encima de su bandeja** |
| Borde del panel | `#e9e9e9` | `#222222` | |
| Borde de tarjeta, campo, botón, ítem activo | `#e8e8e8` | `#2a2a2a` | En oscuro el borde es **+11 sobre la tarjeta**: un borde, no una sombra |
| Divisor entre filas | `#e9e9e9` | `#292929` | |
| Grilla del gráfico | `#f1f1f1` | `#252525`–`#262626` | Baja: 1,09:1 contra la tarjeta (1,12 en claro). Casi invisible a propósito |
| Barras "no elegidas" del gráfico | `#ebebeb` | `#2a2a2a` | El gris neutro de datos tiene su versión oscura |
| Pista de barras de avance | `#f0f0f0` | `#2d2d2d` | |
| Rayado (lo que falta) | `#e8e8e8` | `#2b2b2b` | |
| Tinta (cifras, nombres) | `#0f0f0f` (19:1) | `#f5f5f5`–`#fafafa` (15,1:1 sobre `#1f1f1f`) | **Nunca `#fff` sobre `#000`** |
| Texto 2 (rótulos, "vs. target") | `#5c5c5c` (6,6:1) | `#a2a2a2` (6,5:1) | Mismo contraste en los dos modos |
| Texto 3 (ejes, "Main course", placeholder) | `#9a9a9a` (**2,7:1**) | `#717171` (**3,3:1**) | **No pasa AA en ninguno de los dos.** No se copia |
| Botón principal "Download" | fondo `#141414`, texto `#fefefe` | fondo `#f1f1f1`, texto `#121212` | **Se invierte**: negro en claro, blanco en oscuro |
| Tooltip "75% margin" | `#141414` con texto blanco | `#f0f0f0` con texto oscuro | Se invierte |
| Insignia del menú ("4") | negra | blanca | Se invierte |
| Interruptor de tema, opción activa | pastilla negra | pastilla blanca | Se invierte |
| Ítem activo del menú ("Reports") | `#fefefe` + borde `#e9e9e9` sobre `#f2f2f2` | `#1f1f1f` + borde `#2a2a2a` sobre `#0a0a0a` | **No se invierte**: sube un escalón y lleva borde |
| Segmentado (Margin / Food Cost) | riel `#f3f3f3`, activa `#fefefe` con borde | riel `#181818`, activa `#1f1f1f` con borde `#282828` | Sube un escalón, no se invierte |
| Campo de búsqueda, botón Filtros | `#fefefe` + borde `#e9e9e9` | `#212121` + borde `#282828` | Como una tarjeta |
| Botón secundario relleno gris ("Download PDF") | `#ececec` | `#2a2a2a` | |
| Verde de delta (+9,4 %) | `#35b75b` (**2,6:1**) | verde más claro (~`#4ade80`, > 7:1) | En claro no pasa AA; en oscuro sí |
| Pastilla verde (+1,2 %) | fondo `#e8f7ee`, texto `#2cae59` (2,5:1) | fondo `#174226` (verde al ~20 %), texto ~`#6af999` (6,5:1) | El fondo sube del 10 % al ~20 % y el texto se aclara |
| Línea de meta (punteada, "Goal 70%") | `#7fe499` | `#127831` | **Se oscurece**: una guía no debe brillar sobre el oscuro |
| Ámbar ("Low stock") | `#a64f12` (5,6:1) | `#e78b4f` (6,4:1) | Se aclara y baja la saturación |
| Rojo ("+1′" peor) | rojo oscuro | `#bb132e` (**2,5:1**) | Mal resuelto: el rojo saturado sobre oscuro no se lee |
| Azul del anillo y barra activa | `#3193fb` | `#3194f7` | **Igual** |
| Escalones del anillo (fuerte / medio / claro) | `#3193fb` / `#80bffc` / `#cde5fb` | iguales | Igual. El tono más claro brilla de más en el oscuro |
| Violeta, naranja y azul de las barras por sucursal | `#5b1ff2`, `#a279f4`, `#ee7e29`, `#3194f7` | iguales | Igual |
| Fotos de los platos | sin fondo | sin fondo | Igual. Llevan borde redondeado, sin cuadro |
| Sombras | casi nulas | ninguna | La separación es de luminosidad + borde en los dos modos |

### 2. Qué cambia y qué se mantiene

**Se mantiene:**
- el layout entero;
- los tamaños y pesos de letra;
- los radios;
- la paleta de datos (azul, violeta, naranja);
- las fotos;
- la posición de cada cosa.

El oscuro es "el mismo layout con otros tokens", como dice §1c.10.

**Se invierte** lo que es "una sola cosa fuerte" en la pantalla: el botón principal, el tooltip, la insignia y la opción activa del tema. Negro sólido en claro pasa a blanco sólido en oscuro.

**Sube un escalón** (no se invierte) lo que es "seleccionado dentro de un grupo": el ítem activo del menú y la opción activa del segmentado. Invertir eso también llenaría la pantalla de blancos.

**Se adapta:**
- los estados (más claros y menos saturados, fondo de pastilla más denso);
- los grises de datos (barras no elegidas, pistas, rayado);
- la grilla (baja);
- las guías (la meta se oscurece);
- los bordes (pasan a ser la separación principal).

### 3. Elevación por luminosidad
En oscuro la escalera es de **7 en 7**:

`#0a0a0a` lienzo → `#111111` panel → `#181818` bandeja → `#1f1f1f` tarjeta → `#2a2a2a` borde / control gris.

Cada capa que está "más cerca" es más clara. En claro pasa lo mismo al revés: el lienzo `#f2f2f2` es el más oscuro, la bandeja `#f5f5f5` va en el medio y la tarjeta `#fefefe` es la más clara. La relación bandeja < tarjeta se mantiene en los dos modos, y por eso la tarjeta se ve "arriba" en los dos.

**Lo que esto corrige en la skill:** el bloque oscuro de `tokens.css` tenía `--color-suave: #232326`, más claro que `--color-superficie: #18181b`. La bandeja (que usa `suave`) quedaba más clara que la tarjeta de adentro, y la tarjeta se veía hundida. Ahora la escalera es:

`fondo #0a0a0b` → `panel #111113` → `suave` (bandeja, riel, encabezado de tabla) `#18181b` → `superficie` (tarjeta) `#1f1f22` → `hover #26262a` → `borde #2a2a2e`

### 4. Contraste real

| Par | Claro | Oscuro |
|---|---|---|
| Tinta sobre tarjeta | 19,0:1 | 15,1:1 |
| Texto 2 sobre tarjeta | 6,6:1 | 6,5:1 |
| Rótulo de bandeja sobre bandeja | 6,1:1 | 6,9:1 |
| Texto 3 (ejes, metadatos) | 2,7:1 ✗ | 3,3:1 ✗ |
| Verde de delta | 2,6:1 ✗ | > 7:1 |
| Pastilla verde | 2,5:1 ✗ | 6,5:1 |
| Rojo de delta | (sin muestra limpia) | 2,5:1 ✗ |
| Ámbar | 5,6:1 | 6,4:1 |
| Lienzo ↔ panel | 1,11:1 | 1,05:1 |
| Bandeja ↔ tarjeta | 1,05:1 | 1,08:1 |
| Borde ↔ tarjeta | 1,21:1 | 1,15:1 |
| Grilla ↔ tarjeta | 1,12:1 | 1,09:1 |

La referencia se ve muy bien pero **no pasa AA** en el gris de metadatos (los dos modos), en el verde del claro y en el rojo del oscuro. La skill se queda con sus valores, que sí pasan:

| Token de la skill | Sobre | Contraste |
|---|---|---|
| `texto-3` claro `#646979` | blanco | 5,5:1 |
| `texto-3` claro `#646979` | bandeja | 5:1 |
| `texto-3` oscuro `#8f8f9a` | tarjeta `#1f1f22` | 5,1:1 |
| verde oscuro `#4ade80` | tarjeta `#1f1f22` | 9,4:1 |
| rojo oscuro `#f87171` | tarjeta `#1f1f22` | 5,9:1 |
| ámbar oscuro `#fbbf24` | tarjeta `#1f1f22` | 9,9:1 |
| azul oscuro `#60a5fa` | tarjeta `#1f1f22` | 6,5:1 |
| verde oscuro `#4ade80` | su pastilla al 12 % | 7,7:1 |
| rojo oscuro `#f87171` | su pastilla al 12 % | 5,3:1 |

**El color de estado del claro no sirve en el oscuro, y al revés:**

| Color | Pensado para | Sobre el otro fondo | Contraste |
|---|---|---|---|
| verde `#15803d` | claro | tarjeta oscura | 3,3:1 |
| rojo `#b91c1c` | claro | tarjeta oscura | 2,5:1 |
| verde `#4ade80` | oscuro | blanco | 1,7:1 |

Por eso cada estado tiene dos versiones y sale de variables. El revisor ahora avisa cuando un texto de color tiene el mismo valor en los dos modos y no llega a AA.

**Datos:** la paleta de datos de la skill mantiene su tono en oscuro. Pasa 3:1 contra la tarjeta oscura, que es el mínimo para objetos gráficos:

| Color de datos | Contraste sobre la tarjeta oscura |
|---|---|
| `dato-1` `#6366f1` | 3,7:1 |
| `dato-2` | 7,1:1 |
| `dato-3` | 6,5:1 |
| `dato-4` | 9,8:1 |
| `dato-5` | 5,2:1 |

El gris "resto" (`dato-6`) sí cambia: `#d4d4d8` en claro brillaría como un dato más, así que en oscuro pasa a `#3f3f46` (como las barras `#2a2a2a` de la referencia).

### 5. Reglas que salen de acá (van a SKILL.md, sección Oscuro)
1. Escalera de superficies de 6–8 de luz por capa. Lo de arriba, más claro. La tarjeta siempre más clara que su bandeja.
2. Nunca `#fff` sobre `#000`. La tinta es `#fafafa`, el lienzo `#0a0a0b`.
3. Estados con versión oscura: más claros y menos saturados (400 de Tailwind en vez de 700). La pastilla sube su fondo del 10 al 12–20 %.
4. Bordes de 1 px en vez de sombras. La sombra se apaga en oscuro; las capas flotantes llevan borde más claro (`borde-fuerte`) y la superficie de un escalón más arriba.
5. AA en los dos modos, medido sobre el fondo real (bandeja incluida).
6. Los gráficos conservan sus colores; bajan la grilla (≤ 1,1:1), las guías y el gris "resto".
7. Se invierte solo lo único y fuerte (botón principal, tooltip, insignia, selector de tema). Lo seleccionado dentro de un grupo sube un escalón con borde.
8. Logos e imágenes llevan cuadro: un logo oscuro sobre fondo oscuro desaparece. Va en cuadro blanco con borde, en los dos modos. Las fotos van con radio y sin sombra.
9. Los tonos pastel de un anillo o barra escalonada se oscurecen en oscuro (mezclados con la superficie, no con blanco), así no brillan más que el dato fuerte.
