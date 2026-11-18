# Movimiento: cuándo, cuánto y cómo

En un sistema de gestión, el movimiento sirve para una sola cosa: **explicar**. Muestra de dónde viene algo (la hoja sale del costado donde está el botón), adónde fue (la tarjeta que soltaste se acomoda en su columna) o que algo cambió (la fila se tiñe de verde y el botón pasa a "Aprobado"). Si una animación no explica nada, no va. Si explica pero se ve cuarenta veces por día, tampoco va.

Va con SKILL.md §1b punto 8 ("Movimiento con propósito"), §5 Acciones (éxito en el lugar), §6b (cargando) y §6d (reduced-motion). Todo esto se ve en vivo, con un botón "Reproducir" por patrón, en **`ejemplos/movimiento.html`**. Abrilo antes de animar algo y copiá los valores de ahí.

Los ejemplos usan la marca inventada **Estudio Faro** (clientes Orbe Retail, Casa Lumen, Mesa Fina, Grupo Atlas; equipo Ana Ruiz, Lucía, Tomás, Martín).

---

## 0. La regla en una línea

**Rápido, corto, desde un origen, y una sola vez.** Rápido: menos de 320 ms para todo lo que no sea un dato. Corto: se mueve 4 a 8 px, no media pantalla. Desde un origen: el menú crece desde su botón, la hoja sale de su borde. Una sola vez: los números cuentan y los gráficos se dibujan al llegar, no cada vez que se refrescan.

---

## 1. Cuándo animar y cuándo no

### 1.1 La prueba de la frecuencia

Antes de animar, preguntate **cuántas veces por día ve esto la misma persona**:

| Frecuencia | Qué hacer | Ejemplos |
|---|---|---|
| Cientos de veces | **Nada.** Aparece directo | Escribir en un campo, mover el foco con flechas, abrir ⌘K, cambiar de pestaña o de filtro, tildar una casilla de una tabla |
| Decenas de veces | **Mínimo:** solo opacidad o 120–180 ms | Menú ⋯, tooltip, hover de fila, segmentado, presionar un botón |
| Pocas veces | **Completo:** opacidad + desplazamiento, con su curva | Abrir una hoja o un modal, toast, éxito en el lugar, entrada de una página, primera carga de un tablero |
| Una vez | Puede ser más rico | Primera vez que se llena un tablero, completar el último paso de un proyecto, vacío que se llena |

### 1.2 Se anima

1. **Una capa que aparece o se va:** hoja lateral, modal, menú, toast, tooltip. El movimiento dice de dónde salió.
2. **Un cambio de estado que provocó la persona:** aprobar, tildar, guardar, cobrar. El éxito se ve en el lugar donde hizo clic.
3. **La primera llegada de los datos:** las cifras cuentan, las barras crecen y las líneas se dibujan. Una vez por visita.
4. **Algo que cambia de lugar:** arrastrar y soltar, reordenar, una fila que se mueve a otro grupo. Los vecinos se corren, no saltan.
5. **El toque:** el botón se hunde un poco al presionarlo; la tarjeta clickeable sube 2 px al pasar el mouse.
6. **La espera:** el esqueleto con brillo y el "Guardando…" del botón.

### 1.3 No se anima

