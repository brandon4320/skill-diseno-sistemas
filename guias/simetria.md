# Simetría y alineación

Lo premium se nota en que todo cae en su lugar. Un desfase de 2 px no lo nombra nadie, pero se ve: la pantalla parece "casi bien". Esta guía baja SKILL.md §4g a medidas, CSS y casos. Ejemplo vivo con 10 pares antes/después: `ejemplos/simetria.html` (con `?grilla` se ve la grilla de 4 px y las guías de los bordes izquierdos). El revisor (`scripts/revisar.mjs`) mide casi todo esto en el chequeo "Simetría · …".

**De dónde sale.** En las referencias 06, 07, 08 y 14 se repite lo mismo:
- **06 (Gr8r):** las 6 tarjetas de resumen tienen el mismo alto, el rótulo, la cifra, la línea de contexto y el pie con ícono caen a la misma altura en todas, y el pie está separado por una banda. Las 4 tarjetas de proyecto comparten las alturas internas (etiquetas, título, barra, gráfico, "Next steps") aunque las descripciones cambien.
- **07 (Loops):** en la bandeja, el ícono del rótulo cae en la misma x que el texto de la tarjeta de adentro. Las 4 cifras de KPI comparten línea base. Los montos de la tabla van a la derecha con dos decimales en todos.
- **08 (Finora):** cuadros de ícono iguales, con el ícono centrado; los tres ahorros de la derecha tienen el mismo alto y el monto alineado a la derecha.
- **14 (Solexa):** 12 tarjetas en grilla de 4 con la misma estructura interna (código y estado, cifra, barra, 3 métricas con divisores a la misma x). Las pastillas de estado arriba a la derecha caen en la misma línea que el código.

---

## 1. Bordes comunes y ejes verticales

**Regla:** cada columna de la pantalla tiene un borde izquierdo y uno derecho, y todo lo que vive en esa columna los respeta. Nada "casi alineado": o está en la línea, o está claramente adentro (16 o más).

| Qué | Dónde arranca |
|---|---|
| Título de página, título de sección, filtros, KPIs, tarjetas, tabla | El mismo borde izquierdo del contenido (`padding` del panel) |
| Título de tarjeta y primera columna de su tabla | El mismo padding: si la cabecera tiene 20, las celdas de los extremos llevan 20 |
| Rótulo de una bandeja y contenido de la tarjeta de adentro | El ícono del rótulo cae en la x del texto de adentro (ref. 07) |
| Acciones, montos y ⋯ | El mismo borde derecho |
| Segunda línea de una fila (metadato) | Donde arranca la primera línea, no debajo del ícono |

```css
/* antes: la cabecera tiene 20 y las celdas 16 → el título queda 4 px adentro de "Cliente" */
.t-cab{padding:16px 20px 8px}
.tabla td,.tabla th{padding:0 16px}

/* después: los extremos de la tabla llevan el mismo 20 que la cabecera */
.tabla th:first-child,.tabla td:first-child{padding-left:20px}
.tabla th:last-child,.tabla td:last-child{padding-right:20px}
```

**Bandeja (ref. 07):** el borde de la bandeja (1) + su padding (4) + el borde de la tarjeta de adentro (1) + su padding (16) = 22. El rótulo de arriba y el pie de abajo arrancan en 22 también:

```css
.bandeja{padding:4px;border:1px solid var(--borde)}
.bandeja .rot,.bandeja .pie{padding:8px 12px 8px 17px} /* 17 = 16 + el borde de la tarjeta de adentro */
.adentro{padding:16px;border:1px solid var(--borde)}
```

**Ícono colgado a propósito** (asa de arrastre, viñeta): va con `margin-left` negativo y el texto queda en el borde. El revisor lo respeta.

**Antes → después**
- Antes: "Por vencer esta semana" en x 174 y "Cliente" en x 170. Después: los dos en 174.
- Antes: el título del panel en x 310 y el menú de ajustes en x 306 porque `.top` tiene 28 de padding y `.aj` 24. Después: los dos con 28.

## 2. Padding simétrico (y sus excepciones ópticas)

**Regla:** en tarjetas, botones y pastillas, arriba = abajo e izquierda = derecha.