1. **Lo que se hace con el teclado muchas veces:** ⌘K abre directo (como mucho 120 ms de opacidad), flechas en listas, Enter para confirmar, Esc para cerrar.
2. **Cambiar de pestaña, filtro o vista.** El contenido cambia directo. Lo único que se mueve es la pastilla del segmentado (180 ms).
3. **Datos que se refrescan solos** (polling, tiempo real). No se vuelve a contar desde 0 ni a redibujar la línea. Si un número cambió, cuenta **desde el valor anterior** hasta el nuevo; si no cambió, no pasa nada.
4. **Listas largas.** El escalonado alcanza a las primeras 8 filas; el resto aparece junto con la octava. Una tabla de 50 filas no hace cascada.
5. **El scroll.** Nada de "revelar al scrollear" en un sistema de gestión: la persona vuelve a esa pantalla todos los días y no quiere esperar a que aparezca lo que ya sabe que está.
6. **Lo que se está leyendo.** Nunca se mueve un texto mientras alguien lo lee (un toast no empuja el contenido, un número no se reacomoda).
7. **Cargas de menos de 300 ms.** No se muestra el esqueleto: el contenido aparece directo con un fundido de 120 ms.
8. **Decoración en bucle.** Lo único que se repite sin parar es el punto "en vivo" que late y el brillo del esqueleto. Nada de íconos que rebotan, degradés que giran ni flechas que invitan a hacer clic.
9. **El marco.** La barra lateral, la barra superior y las migas de pan nunca entran animadas: son el piso firme sobre el que se mueve lo demás.

---

## 2. Tokens

Pegalos junto a `tokens.css`. Son los únicos valores permitidos: no inventes 250 ms ni 400 ms.

```css
:root {
  /* Duraciones */
  --dur-micro: 120ms;   /* presionar, color de hover, salida de tooltip, fundido de reduced-motion */
  --dur-rapido: 180ms;  /* menú, tooltip, segmentado, salidas en general */
  --dur-base: 240ms;    /* modal, toast, hover de tarjeta, éxito en el lugar, soltar */
  --dur-lento: 320ms;   /* hoja lateral, entrada de página */
  --dur-cuenta: 700ms;  /* números que cuentan */
  --dur-dibujo: 900ms;  /* líneas que se dibujan, barras que crecen (total con escalonado ≤ 1,2 s) */
  --escalon: 35ms;      /* entre ítems de una lista; tope 8 ítems */

  /* Curvas */
  --ease: cubic-bezier(.23, 1, .32, 1);          /* salida fuerte: casi todo, entradas y salidas */
  --ease-mover: cubic-bezier(.65, 0, .35, 1);    /* algo que YA está en pantalla cambia de lugar */
  --ease-resorte: cubic-bezier(.34, 1.56, .64, 1); /* solo confirmaciones: check, "Aprobado", punto final */

  /* Interruptor de reduced-motion: multiplica las distancias */
  --mueve: 1;
}
@media (prefers-reduced-motion: reduce) { :root { --mueve: 0; } }
```

En Tailwind v4, dentro de `@theme`:

```css
@theme {
  --ease-salida: cubic-bezier(.23, 1, .32, 1);     /* clase ease-salida */
  --ease-mover: cubic-bezier(.65, 0, .35, 1);      /* clase ease-mover */
  --ease-resorte: cubic-bezier(.34, 1.56, .64, 1); /* clase ease-resorte */
}
```

Y las duraciones van con el número directo: `duration-120`, `duration-180`, `duration-240`, `duration-320`.

### 2.1 Reglas de los tokens

- **Curvas:** `--ease` para casi todo. `--ease-mover` solo cuando algo que ya se ve se traslada (la pastilla del segmentado, los vecinos que se corren al soltar). `--ease-resorte` solo en la confirmación, con un rebote apenas visible. **Nunca `ease-in`** en la interfaz: arranca lento y se siente pesado. **Nunca `linear`**, salvo en el brillo del esqueleto y en la barrita de tiempo del toast.
- **Salidas más rápidas que las entradas:** entra en 240, sale en 180. Lo que se va no necesita que lo miren.
- **Distancias:** se entra desde 4–8 px (lista, página, modal), 16 px (toast) o desde el borde (hoja). La escala mínima es 0,96: **nunca desde `scale(0)`**, que parece que la cosa nace de un punto.
- **Propiedades:** solo `transform` y `opacity` (y `stroke-dashoffset` en gráficos). Nunca `width`, `height`, `top`, `left` ni `margin`. Nunca `transition: all`: se nombran las propiedades.
- **Escalonado:** 35 ms entre ítems, tope 8 ítems; el total de la cascada nunca pasa de 300 ms.
- **Datos:** 700 ms para contar y 900 ms para dibujar, porque se miran, no se esperan. Nunca más de 1,2 s en total.