| Pieza | Padding |
|---|---|
| Botón | Alto fijo (28 / 36 / 38; 44 en celular) y padding solo lateral: `0 16px`. Nunca `9px 16px 7px` para "centrar" el texto: el centrado lo da `align-items:center` |
| Botón con ícono a la izquierda | `0 16px 0 12px` o `0 14px 0 12px` (chico `0 12px 0 8px`). El ícono pesa más que una letra: 2–4 px menos de su lado lo compensan |
| Botón con flecha o ▾ a la derecha | Al revés: `0 12px 0 16px` |
| Pastilla | `0 8px`, alto 24. Con punto: igual (el punto va con `gap`) |
| Pastilla de persona con avatar | `0 10px 0 3px`: el avatar redondo queda concéntrico con la pastilla |
| Tarjeta | 16 o 20 en los cuatro lados. El pie lleva su propio padding simétrico, no se "aprovecha" el de la tarjeta |
| Tarjeta de lista | `padding:0` y cada fila con el suyo (`0 16px`): no mezclar padding de tarjeta con padding de fila |

```css
/* antes */
.aviso{padding:16px 20px 10px}          /* abajo más apretado "porque el botón ya tiene aire" */
.aviso .btn{height:auto;padding:9px 16px 7px}

/* después */
.aviso{padding:20px}
.btn{height:36px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center}
.btn:has(> svg:first-child, > .ph:first-child){padding-left:12px}
```

Tailwind v4: `h-9 px-4 has-[>svg:first-child]:pl-3`.

**Excepción óptica que sí vale:** una cifra grande (32+) en display arranca 1–2 px más adentro por el espacio lateral de la letra. No se corrige con padding distinto en la tarjeta: se deja, o se corre la cifra con `margin-left:-1px` solo si está alineada a una línea vertical visible.

## 3. Filas de hermanos: mismo alto y zonas alineadas

**Regla:** las tarjetas de una fila miden lo mismo y sus partes caen a la misma altura: título con título, cifra con cifra, pie con pie.

**Herramienta 1, estirar (lo mínimo):** grid con `align-items:stretch` (el valor por defecto). El error típico es un `align-items:start` que quedó de otro lado.

```css
.proys{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px} /* sin align-items:start */
.proy{display:flex;flex-direction:column}
.proy .pie{margin-top:auto}               /* el pie va abajo aunque la descripción sea corta */
.proy p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
```

**Herramienta 2, subgrid (zonas internas compartidas):** cuando un rótulo de dos líneas empuja la cifra de una sola tarjeta.

```css
.kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:auto auto auto;gap:12px}
.kpi{display:grid;grid-row:span 3;grid-template-rows:subgrid;row-gap:0}
.kpi .rot{align-self:end}                 /* el rótulo de una línea queda pegado a su cifra */
```

Tailwind v4: `grid grid-rows-[auto_auto_auto]` en el padre y `row-span-3 grid grid-rows-subgrid gap-y-0` en cada tarjeta.

**Herramienta 3, alto por zona:** si no hay subgrid (tarjetas que vienen de un componente cerrado), alto mínimo por zona: rótulo `min-height:36px` (2 líneas de 12) o `truncate` a una línea con el texto completo en `title`.

**Lista con filas de una y dos líneas:** el mismo `min-height` para todas (56) y el contenido centrado verticalmente; el ícono y la acción quedan en el mismo eje.

**Antes → después**
- Antes: 3 KPIs del mismo alto, "Por cobrar a más de 30 días" en dos líneas, su cifra y su pie 18 px más abajo que los vecinos. Después: subgrid, las tres cifras en la misma línea base.
- Antes: "Portal de clientes" 152 px, "Migración de caja" 113 px. Después: las dos en 152 y la barra de avance abajo en las dos.

## 4. Anchos iguales: columnas y botones

- **Columnas de una grilla:** iguales (`repeat(4,minmax(0,1fr))`) salvo un protagonista declarado (`1.25fr repeat(3,1fr)`). Nunca `1fr 1.1fr` para que "entre" un texto: truncá el texto.
- **Botones al pie de una capa:** si ocupan todo el ancho, iguales (`grid-template-columns:1fr 1fr`). Si no, alineados a la derecha con su ancho natural (`justify-content:flex-end`). Nunca `1fr 1.4fr`: el principal ya se distingue por el relleno, no por el ancho.
- **Columnas fijas para lo que se repite:** cuadro de ícono (32–40), avatar (28–34), fecha (ancho fijo a la derecha, `tabular-nums`), ⋯ (28). Así el texto variable siempre arranca en la misma x.
- **Segmentados:** cada opción con su ancho natural; si son 2–3 opciones de largo parecido en una barra de ancho fijo, `flex:1` en todas.