---

## 3. Patrones

Cada patrón dice cuándo se usa, los valores exactos, el código mínimo y el error típico. En `ejemplos/movimiento.html` está cada uno con su botón "Reproducir".

### 3.1 Entrada de página

**Cuándo:** al llegar a una pantalla nueva (no al volver con "atrás", no al cambiar de filtro).

| Qué | Valor |
|---|---|
| Qué se mueve | Solo el contenido del panel. Barra lateral, barra superior y migas quedan quietas |
| Cómo | `opacity 0 → 1` + `translateY(8px → 0)` |
| Duración y curva | `--dur-lento` (320 ms), `--ease` |
| Orden | 3 tandas: cabecera (0 ms) → KPIs (60 ms, +35 ms entre cada uno) → cuerpo (140 ms) |

```js
const tandas = [[cabecera], kpis, [cuerpo]];
const inicio = [0, 60, 140];
tandas.forEach((els, t) => els.forEach((el, i) =>
  el.animate(
    [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
    { duration: 320, easing: 'cubic-bezier(.23,1,.32,1)', delay: inicio[t] + i * 35, fill: 'backwards' }
  )));
```

**Error típico:** animar cada tarjeta por separado con su propio retraso largo (la página tarda un segundo en "terminar de llegar"), o animar también el menú.

### 3.2 Aparición escalonada de una lista

**Cuándo:** la primera vez que se llena una lista corta (avisos, "Para atender", pasos). No en tablas largas, no al filtrar, no al paginar.

| Qué | Valor |
|---|---|
| Cómo | `opacity 0 → 1` + `translateY(6px → 0)` |
| Duración y curva | 240 ms, `--ease` |
| Escalón | 35 ms entre filas; de la novena en adelante, mismo retraso que la octava |

```js
filas.forEach((f, i) => f.animate(
  [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
  { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)', delay: Math.min(i, 7) * 35, fill: 'backwards' }));
```

**Ojo:** `fill: 'backwards'` hace que la fila esté invisible durante su retraso, sin tener que esconderla antes con CSS. Así, si el JS falla, la lista se ve igual.

### 3.3 Hoja lateral

**Cuándo:** editar algo secundario sin cambiar de página (SKILL.md §5 Formularios).

| Qué | Entrada | Salida |
|---|---|---|
| Hoja | `translateX(100% + 16px) → 0` en 320 ms, `--ease` | `0 → 100% + 16px` en 200 ms, `--ease` |
| Velo | `opacity 0 → 1` en 240 ms | `1 → 0` en 180 ms |
| Contenido de la hoja | No se anima aparte: llega con la hoja | — |

```css
.hoja { transform: translateX(calc((100% + 16px) * var(--mueve))); opacity: 0; visibility: hidden;
        transition: transform 200ms var(--ease), opacity 180ms var(--ease), visibility 0s 200ms; }
.abierta .hoja { transform: none; opacity: 1; visibility: visible;
        transition: transform 320ms var(--ease), opacity 120ms var(--ease), visibility 0s; }
```

- Se abre y se cierra con una **clase y `transition`**, no con `@keyframes`: si la persona la cierra a mitad de camino, vuelve desde donde está, sin saltar.
- Esc cierra, el foco va al primer campo al abrir y vuelve al botón que la abrió al cerrar.
- **Error típico:** la hoja adentro de un contenedor con `transform` y `position: fixed` (ver §5): queda cortada o fuera de lugar.

### 3.4 Modal

**Cuándo:** solo para lo irreversible (anular, borrar definitivo). Lo reversible usa Deshacer (SKILL.md §5).

| Qué | Entrada | Salida |
|---|---|---|
| Caja | `opacity 0 → 1` + `scale(.96) translateY(8px) → none`, 240 ms, `--ease` | 150 ms, solo opacidad y `scale(.98)` |
| Velo | `opacity 0 → 1`, 200 ms | 150 ms |

- Crece desde el centro de la caja (`transform-origin: center`), no desde la esquina.
- Nunca rebota. Un modal de "¿Anular FAC-01098?" no festeja.

### 3.5 Toast

**Cuándo:** después de toda acción que guarda algo, junto con el éxito en el lugar. Abajo a la derecha (abajo al centro en celular, arriba de la acción fija).

| Qué | Valor |
|---|---|
| Entrada | `opacity 0 → 1` + `translateY(16px) scale(.98) → none`, 240 ms (`--dur-base`), `--ease` |
| Salida | `opacity → 0` + `translateY(8px)`, 180 ms |
| Vida | 5 s con Deshacer; 8 s si dice algo que hay que leer. **El tiempo se frena con el mouse encima** y con el foco adentro |
| Varios | Se apilan (máximo 3); el nuevo entra abajo y los anteriores suben con `--ease-mover` (FLIP, §3.10) |

- Una barrita fina de tiempo (`scaleX 1 → 0`, `linear`) dice cuánto le queda. Se pausa junto con el reloj.
- El toast no empuja nada: flota encima del contenido.

### 3.6 Menú (⋯, selects, filtros)

**Cuándo:** cada vez que se abre un desplegable.

| Qué | Entrada | Salida |
|---|---|---|
| Menú | `opacity 0 → 1` + `scale(.97) translateY(-4px) → none`, 180 ms, `--ease` | 120 ms, solo opacidad |
| Origen | `transform-origin` en la esquina del botón que lo abrió (arriba a la derecha si el ⋯ está a la derecha) | — |

- Los ítems **no** entran escalonados: el menú se usa decenas de veces por día.
- Abre con clic, Enter o espacio; cierra con Esc, clic afuera o al elegir.

### 3.7 Éxito en el lugar

**Cuándo:** la persona resolvió algo en una fila o tarjeta (Aprobar, Cobrar, tildar un paso).

| Paso | Qué pasa | Valor |
|---|---|---|
| 1 | El botón presionado se va | `opacity → 0` + `scale(.96)`, 120 ms |
| 2 | Aparece la pastilla "✓ Aprobado" en el mismo lugar | `scale(.8) → 1` + `opacity`, 240 ms, `--ease-resorte` |
| 3 | El check se dibuja | `stroke-dashoffset`, 200 ms, retraso 80 ms |
| 4 | La fila se tiñe de verde tenue | `background-color`, 400 ms, `--ease` |
| 5 | Toast con el ID, el monto, la consecuencia y Deshacer | §3.5 |

- La fila **no desaparece en el momento**. Se queda teñida y sale de la lista cuando la persona recarga, filtra o después del toast.
- Deshacer hace lo mismo al revés y en la mitad de tiempo.
- Es el único lugar, junto con el punto final del gráfico, donde va `--ease-resorte`.

### 3.8 Números que cuentan

**Cuándo:** la primera vez que aparece una cifra de KPI en la visita. No en tablas, no en cada refresco.

| Qué | Valor |
|---|---|
| Duración | 700 ms (`--dur-cuenta`); 500 ms para números de hasta 2 cifras |
| Curva | `1 - (1 - p)^3` (ease-out cúbica): llega rápido y frena al final |
| Desde | 0 la primera vez; **el valor anterior** cuando el dato cambia |
| Formato | Cada cuadro con `Intl.NumberFormat('es-AR')` y `tabular-nums`, para que el ancho no baile |

```js
function contar(el, desde, hasta, dur = 700) {
  const fmt = new Intl.NumberFormat('es-AR'), t0 = performance.now();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt.format(hasta); return; }
  const paso = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - (1 - p) ** 3;
    el.textContent = fmt.format(Math.round(desde + (hasta - desde) * e));
    if (p < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}
```