```css
.capa .pie{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:16px 20px}
/* o */
.capa .pie{display:flex;justify-content:flex-end;gap:8px}
```

## 5. Centro óptico de íconos

**Regla:** el ícono va en el centro geométrico de su cuadro, con tamaños pares, y se corrige 1 px solo cuando el dibujo pesa de un lado.

| Cuadro | Ícono | Radio del cuadro |
|---|---|---|
| 24 | 14–16 | 8 |
| 28 | 16 | 8 |
| 32 | 16 | 10 |
| 36 | 18 | 12 |
| 40 | 20 | 12 |
| 44 (celular) | 20–22 | 12 |

Diferencia par entre cuadro e ícono: así sobra lo mismo de cada lado (36 − 18 = 18 → 9 y 9). Con un ícono de 17 en 36 sobra 19: medio píxel queda de un lado.

```css
.cuadro{width:36px;height:36px;border-radius:12px;display:grid;place-items:center}
.cuadro > .ph,.cuadro > svg{font-size:18px;width:18px;height:18px;line-height:1;display:block;margin:0}
```

- `display:grid; place-items:center` en el cuadro, `line-height:1` (o `display:block`) en el ícono. Con `display:inline` el ícono se apoya en la línea base y baja 1–3 px.
- **El error real más común:** una regla general de íconos de fila (`.fila .ph{margin-right:6px}`) que también le pega al ícono del cuadro y lo corre 3 px a la izquierda. Los íconos de un cuadro no llevan márgenes.
- **Corrección de 1 px:** play, flecha →, enviar, megáfono: `transform:translateX(1px)` hacia el lado liviano. Una flecha ↗ dentro de un círculo: `translate(0.5px,-0.5px)` solo si el cuadro es de 32 o más. Nada más se corrige.
- **Ícono al lado de texto:** `display:inline-flex; align-items:center; gap:8px` en el padre, ícono de la altura de la letra + 2–4 (13 → 16). Nunca `vertical-align:middle` con `margin-top` a mano.

## 6. Línea base al mezclar tamaños

- **Cifra con unidad** (`$ 18,4 M`, `17,3 %`, `140,9 kWh`): `display:flex; align-items:baseline; gap:2px`. La unidad más chica apoyada en la misma base que la cifra (ref. 14).
- **Título grande con acciones:** la cabecera alinea la base (`align-items:flex-end` o `baseline`): el botón se apoya en la línea base del título, no en el medio de la fecha de arriba. Elegí un eje y usalo en toda la app.
- **Controles de una misma barra:** el mismo alto (36: buscador, segmentado por fuera, botones) y `align-items:center` entre ellos. Un buscador de 40 al lado de un botón de 38 y un segmentado de 34 deja tres pisos.
- **Fila de KPIs:** las cifras comparten línea base. Rótulos de una línea (truncados) o subgrid (§3).

```css
.cab{display:flex;align-items:flex-end;gap:12px}
.cab .ctrl{display:flex;align-items:center;gap:8px;margin-left:auto}
.cab .ctrl > *{height:36px}           /* segmentado: 36 por fuera = 28 + 3 + 3 + 1 + 1 */
.n{display:flex;align-items:baseline;gap:2px}
```

## 7. Cifras alineadas

- Columna numérica: `text-align:right`, `font-variant-numeric:tabular-nums`, el encabezado también a la derecha.
- Mismos decimales en toda la columna (`$ 98.400,50`, no `$ 98.400,5`); si son enteros, ninguno con decimales.
- La moneda va pegada a la cifra con espacio fino (`$ 1.250.000`) y del mismo lado en todas; si hay dos monedas, columnas separadas.
- El total del pie cae en la misma x derecha que la columna.
- En una lista (no tabla), el monto va en una columna de ancho fijo a la derecha, no al final del texto.

## 8. Radios concéntricos