- La moneda y los centavos quedan quietos; cuenta solo la parte entera.
- El lector de pantalla tiene que leer el valor final: poné el número final en `aria-label` del contenedor, o marcá el número que cuenta con `aria-hidden` y dejá el valor final en texto oculto.

### 3.9 Gráficos que se dibujan

**Cuándo:** primera carga del gráfico. Al cambiar de período, los valores **se transforman** de uno a otro (240 ms, `--ease-mover`); no se vuelve a dibujar desde cero.

| Pieza | Cómo | Valor |
|---|---|---|
| Línea | `stroke-dasharray = largo`, `stroke-dashoffset: largo → 0` | 900 ms, `--ease` |
| Área degradé | `opacity 0 → 1` | 300 ms, empieza a los 450 ms |
| Punto marcado | `scale(0 → 1)` | 240 ms, `--ease-resorte`, al terminar la línea |
| Barras | `scaleY(0 → 1)` desde la base | 700 ms, `--ease`, 40 ms entre barras (tope 12) |
| Ejes, grilla y rótulos | No se animan | — |

```css
.barra { transform-box: fill-box; transform-origin: bottom; }
```

- En SVG, sin `transform-box: fill-box` la barra crece desde la esquina del gráfico, no desde su base.
- La línea usa `vector-effect: non-scaling-stroke` si el SVG se estira; en ese caso medí el largo con `getTotalLength()` en el sistema de coordenadas del `path`.

### 3.10 Arrastrar y soltar

**Cuándo:** pipeline por etapas, reordenar pasos, mover un equipo a otra línea.

| Momento | Qué pasa | Valor |
|---|---|---|
| Levantar (después de 4 px de arrastre) | La tarjeta sube: `scale(1.03) rotate(-1.5deg)` + sombra flotante | 180 ms, `--ease` |
| Lugar vacío | Donde va a caer aparece un hueco con borde punteado del alto de la tarjeta | Sin animación propia |
| Vecinos | Se corren para hacer lugar con FLIP | 200 ms, `--ease-mover` |
| Soltar | La tarjeta viaja al hueco y se apoya: `scale/rotate → none`, sombra → mínima | 240 ms, `--ease` |
| Cancelar (Esc o soltar afuera) | Vuelve a su lugar original | 240 ms, `--ease` |

**FLIP** (First, Last, Invert, Play) es la forma de animar un cambio de lugar sin animar `top` ni `left`: medís dónde estaba, movés el elemento en el DOM, medís dónde quedó y lo animás con `transform` desde la diferencia hasta 0.

```js
function flip(elementos, cambiar) {
  const antes = new Map(elementos.map(e => [e, e.getBoundingClientRect()]));
  cambiar();
  elementos.forEach(e => {
    const a = antes.get(e), d = e.getBoundingClientRect(), dx = a.left - d.left, dy = a.top - d.top;
    if (dx || dy) e.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
      { duration: 200, easing: 'cubic-bezier(.65,0,.35,1)' });
  });
}
```

- **Teclado:** espacio levanta, flechas mueven, espacio suelta, Esc cancela; un `aria-live` dice "Orbe Retail, en Negociación, posición 1 de 3".
- El conteo de cada columna se actualiza al soltar, no durante el arrastre.
- Al soltar en una etapa que dispara algo (Ganada, Perdida), el éxito en el lugar y el toast con Deshacer son los de §3.7.

### 3.11 Hover de tarjeta

**Cuándo:** solo en tarjetas que se pueden abrir con un clic. Una tarjeta quieta de contenido no reacciona.

| Qué | Valor |
|---|---|
| Cómo | `translateY(-2px)` + `--shadow-hover` + borde un tono más oscuro |
| Duración y curva | 240 ms, `--ease`; al salir, la misma |
| Flecha ↗ del título | Pasa de `texto-3` a `tinta` y se corre 1 px hacia arriba y la derecha |