**Radio interno = radio externo − padding.** Si no, las esquinas se separan más que los lados.

| Afuera | Padding | Adentro |
|---|---|---|
| 26 (marco) | 6 | 20 |
| 20 (bandeja) | 4 | 16 |
| 20 (bandeja) | 8 | 12 |
| 16 (tarjeta) | 4 | 12 |
| 12 (segmentado) | 3 | 9 |
| 99 (pastilla con avatar) | 3 | 99 (avatar redondo) |

Si la cuenta da un radio fuera de la escala, cambiá el padding, no el radio.

## 9. Ritmo parejo

- El espacio entre hermanos es siempre el mismo: `gap` en el padre, nunca `margin-top` sueltos en cada hijo (alguno se olvida).
- Grilla de tarjetas: `gap:14px` en las dos direcciones. Si entre filas va otro valor, es porque entre ellas hay un título.
- Lista: filas de alto fijo (36 / 44 / 56) con divisor de 1 px; el divisor no suma alto variable.
- Lo relacionado más cerca que lo distinto (`guias/jerarquia-y-espacios.md` §6.2): rótulo ↔ valor 2–4, título ↔ contenido 12, bloque ↔ bloque 28.

## 10. Bordes de 1 px que no se duplican

- Piezas pegadas (celdas de métricas, botones de un grupo, tarjetas de una tabla de precios): el borde va en el contenedor y los divisores en un solo lado.

```css
/* antes: cada celda con borde completo y gap 0 → 2 px entre celdas */
.met{border:1px solid var(--borde)}

/* después */
.mets{display:flex;border:1px solid var(--borde);border-radius:16px;overflow:hidden}
.met + .met{border-left:1px solid var(--borde)}
```

Tailwind v4: `flex border rounded-2xl overflow-hidden divide-x divide-borde`.

- Tablas: `border-collapse:collapse` y divisor solo arriba de cada fila (`td{border-top:1px solid var(--divisor)}`), nunca arriba y abajo.
- Botones de un grupo pegados: `margin-left:-1px` en el segundo y `z-index` en el que tiene foco, o mejor un segmentado.
- Una tarjeta dentro de otra con borde: no. Bandeja + tarjeta blanca, o banda a todo el ancho (SKILL.md §4f).

## 11. Grilla de 4 px y subpíxeles

- Toda medida de layout es múltiplo de 4: alturas (28, 36, 40, 44, 56), paddings (4, 8, 12, 16, 20, 24), gaps (8, 12, 14 entre tarjetas como única excepción), cuadros de ícono (24, 32, 36, 40).
- Las únicas medidas impares permitidas son las que compensan un borde (17 = 16 + 1) o el padding interno del segmentado (3).
- Alturas fijas en lo que se repite (filas, controles): así un `line-height:1.4` sobre 13 px (18,2) no arrastra decimales hacia abajo.
- **Borde borroso:** pasa cuando un `transform` deja la pieza en medio píxel (`translate(-50%,-50%)` sobre un ancho impar, una animación que termina en `translateY(-0.5px)`). Centrá con grid o flex, y que las animaciones terminen en valores enteros. Chromium ajusta solo los bordes al píxel cuando no hay transform; Safari es más estricto, por eso la regla vale igual.
- Para mirar: `?grilla` en los ejemplos, o temporalmente

```css
body{background-image:linear-gradient(rgb(79 70 229/.07) 1px,transparent 1px),linear-gradient(90deg,rgb(79 70 229/.07) 1px,transparent 1px);background-size:4px 4px}
```

## 12. Cuándo centrar y cuándo alinear a la izquierda

| Centrado | A la izquierda |
|---|---|
| Estado vacío, pantalla de acceso, modal de confirmación corto, éxito | Todo lo que se lee de corrido: títulos, párrafos, filas, tarjetas, formularios |
| Ícono dentro de su cuadro, número de día en un calendario, avatar con iniciales | Cifras de KPI (la vista las encuentra en el borde) |
| Título de la barra superior en celular | Columnas de texto en tablas (las numéricas a la derecha) |
| Texto de un botón | Rótulos de campo y ayudas |

Una pieza centrada vive aislada: si comparte columna con piezas a la izquierda, también va a la izquierda. Nunca un título centrado arriba de una tabla alineada a la izquierda.