```css
@media (hover: hover) {
  .tarjeta-link:hover { transform: translateY(calc(-2px * var(--mueve))); box-shadow: var(--shadow-hover); }
}
```

- Siempre dentro de `@media (hover: hover)`: en celular el hover se queda pegado después del toque.
- Filas de tabla: solo cambia el fondo a `hover`, 120 ms, sin subir.

### 3.12 Presionar un botón

| Estado | Valor |
|---|---|
| Presionado (`:active`) | `scale(.97)`, 120 ms (`--dur-micro`), `--ease` |
| Hover | Solo el fondo o la sombra, 120 ms. Nunca sube |
| Guardando | El botón conserva su ancho (`min-width` medido antes), dice "Guardando…" con un aro de 14 px que gira; queda deshabilitado |
| Éxito | "✓ Guardado" 1,5 s con el check que se dibuja, después vuelve a su texto o se cierra la hoja |

```css
.btn { transition: transform 120ms var(--ease), background-color 120ms, box-shadow 120ms; }
.btn:active { transform: scale(calc(1 - .03 * var(--mueve))); }
```

- Si la respuesta tarda menos de 300 ms, no se muestra "Guardando…": va directo al éxito.

### 3.13 Esqueleto

**Cuándo:** la carga tarda más de 300 ms. Si tarda menos, el contenido aparece con un fundido de 120 ms y nada más.

| Qué | Valor |
|---|---|
| Forma | La del contenido final: mismos altos, anchos variados (40 %, 70 %, 55 %) y mismos radios |
| Brillo | Degradé `suave → hover → suave` que pasa de izquierda a derecha, 1,4 s, `linear`, en bucle |
| Cambio a contenido | El esqueleto y el contenido ocupan la **misma celda de grilla**: el contenido entra con `opacity 0 → 1` en 200 ms y el esqueleto se va. Nada salta de lugar |
| Mínimo en pantalla | Si se mostró, se queda al menos 400 ms, para que no parpadee |

```css
.esq { background: linear-gradient(90deg, var(--suave), var(--hover), var(--suave)) 0 0 / 200% 100%;
       animation: brillo 1.4s linear infinite; }
@keyframes brillo { to { background-position: -200% 0; } }
.apilado { display: grid; } .apilado > * { grid-area: 1 / 1; }
```

- Nunca un spinner grande en el medio de la pantalla. El aro chico solo va adentro de un botón.

### 3.14 Reduced-motion

Si la persona pidió menos movimiento (`prefers-reduced-motion: reduce`), **nada se desplaza ni cambia de escala**, pero la interfaz sigue diciendo lo mismo:

| Patrón | Con movimiento | Reducido |
|---|---|---|
| Entrada de página, lista, toast, modal, menú, hoja | Desplazamiento + opacidad | Solo opacidad, 120 ms, sin escalonado |
| Números | Cuentan 700 ms | Aparecen con el valor final |
| Gráficos | Línea que se dibuja, barras que crecen | Aparecen completos con un fundido de 120 ms |
| Éxito en el lugar | Resorte y check que se dibuja | Cambio directo + teñido de la fila (el color no es movimiento) |
| Arrastrar | Levanta, gira, vecinos que se corren | La tarjeta sigue al puntero (es la acción misma), sin giro ni escala; los vecinos saltan |
| Hover y presionar | Sube 2 px, se hunde | Solo cambia la sombra o el fondo |
| Esqueleto | Brillo que pasa | Bloques quietos con opacidad que late lento (2 s) o quietos del todo |
| Punto "en vivo" | Late | Quieto |

Cómo hacerlo sin duplicar todo el CSS: **las distancias se multiplican por `--mueve`**, que vale 1 o 0.