## 13. Simetría en celular (390 px)

- Márgenes laterales iguales: 16 y 16. Lo que llega al borde (carrusel, tabla con scroll) llega a los dos lados o a ninguno; el primer ítem del carrusel arranca en 16.
- Una columna: todas las tarjetas del mismo ancho, sin una "un poco más angosta" por un padding distinto.
- Barra inferior: ítems de ancho igual (`grid-template-columns:repeat(5,1fr)`), ícono y rótulo centrados en cada uno; la píldora del activo con el mismo padding a los dos lados.
- Píldora de acción fija: centrada con `left:16px; right:16px`, no con `translate(-50%)` (subpíxeles).
- Toques de 44: el área se agranda con padding simétrico o `::after` centrado, sin correr el dibujo.
- Hoja de abajo: el asa centrada, el título a la izquierda, los botones del pie iguales (§4).

## 14. Lista de verificación

Antes de entregar, con la captura al lado de la referencia y `?grilla` (o el gradiente de §11) encima:

1. ¿Título de página, títulos de sección, filtros, tarjetas y tabla arrancan en la misma x? ¿Ningún par a 1–6 px?
2. ¿La cabecera de cada tarjeta y la primera columna de su tabla comparten el padding?
3. ¿Los rótulos de bandeja caen en la x del texto de adentro?
4. ¿Las tarjetas de cada fila miden lo mismo? ¿Sus cifras comparten línea base y sus pies están a la misma altura?
5. ¿Ningún `align-items:start` en una grilla de tarjetas?
6. ¿Padding arriba = abajo e izquierda = derecha en tarjetas, botones y pastillas (salvo el ícono a un lado: 12/16)?
7. ¿Botones con alto fijo, sin padding vertical?
8. ¿Los íconos en cuadros están centrados (grid + place-items), con tamaño par y sin márgenes heredados?
9. ¿Los controles de una barra tienen el mismo alto?
10. ¿Columnas numéricas a la derecha, `tabular-nums`, mismos decimales?
11. ¿Botones que llenan un pie con el mismo ancho?
12. ¿Radio interno = externo − padding?
13. ¿Ningún borde de 2 px entre piezas pegadas?
14. ¿Medidas en múltiplos de 4 y ningún `translate(-50%)` sobre piezas con borde?
15. ¿En 390 px, márgenes de 16 a los dos lados y barra inferior con ítems iguales?
16. `node scripts/revisar.mjs pantalla.html`: ningún aviso "Simetría · …" que no sea intencional.

## 15. Qué mide el revisor

| Aviso | Mide | Umbral |
|---|---|---|
| Simetría · hermanos de distinto alto | Tarjetas del mismo tipo (misma clase) en una fila de grid o flex, tops a ≤ 2 px | Diferencia de alto > 2 px (salvo piezas de más de 520, como columnas de kanban) |
| Simetría · pies a distinta altura | En esas filas con el mismo alto, el último hijo | Ni los tops ni los bottoms del pie coinciden (> 2 px) |
| Simetría · padding asimétrico | Botones y pastillas con fondo o borde de hasta 48 px de alto; tarjetas con clase de tarjeta | > 1 px; ícono o avatar a un lado se tolera hasta 4 px (avatar redondo, 10); tarjetas con padding 0 en un lado no cuentan |
| Simetría · ícono descentrado | `svg` o `i.ph*` solo dentro de un cuadro de 24–48 px | Centro a más de 1,5 px del centro del cuadro |
| Simetría · bordes casi alineados | Bloques apilados del contenido principal y de cada tarjeta: su caja (fondo o borde izquierdo) y su primer texto o ícono | Entre 1 y 6 px (1 px exacto se tolera: es un borde) |
| Simetría · botones de distinto ancho | 2–4 botones estirados (grid o flex-grow) que llenan su fila | > 2 px |
| Simetría · borde de 1 px duplicado | Hermanos pegados con borde en los dos lados que se tocan | Cualquiera |
| Simetría · bordes en medio píxel | Piezas con borde de 1 px y un transform, en posición con decimales | Cualquiera (aviso suave) |

Todos son avisos, con un tope total de 10 puntos. No mide radios concéntricos, línea base de cifras ni alto de controles de una barra: eso se mira con `?grilla`.