```css
:root { --mueve: 1; }
@media (prefers-reduced-motion: reduce) {
  :root { --mueve: 0; }
  .esq, .vivo { animation: none; }
}
.toast { transform: translateY(calc(16px * var(--mueve))) scale(calc(1 - .02 * var(--mueve))); }
```

Y en JS, una sola función decide:

```js
const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function animar(el, cuadros, opciones) {
  if (reducido()) {   // misma animación, sin transform y corta
    const sin = cuadros.map(({ transform, ...resto }) => resto);
    return el.animate(sin.some(c => 'opacity' in c) ? sin : [{}, {}], { ...opciones, duration: 120, delay: 0 });
  }
  return el.animate(cuadros, opciones);
}
```

**Nunca** borres el estado final por respetar reduced-motion: el check tiene que aparecer, la fila tiene que teñirse y el número tiene que mostrar su valor.

---

## 4. Interrumpir sin romper

1. **Lo que abre y cierra va con `transition`; lo que pasa una vez va con `@keyframes` o `element.animate`.** Una transición se puede dar vuelta a mitad de camino; un keyframe empieza de nuevo desde el principio.
2. **Nada bloquea a la persona.** Mientras algo se anima, se puede hacer clic, escribir y cerrar. Nunca `pointer-events: none` en toda la pantalla ni "esperá a que termine".
3. **Volver a disparar cancela la anterior.** Antes de reproducir, `el.getAnimations().forEach(a => a.cancel())`.
4. **El estado final vive en el DOM, no en la animación.** La animación va del estado viejo al nuevo; si se corta o no corre, el DOM ya está bien. Por eso `fill: 'backwards'` y no `forwards`.
5. **En React**, una animación de entrada se vuelve a reproducir si el componente se monta otra vez: no cambies la `key` de una lista para refrescarla. Si el proyecto usa Motion, cargalo con `LazyMotion` + `m` y no con `motion`, para no sumar 30 KB al arranque.

---

## 5. Trampas conocidas

- **`transform` en un ancestro rompe `position: fixed`.** Si la página entra animada con `transform` y el toast o la hoja viven adentro, quedan pegados al contenedor y no a la ventana. Las capas flotantes van en un portal al final del `body`, fuera de lo que se anima, o la animación de entrada termina sin dejar `transform` puesto.
- **`will-change` solo mientras dura.** Ponelo al empezar y sacalo al terminar. Dejarlo fijo en 40 tarjetas llena la memoria de capas.
- **Nada de `transition: all`.** Anima cosas que no esperabas (el `width` al cambiar de tamaño, el color al cambiar de tema).
- **El cambio de tema no se anima** más allá de un fundido de 200 ms del fondo. Si todo transiciona a la vez, la pantalla parpadea.
- **No mezcles un escalonado con datos que llegan de a poco.** Si las filas llegan en dos tandas, la segunda entra sin escalonado.
- **Celular:** las mismas duraciones; los gestos (deslizar para cerrar la hoja) siguen al dedo sin curva y, al soltar, terminan con `--ease` en 240 ms.

---

## 6. Antes de entregar

1. ¿Cada animación explica algo (origen, destino o cambio)? ¿La sacaría y se perdería información?
2. ¿Lo que se ve cientos de veces por día aparece directo?
3. ¿Usa solo los tokens (120 / 180 / 240 / 320 / 700 / 900 y las tres curvas)? ¿Ningún `ease-in`, `linear` fuera del esqueleto, ni `transition: all`?
4. ¿Las salidas son más rápidas que las entradas?
5. ¿El escalonado tiene tope de 8 ítems y 300 ms en total?
6. ¿Se puede interrumpir? Abrí y cerrá la hoja rápido tres veces: no tiene que saltar.
7. ¿Con `prefers-reduced-motion` no se desplaza nada, pero el estado final (check, color, número) sigue apareciendo?
8. ¿Probaste en `ejemplos/movimiento.html` el mismo patrón al lado del tuyo, a 390 px y en oscuro?
