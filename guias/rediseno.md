# Rediseño: pasar una pantalla vieja a este lenguaje sin romper nada

Cómo agarrar una pantalla que ya funciona en un sistema existente (una lista de facturas, un tablero armado hace años, una ficha con veinte campos) y llevarla a este lenguaje **sin cambiar lo que hace**. Va con SKILL.md (sobre todo §7 y §8), `guias/jerarquia-y-espacios.md`, `guias/textos.md`, `guias/iconos.md`, `guias/movimiento.md`, el revisor `scripts/revisar.mjs` y las piezas de `componentes/`.

Los ejemplos usan la marca inventada **Estudio Faro** y sus clientes de ejemplo (Orbe Retail, Casa Lumen, Mesa Fina, Grupo Atlas, Estudio Norte). La sección 10 trae un rediseño completo de una pantalla de **Cobranzas**.

---

## 0. La regla en una línea

**Se cambia la piel, no el esqueleto.** Los mismos datos, las mismas acciones, las mismas rutas y los mismos permisos, en otro orden y con otra cara. Todo lo que se saca de la vista se muda a otro lugar a la vista de alguien, y queda anotado.

Tres consecuencias:

1. **Primero el inventario, después el dibujo.** Si no sabés qué muestra y qué hace la pantalla hoy, no sabés qué rompiste.
2. **De a una capa y de a una pantalla.** Cada tanda se puede publicar sola y se puede volver atrás sola.
3. **Cada cifra que cambia se avisa.** Si el rediseño hace que un total diga otra cosa (porque antes sumaba pesos con dólares, por ejemplo), eso no es diseño: es una decisión del dueño de los datos y va en el informe.

---

## 1. El recorrido completo

| Paso | Qué sale | Sección |
|---|---|---|
| 1. Relevar | Capturas del antes + inventario de datos, acciones, estados y entradas | §2 |
| 2. Detectar | Lista de problemas con la nota del revisor y las pilas Actuar / Saber / Consultar | §3 |
| 3. Mapear | Tabla de equivalencias: cada elemento viejo → su pieza nueva (o a dónde se muda) | §4 |
| 4. Priorizar | Tandas en orden: tokens → marco → cabecera → piezas → vida | §5 |
| 5. Migrar tokens | Alias de las variables viejas a las nuevas, sin romper las otras pantallas | §6 |
| 6. Cuidar | Lo que no se toca | §7 |
| 7. Comparar | Antes y después en las mismas condiciones, dato por dato | §8 |
| 8. Informar | Informe de rediseño con la plantilla | §9 |

No se saltea ninguno. En una pantalla chica cada paso lleva minutos; en una grande, el relevamiento es lo que más tarda y lo que más ahorra.

---

## 2. Relevar

### 2.1 Capturas del antes

Sacá las capturas **antes de tocar una línea**, con datos que después puedas repetir:

- **Mismos datos:** una base de prueba con semilla, o la de producción en un momento fijo. Si la pantalla depende de "hoy", fijá la fecha (variable de entorno, reloj falso en la prueba) o anotala.
- **Tres tomas como mínimo:** 1440 px de ancho, 390 px (celular) y, si existe, en oscuro. Página entera.
- **Los estados que se puedan forzar:** vacío (un filtro que no trae nada), cargando (red lenta en las herramientas del navegador) y error (cortá la red o apuntá a una ruta que falle).

```sh
# Con el CLI de Playwright (una vez: mkdir -p /tmp/pw && cd /tmp/pw && npm i playwright && npx playwright install chromium)
cd /tmp/pw
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=1500 http://localhost:3000/cobranzas antes-1440.png
npx playwright screenshot --full-page --viewport-size=390,844  --wait-for-timeout=1500 http://localhost:3000/cobranzas antes-390.png
npx playwright screenshot --full-page --viewport-size=1440,900 --color-scheme=dark   http://localhost:3000/cobranzas antes-oscuro.png
```

Si la pantalla necesita sesión, usá el revisor o una prueba de Playwright con el estado guardado (`storageState`). Guardá las capturas con el informe, no en `/tmp`: la máquina lo limpia.

### 2.2 Inventario de datos

Una fila por cada dato que la pantalla muestra, **incluidos los escondidos** (tooltips, columnas que aparecen al ensanchar, el título de la pestaña del navegador, lo que se exporta).

| Dato | De dónde sale | Cómo se ve hoy | ¿Se usa para decidir? | Va a… |
|---|---|---|---|---|
| Saldo de la factura | `GET /api/facturas` → `saldo` | `18400.5` sin separador | Sí: es lo que se cobra | Tabla, derecha, `US$ 18.400,50` |
| CUIT del cliente | `cliente.cuit` | Columna propia | No en la lista; sí al facturar | Hoja de la factura |

La última columna se completa en el paso 3. **Ningún dato queda con "Va a…" vacío.** Si se decide sacarlo, se escribe "se saca" y por qué, y entra en el informe.

### 2.3 Inventario de acciones

Una fila por cada cosa que se puede hacer, desde el botón grande hasta el clic en una fila o el atajo de teclado.

| Acción | Dónde está hoy | Qué hace (de verdad, en el servidor) | ¿Se puede deshacer? | Quién puede | Va a… |
|---|---|---|---|---|---|
| Registrar cobro | Ícono `$` en la fila → modal | `POST /api/cobros` | Sí, anulando el cobro | Administración | Botón "Cobrar" en la fila + hoja lateral |
| Eliminar factura | Ícono tacho en la fila → `confirm()` | `DELETE /api/facturas/:id` (borra) | **No** | Solo dueño | Menú ⋯, último grupo, con modal |

La columna "¿Se puede deshacer?" se contesta mirando el servidor, no la interfaz: decide si va Deshacer o modal (SKILL.md §5 Acciones). Si la interfaz pide confirmación para algo que el servidor sí permite revertir, el modal se cambia por un toast con Deshacer **solo si el endpoint para revertir ya existe**. Si no existe, el modal se queda y la mejora va al informe como pendiente.

### 2.4 Estados y entradas

- **Estados:** ¿qué muestra hoy con cero filas, mientras carga, cuando falla y mientras guarda? Anotalo aunque sea "nada" o "spinner".
- **Entradas:** ¿desde dónde se llega a esta pantalla y con qué parámetros? Links del menú, de otros tableros, de correos y avisos (`?estado=vencida`, `?cliente=123`, `#fac-01098`), favoritos de la gente. Cada parámetro que entra tiene que seguir funcionando igual después.
- **Salidas:** exportar a Excel, imprimir, compartir link, abrir en pestaña nueva. Se mantienen todas.

---

## 3. Detectar los problemas

### 3.1 El revisor

Pasá el revisor sobre la pantalla vieja y guardá la salida: la nota es la línea de base del informe.

```sh
cd /tmp/pw
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas --json > antes.json
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas --celular
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas --oscuro
```

El revisor mide reglas: botones rellenos, dos voces tipográficas, radios, contraste, toques de 44 px, estado solo con color, cifras sin `tabular-nums`, desborde a 390 px. No mide vida ni jerarquía; eso va a mano.

### 3.2 La lista a mano

Recorré la captura con SKILL.md §7 (antipatrones) y §8 (antes de entregar) y anotá cada problema con su lugar. Los que más aparecen en pantallas viejas, en orden de frecuencia:

1. Menú o barra superior de color de marca saturado.
2. Varios botones rellenos, uno de cada color por acción (verde guardar, rojo borrar, naranja enviar).
3. Cajas de totales pintadas, con el número en blanco y sin contexto ni período.
4. Tabla con líneas verticales, encabezados en MAYÚSCULA negrita y filas pintadas por estado.
5. Estados en pastilla saturada con texto blanco, o solo con color.
6. Fechas ISO (`2026-11-03`), montos sin separador, `0` o `null` donde no hay dato, monedas sumadas.
7. Íconos de dos o tres juegos mezclados.
8. Modal que tapa todo para editar algo menor; `alert()` para avisar que salió bien; `confirm()` para todo.
9. Spinner en el medio de la pantalla y "No se encontraron registros" como único vacío.
10. Celular = la tabla de escritorio con scroll horizontal.

### 3.3 Las tres pilas

Antes de mapear, repartí el inventario de datos en **Actuar / Saber / Consultar** (`guias/jerarquia-y-espacios.md` §1). Las pantallas viejas casi siempre tienen todo en *Consultar* con el mismo peso: una tabla larga con lo urgente perdido en la fila 37. El rediseño sube *Actuar* a la cabecera y a la primera fila, deja *Saber* en los KPIs y manda *Consultar* abajo o a la ficha.

### 3.4 Severidad

| Nivel | Qué es | Ejemplo | Cuándo se arregla |
|---|---|---|---|
| **Rompe** | Da un dato falso o esconde algo que hay que hacer | Total que suma pesos y dólares; vencidas mezcladas sin marca | En la primera tanda que toque esa pieza, **avisando** |
| **Frena** | Hace la tarea más lenta o con más errores | Filtro que necesita "Buscar"; éxito que recarga la página y pierde el filtro | En la tanda de piezas |
| **Afea** | Va contra el lenguaje pero no traba el trabajo | Radios sueltos, MAYÚSCULAS, sombras marcadas | En la tanda que corresponda por capa |

---

## 4. Mapear: tabla de equivalencias

Cada elemento de la pantalla vieja tiene una pieza nueva o un lugar nuevo. Las piezas están en `componentes/` (React + TS + Tailwind v4), en `ejemplos/recetas-tailwind.md` y, en HTML, en `ejemplos/componentes.html`.

### 4.1 Marco y cabecera

| Lo viejo | Lo nuevo | Pieza |
|---|---|---|
| Barra superior de color con los links del menú | Barra lateral sobre el lienzo, grupos con rótulo, activo en pastilla blanca | `estructura/BarraLateral` dentro de `estructura/MarcoApp` |
| Menú hamburguesa en celular | Barra inferior de 4 íconos con el activo en pastilla | `MarcoApp` (prop `barraInferior`) |
| "Inicio > Módulos > Cobranzas" en texto suelto | Migas en la barra del panel, padre gris y página en `tinta` | `estructura/Cabecera` → `BarraSuperior` |
| Título en MAYÚSCULA negrita + párrafo "En esta sección puede…" | Título corto 22–24/500 + subtítulo con cifras reales | `Cabecera` con `cifras` |
| Fila de botones de colores arriba | Un `BotonPrincipal` + secundarios con borde; lo que actúa sobre una fila baja a la fila | `BotonPrincipal`, `BotonSecundario` |
| Select de estado + botón "Buscar" | Segmentado con conteo, filtra al tocar, queda en la URL | `base/Segmentado` |
| Selects de cliente, mes, vendedor | Chips de filtro; "Limpiar" aparece solo con filtros puestos | `base/Etiqueta` → `EtiquetaFiltro` |
| Buscador en un rincón | ⌘K en la barra lateral o en la barra del panel | `BarraLateral` (`buscar`) |

### 4.2 Datos

| Lo viejo | Lo nuevo | Pieza |
|---|---|---|
| Caja de total pintada con número blanco | KPI en bandeja con tarjeta adentro: rótulo con ícono, cifra, contexto, dibujo y pie con período | `datos/Kpi` |
| El total más importante, igual que los otros | Un protagonista con degradé del acento y curva blanca | `datos/KpiProtagonista` |
| "75 %" suelto | Rayitas, bloques o anillo + "3 de 4" | `datos/Rayitas`, `datos/Bloques`, `datos/Anillo` |
| "+12" en verde por ser positivo | Variación con flecha, período y color según si es bueno para el negocio | `datos/Variacion` |
| Gráfico de torta para avance o reparto | Barra apilada o barras con el período en curso rayado | `datos/BarrasApiladas` |
| Gráfico con los colores por defecto de la librería | Paleta `dato-1…6`, leyenda arriba, tooltip oscuro | `datos/Curva`, `datos/BarrasApiladas` |
| Número que aparece de golpe | Cuenta hasta su valor en ~600–900 ms (sin animación con reduced-motion) | `datos/Cuenta` |
| `18400.5`, `2026-11-03`, `null`, `0` sin dato | `US$ 18.400,50` con moneda y centavos en gris, "hace 6 días" / "9 dic", "—" | `datos/formato` |

### 4.3 Listas y tablas

| Lo viejo | Lo nuevo | Pieza / regla |
|---|---|---|
| Tabla con bordes en todas las celdas | Sin líneas verticales, `divide-divisor`, encabezado en bandeja | `ejemplos/recetas-tailwind.md` → Tabla |
| Encabezados `NÚMERO DE FACTURA` | "Comprobante", 12 px gris, minúscula inicial | `guias/textos.md` |
| Fila entera pintada de rojo por vencida | Pastilla "Vencida" + fecha en rojo; la fila queda blanca | `base/Pastilla` |
| Badge saturado con texto blanco | Pastilla: fondo al 10 %, texto saturado, punto de 6 px, palabra | `base/Pastilla` |
| Columna "Moneda" aparte del monto | Moneda pegada al monto, en gris; nunca se suman monedas distintas | `datos/formato` |
| Cliente como texto plano | Monograma o logo + rayita de 3 px del color de la entidad | `base/Avatar`, `colorDe` en `base/utilidades` |
| Cuatro íconos de acción por fila | Una acción rellena chica (la que resuelve) + ⋯ con el resto en grupos | `Seccion` → `BotonChico`, `base/Menu` |
| Paginación 1 2 3 … 12 | Grupos por urgencia ("Vencidas / Esta semana / Más adelante") + "Ver 14 más" | `guias/jerarquia-y-espacios.md` |
| Tabla con scroll horizontal en celular | Tarjetas de 2 líneas: título y monto arriba, estado y fecha abajo | SKILL.md §6e |

### 4.4 Acciones, formularios y estados

| Lo viejo | Lo nuevo | Pieza |
|---|---|---|
| Modal centrado para editar o registrar algo menor | Hoja lateral derecha de 380–440 px, la lista sigue a la vista | Receta de hoja en `ejemplos/componentes.html` |
| Página aparte para "Editar" | Hoja lateral; la página aparte queda solo para altas largas | idem |
| `alert('Operación exitosa')` + recarga | Éxito en el lugar: fila verde tenue, pastilla "✓ Cobrada", toast con ID, monto, consecuencia y Deshacer | `estructura/Toast` |
| `confirm('¿Está seguro?')` para algo reversible | Hacerlo y ofrecer Deshacer | `Toast` |
| `confirm()` para algo irreversible | Modal con el nombre de lo que se pierde y el botón que dice qué hace ("Borrar FAC-01090") | `guias/textos.md` §8 |
| Botón deshabilitado sin motivo | No se muestra; si se muestra, dice por qué | SKILL.md §5 Acciones |
| Spinner en el medio | Esqueletos con la forma final, después de 300 ms | `estructura/Esqueleto` |
| "No se encontraron registros" | Vacío que dice qué va a aparecer y trae el botón; si es por un filtro, lo dice y ofrece limpiarlo | `estructura/Vacio` |
| Error en `alert()` o página en blanco | Error en el lugar, con lo que ya estaba a la vista y "Reintentar" | `estructura/ErrorEnLugar` |
| `title="..."` nativo en íconos | Tooltip con `aria-label` | `base/Tooltip` |
| Íconos de Font Awesome, Material o Lucide mezclados | Phosphor, regular en todo y fill en el activo | `guias/iconos.md` |

**Lo que no tiene fila en estas tablas se piensa de nuevo**, no se fuerza en la pieza más parecida. Si aparece algo que no entra en ninguna, se anota como hallazgo en el informe.

---

## 5. Priorizar: el orden de las tandas

Siempre de afuera hacia adentro y de lo global a lo local:

| Tanda | Qué cambia | Alcance | Riesgo | Se publica sola |
|---|---|---|---|---|
| **1. Tokens** | Colores, letras, radios y sombras pasan a `tokens.css`; las variables viejas quedan como alias | Todo el sistema, cambio sutil | Bajo si hay alias, alto sin alias | Sí |
| **2. Marco** | Barra lateral, lienzo, panel con migas, barra inferior en celular | Todo el sistema | Medio: cambia la navegación | Sí, con la 1 o sola |
| **3. Cabecera** | Título, subtítulo con cifras, un solo botón relleno, filtros en segmentado y chips | Una pantalla | Bajo | Sí |
| **4. Piezas** | KPIs en bandeja, tabla, pastillas, acciones en fila, hoja lateral, toast, vacío/cargando/error | Una pantalla | Medio: toca acciones | Sí, de a una pieza si hace falta |
| **5. Vida** | Color por entidad, dibujos, protagonista, panel de contexto, movimiento | Una pantalla | Bajo | Sí |
| **6. Celular y oscuro** | Tarjetas de 2 líneas, píldora fija abajo, revisión en oscuro | Una pantalla | Bajo | Sí |

Por qué este orden:

- **Tokens primero** porque todo lo demás los usa. Hacer piezas nuevas con colores sueltos es trabajo que se tira.
- **Marco antes que la pantalla** porque es lo único que se ve en todas: si lo dejás para el final, durante semanas convive una pantalla nueva adentro de un marco viejo y todo se ve peor.
- **Cabecera antes que piezas** porque decide la jerarquía. Con la cabecera bien, una tabla vieja ya se lee mejor; al revés, no.
- **Vida al final** porque sin estructura es decoración. Un gráfico lindo encima de una tabla mal ordenada sigue siendo una tabla mal ordenada.

Reglas de las tandas:

1. **Una tanda = un commit (o un PR) que se puede revertir solo.** Nunca mezclar tokens globales con piezas de una pantalla.
2. **La pantalla nunca queda a medias publicada.** Si la tanda 4 no terminó, no se publica la mitad de la tabla nueva al lado de la mitad vieja.
3. **Primero la pantalla que más se usa**, no la más fácil. Lo que se ve todos los días define la sensación del sistema.
4. **Lo que "rompe" (§3.4) se arregla en la primera tanda que toque esa pieza**, aunque sea la 1, y se avisa.
5. Si la pantalla es crítica (cobra, factura, liquida), publicala detrás de una **bandera** (cookie o variable por usuario) una semana con dos o tres personas del equipo antes de dejarla para todos. Las dos versiones leen del mismo cargador de datos: la bandera solo elige la vista.

---

## 6. Migrar los tokens de a poco en un proyecto Tailwind

La idea: **no se reemplazan clases en todo el proyecto de un saque**. Se agregan los tokens nuevos, se apuntan las variables viejas a las nuevas (alias) para que todo lo existente cambie de tono sin tocar su código, y después cada pantalla que se rediseña pasa a usar los nombres nuevos. Cuando ya nadie usa un alias, se borra.

### 6.1 Paso a paso

1. **Medí la deuda.** Contá cuántas clases sueltas hay antes de empezar; es el número que tiene que bajar.

   ```sh
   # Colores sueltos de la paleta de Tailwind y hex a mano, por archivo
   rg -c "\b(bg|text|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|blue|indigo|violet|purple|pink|rose)-[0-9]{2,3}\b" app components src | sort -t: -k2 -nr | head -20
   rg -c "#[0-9a-fA-F]{6}\b" app components src --glob "*.{tsx,jsx,css}" | sort -t: -k2 -nr | head -20
   # Radios y sombras fuera de escala
   rg -o "rounded-(sm|md|lg|xl|2xl|3xl|\[[0-9]+px\])" app components src | sort | uniq -c | sort -nr
   rg -o "shadow-(sm|md|lg|xl|2xl)" app components src | sort | uniq -c | sort -nr
   ```

2. **Agregá `tokens.css`** al CSS global, después de `@import "tailwindcss"`. Con el `@theme` de v4 aparecen solas las clases `bg-fondo`, `bg-panel`, `bg-superficie`, `bg-suave`, `text-tinta`, `text-texto-2`, `border-borde`, `rounded-tarjeta`, `rounded-control`, `rounded-chip`, `shadow-min`, `shadow-flotante`, `font-display`, `font-mono`, etc. Ajustá antes el acento y el tinte del sistema (y `marcas.local.md` si existe).
3. **Apuntá las variables viejas a las nuevas** (6.2 y 6.3). Mirá el sistema entero: tiene que verse igual de ordenado que antes, con otro tono. Esta es la tanda 1.
4. **En cada pantalla que rediseñás**, cambiá las clases viejas por las nuevas (6.4) y usá las piezas de `componentes/`. Archivo por archivo, a mano o con un reemplazo revisado; nunca un `sed` global sobre todo el repo.
5. **Cuando el conteo del paso 1 llega a cero para un alias**, borralo.

### 6.2 Proyecto con shadcn/ui (Tailwind v4)

shadcn define sus variables en `:root` y `.dark` y las publica con `@theme inline`. Dejá el `@theme inline` como está y **reemplazá los valores** de `:root` y `.dark` por alias a los tokens nuevos:

```css
@import "tailwindcss";
@import "./tokens.css";   /* el de la skill, con el acento y el tinte del sistema */

/* Alias: shadcn → diseno-sistemas. Van en el MISMO selector donde se pone el tema
   (:root y .dark / [data-tema]) para que se recalculen cuando cambia. */
:root, .dark, [data-tema='oscuro'] {
  --background: var(--color-panel);
  --foreground: var(--color-tinta);
  --card: var(--color-superficie);
  --card-foreground: var(--color-tinta);
  --popover: var(--color-superficie);
  --popover-foreground: var(--color-tinta);
  --primary: var(--color-acento);
  --primary-foreground: #fff;
  --secondary: var(--color-suave);
  --secondary-foreground: var(--color-tinta);
  --muted: var(--color-suave);
  --muted-foreground: var(--color-texto-2);
  --accent: var(--color-hover);            /* OJO: en shadcn "accent" es el fondo de hover, NO el acento de marca */
  --accent-foreground: var(--color-tinta);
  --destructive: var(--color-rojo-texto);
  --border: var(--color-borde);
  --input: var(--color-borde-fuerte);
  --ring: var(--color-acento);
  --radius: 12px;                          /* shadcn deriva sm 8 · md 10 · lg 12 · xl 16 */
  --chart-1: var(--color-dato-1); --chart-2: var(--color-dato-2); --chart-3: var(--color-dato-3);
  --chart-4: var(--color-dato-4); --chart-5: var(--color-dato-5);
  --sidebar: var(--color-fondo);
  --sidebar-foreground: var(--color-tinta);
  --sidebar-accent: var(--color-superficie);   /* ítem activo: pastilla blanca, nunca color de marca */
  --sidebar-accent-foreground: var(--color-tinta);
  --sidebar-border: var(--color-borde);
}
```

Tres trampas:

- **`accent` no es `acento`.** En shadcn, `bg-accent` es el gris del hover de los menús. Si lo apuntás al color de marca, todos los menús se pintan.
- **Borrá los valores literales del bloque `.dark` de shadcn.** Si quedan, pisan los alias y el oscuro sale con los grises de shadcn.
- **Las letras.** `tokens.css` define `--font-sans`, `--font-display` y `--font-mono`. Si el proyecto carga las fuentes con `next/font`, no uses esos mismos nombres en `variable:`; cargalas como `--fuente-display`, `--fuente-ui`, `--fuente-mono` y en el `@theme` poné `--font-display: var(--fuente-display), ui-sans-serif, sans-serif;`. Si no, una pisa a la otra y queda la letra del sistema.

### 6.3 Proyecto con Tailwind v3 o variables propias

Sin `@theme`, los tokens van como variables en `:root` y se publican en `tailwind.config`:

```js
// tailwind.config.js (v3)
const v = n => `var(--color-${n})`
module.exports = {
  darkMode: ['class', '[data-tema="oscuro"]'],
  theme: { extend: {
    colors: {
      fondo: v('fondo'), panel: v('panel'), superficie: v('superficie'), suave: v('suave'),
      borde: v('borde'), divisor: v('divisor'), tinta: v('tinta'),
      'texto-2': v('texto-2'), 'texto-3': v('texto-3'), acento: v('acento'),
    },
    borderRadius: { app: '26px', marco: '20px', tarjeta: '20px', interno: '16px', control: '12px', chip: '8px' },
    boxShadow: { min: 'var(--shadow-min)', hover: 'var(--shadow-hover)', flotante: 'var(--shadow-flotante)' },
    fontFamily: { display: ['Geist', 'sans-serif'], sans: ['Geist', 'sans-serif'], mono: ['"Geist Mono"', 'monospace'] },
  } },
}
```

Y las variables viejas del proyecto, como alias: `--brand-primary: var(--color-acento); --gray-bg: var(--color-fondo);`.

Trampa de v3: los modificadores de opacidad (`bg-acento/10`) no funcionan con una variable que guarda un hex. Para los fondos al 10 % de los estados usá los tokens ya hechos (`verde-fondo`, `rojo-fondo`…) o `color-mix(in oklch, var(--color-acento) 10%, white)`.

### 6.4 Clases viejas → nuevas

| Clase vieja | Clase nueva | Ojo con |
|---|---|---|
| `bg-white` | `bg-superficie` | En el lienzo de la app va `bg-fondo`, no blanco |
| `bg-gray-50` / `bg-slate-50` | `bg-panel` (área principal) o `bg-suave` (riel, encabezado de tabla) | Elegí por el papel, no por el tono |
| `bg-gray-100` | `bg-suave` | |
| `border-gray-200` / `border-gray-300` | `border-borde` / `border-borde-fuerte` (campos) | Bordes de 2 px pasan a 1 px |
| `divide-gray-200` | `divide-divisor` | |
| `text-gray-900` / `text-black` | `text-tinta` | |
| `text-gray-500` / `text-gray-600` | `text-texto-2` | |
| `text-gray-400` | `text-texto-3` | Solo metadatos: no para texto que decide (contraste) |
| `bg-blue-600 text-white` (botón) | `bg-acento` o `bg-tinta` **solo en el principal**; el resto `bg-superficie border` | Contá los rellenos al terminar |
| `bg-red-100 text-red-800` (badge) | `<Pastilla tono="rojo">` | Siempre con palabra y punto |
| `bg-red-50` en `<tr>` | nada: la fila queda blanca | El estado va en la pastilla |
| `rounded` / `rounded-md` | `rounded-control` (botón, campo) o `rounded-chip` (pastilla) | |
| `rounded-lg` / `rounded-xl` en tarjetas | `rounded-tarjeta`; la tarjeta dentro de bandeja, `rounded-interno` | Radios en capas |
| `shadow` / `shadow-md` en tarjetas | nada (tarjeta quieta) o `shadow-min` (botón, tarjeta interna) | `shadow-hover` solo en clickeables |
| `shadow-lg` / `shadow-xl` en modales y menús | `shadow-flotante` | |
| `font-bold` | `font-medium` o `font-semibold` | Nada de 700 |
| `uppercase tracking-wide` en `<th>` | sacar | La mayúscula queda en los rótulos del menú |
| `text-2xl font-bold` en el título | `font-display text-2xl font-medium tracking-tight` | |
| `tabular-nums` ausente en montos | `tabular-nums text-right` | Moneda y centavos en `text-texto-3` |

---

## 7. Qué no se toca

Un rediseño **no** cambia nada de esto. Si hace falta cambiarlo, es otro trabajo, con su propio pedido, y va en el informe como pendiente.

1. **Datos y cálculos.** Las consultas, los totales del servidor, los redondeos, las reglas de negocio. La vista puede ordenar y agrupar distinto lo que llega; no recalcula montos por su cuenta.
2. **Rutas y parámetros.** La URL de la pantalla, los parámetros que entran (`?estado=`, `?cliente=`, `#fila`) y los links que salen. Si el filtro nuevo es un segmentado, sigue escribiendo el mismo parámetro.
3. **Permisos.** Lo que un rol no veía, sigue sin verlo. Al mover una acción al menú ⋯, la condición de permiso se muda con ella.
4. **Endpoints y nombres de campos de formulario.** Los `name` de los campos, el cuerpo que se manda y las validaciones del servidor.
5. **Salidas.** Exportar, imprimir (incluida la hoja de estilos de impresión), PDF, correos que arma el sistema.
6. **Ganchos de pruebas y de otros sistemas.** `data-testid`, IDs que usan las pruebas, selectores de extensiones o integraciones, eventos de analítica. Si una prueba busca el texto "Buscar" y ese botón desaparece, se actualiza la prueba **a propósito** y se anota.
7. **Atajos de teclado** que la gente ya usa.
8. **Textos legales o fiscales** (leyendas de factura, condiciones) aunque parezcan relleno.
9. **Comportamiento de guardado.** Si antes guardaba al salir del campo, sigue guardando al salir del campo.
10. **Lo que no entendés.** Una columna rara, un botón que nadie sabe qué hace: se pregunta antes de sacarlo. Mientras tanto, se muda al menú ⋯ o a la ficha.

---

## 8. Comparar antes y después

### 8.1 En las mismas condiciones

Las capturas del después se sacan **con los mismos datos, la misma fecha, los mismos anchos y el mismo tema** que las del antes (§2.1). Si cambia una sola de esas cosas, la comparación no vale.

Para ponerlas lado a lado, el formato de `ejemplos/antes-despues.html` sirve de modelo: el antes a la izquierda, el después a la derecha y, abajo de cada par, qué cambió y por qué.

### 8.2 Lo que se compara

| Chequeo | Cómo | Pasa si |
|---|---|---|
| **Ningún dato perdido** | Recorré el inventario de datos (§2.2) y buscá cada uno en el después | Todos están, o están en "se saca" con motivo y OK |
| **Ninguna acción perdida** | Recorré el inventario de acciones (§2.3) y ejecutá cada una | Todas funcionan, con los mismos permisos |
| **Mismas entradas** | Abrí cada link y parámetro anotado en §2.4 | Llegan a la misma fila o filtro |
| **Mismas cifras** | Compará los totales del antes y del después | Iguales, salvo los "rompe" avisados |
| **Nota del revisor** | `revisar.mjs` en 1440, `--celular` y `--oscuro` | 85 o más en las tres |
| **Prueba de los 5 segundos** | Mostrale el después a alguien del equipo 5 segundos y preguntale qué tiene que hacer hoy | Lo dice sin dudar |
| **Clics de la tarea principal** | Contá los clics de la tarea más frecuente (por ejemplo, registrar un cobro) en el antes y en el después | Igual o menos |
| **Peso y velocidad** | Tamaño del JS de la ruta y LCP, antes y después | No empeora más de un 10 % |
| **Pruebas automáticas** | La suite entera | Verde; las que se cambiaron, anotadas |
| **Lado a lado con las referencias** | La captura del después junto a 06, 07, 08 o 14 | No se ve más pobre ni más plana |

### 8.3 Después de publicar

Una semana después, preguntá a dos o tres personas que usan la pantalla todos los días qué les cuesta ahora. Lo que digan va como apéndice del informe; si algo se volvió más lento, se arregla antes de pasar a la pantalla siguiente.

---

## 9. Plantilla de informe de rediseño

Copiala en el repo del sistema (por ejemplo `docs/rediseno/<pantalla>.md`) junto con las capturas.

```markdown
# Rediseño: <Pantalla> (<sistema>)

**Ruta:** /<ruta> · **Quién la usa:** <roles> · **Tarea principal:** <la más frecuente, con verbo>
**Fecha:** <día> · **Tandas:** <1–6> · **Bandera:** <nombre o "no">

## Antes
- Capturas: antes-1440.png · antes-390.png · antes-oscuro.png
- Nota del revisor: <n>/100 (1440) · <n>/100 (390) · <n>/100 (oscuro)
- Clics de la tarea principal: <n>

## Inventario
### Datos
| Dato | Origen | Antes | Después |
|---|---|---|---|

### Acciones
| Acción | Antes | Después | Deshacer / modal | Permiso |
|---|---|---|---|---|

### Entradas y salidas
- Entradas: <links y parámetros, uno por línea>
- Salidas: <exportar, imprimir, etc.>

## Problemas encontrados
| # | Problema | Dónde | Severidad (rompe / frena / afea) | Se arregla en tanda |
|---|---|---|---|---|

## Mapa
| Lo viejo | Lo nuevo | Pieza |
|---|---|---|

## Tandas
| Tanda | Qué entra | Commit / PR | Publicada |
|---|---|---|---|

## Cifras que cambian (necesitan OK)
- <qué decía, qué dice ahora, por qué, quién lo aprobó>

## Qué se mudó o se sacó
- <dato o acción> → <dónde quedó> / se saca porque <motivo>

## Después
- Capturas: despues-1440.png · despues-390.png · despues-oscuro.png
- Nota del revisor: <n>/100 · <n>/100 · <n>/100
- Clics de la tarea principal: <n>
- Peso de la ruta / LCP: <antes> → <después>
- Pruebas cambiadas: <cuáles y por qué>

## Pendientes (fuera del rediseño)
- <lo que necesita cambio de servidor, de datos o una decisión>
```

---

## 10. Ejemplo completo: Cobranzas de Estudio Faro

### 10.1 La pantalla vieja (descripta)

Estudio Faro tiene un sistema interno hecho hace cuatro años con Next y Tailwind v3. La pantalla `/cobranzas` es la que más usa administración: la abre Sofía todas las mañanas para ver qué cobrar y registrar lo que entró.

De arriba hacia abajo:

1. **Barra superior azul saturado** (`bg-blue-800`) de 64 px, con el logo en blanco y nueve links en blanco: Inicio, Clientes, Proyectos, Propuestas, Facturación, Cobranzas, Proveedores, Reportes, Configuración. El activo, subrayado. En celular, un menú hamburguesa que despliega los nueve.
2. **Título** "COBRANZAS" en 28 px negrita y, debajo, "En esta sección puede gestionar las cobranzas de sus clientes y registrar los pagos recibidos."
3. **Cuatro botones** en fila a la derecha del título: "Nueva factura" (verde), "Exportar Excel" (verde oscuro), "Imprimir" (gris relleno), "Enviar recordatorios" (naranja). Íconos de Font Awesome.
4. **Cuatro cajas de totales** pintadas, con texto blanco y el número en 32 px negrita: "COBRADO $ 41600" (verde), "PENDIENTE $ 64300" (amarillo con texto blanco), "VENCIDO $ 21900" (rojo), "TOTAL $ 4.286.300" (azul). El total azul suma los saldos en dólares con los saldos en pesos. Ninguna dice de qué período.
5. **Filtros**: tres selects (Cliente, Estado, Mes) y dos botones, "Buscar" (azul) y "Limpiar" (gris). Hasta tocar "Buscar" no filtra. Los filtros no quedan en la URL.
6. **Tabla** de 11 columnas con bordes en todas las celdas y encabezados en MAYÚSCULA negrita sobre gris: ID, N° FACTURA, CLIENTE, CUIT, FECHA EMISIÓN, FECHA VTO., MONTO, MONEDA, SALDO, ESTADO, ACCIONES. Ordenada por ID descendente. Fechas `2026-11-03`. Montos `18400.5`. Las filas vencidas, pintadas de rojo claro (`bg-red-50`). Estado en badge saturado con texto blanco (verde "PAGADA", amarillo "PENDIENTE", rojo "VENCIDA", gris "ANULADA"). En ACCIONES, cuatro íconos: ojo (ver), lápiz (editar), signo `$` (registrar cobro) y tacho (eliminar). Las facturas sin saldo muestran `0`; las sin vencimiento, `null`.
7. **Paginación** 1 2 3 … 12, de a 25 filas.
8. **Registrar cobro**: el ícono `$` abre un modal centrado con fondo oscuro y seis campos (fecha, monto, moneda, medio, cuenta, observación). Al guardar: `alert("Operación realizada exitosamente")` y la página se recarga, volviendo a la página 1 y sin filtros.
9. **Eliminar**: `confirm("¿Está seguro que desea eliminar?")` y borra la factura del servidor (sin vuelta atrás).
10. **Cargando**: spinner azul en el medio. **Vacío**: "No se encontraron registros" en una fila de la tabla. **Error**: `alert("Error")`.
11. **Celular**: la misma tabla con scroll horizontal; los botones de arriba se apilan en cuatro filas.
12. Sin modo oscuro.

### 10.2 Inventario

**Datos**

| Dato | Origen | Antes | Después |
|---|---|---|---|
| ID interno | `factura.id` | Columna 1 | Menú ⋯ → "Copiar ID" (lo pide soporte) |
| Número de factura | `factura.numero` | Columna | Primera columna, mono: `FAC-01098` |
| Cliente | `cliente.nombre` | Texto | Monograma con color de entidad + nombre |
| CUIT | `cliente.cuit` | Columna | Hoja de la factura y del cobro |
| Emisión | `factura.emitida` | `2026-11-03` | Hoja de la factura ("3 nov") |
| Vencimiento | `factura.vence` | `2026-11-11` | Columna "Vence": "hace 6 días" en rojo / "en 3 días" / "9 dic" |
| Monto original | `factura.monto` | Columna | Segunda línea gris solo si es parcial: "de US$ 18.400" |
| Moneda | `factura.moneda` | Columna | Pegada al saldo: `US$` / `$` en gris |
| Saldo | `factura.saldo` | `18400.5` | Columna "Saldo", derecha: `US$ 18.400,50`; "—" si no hay |
| Estado | `factura.estado` | Badge saturado | Pastilla: Vencida / Por cobrar / Parcial / Cobrada / Anulada |
| Cobrado del mes | `GET /api/cobranzas/resumen` → `cobrado` | Caja verde sin período | KPI "Cobrado en noviembre" |
| Pendiente | `resumen.pendiente` | Caja amarilla | Protagonista "Por cobrar", separado por moneda |
| Vencido | `resumen.vencido` | Caja roja | KPI "Vencido" + subtítulo de la cabecera |
| Total | suma en la vista | Caja azul que mezcla monedas | **Se saca**: suma monedas distintas (ver 10.3, n.º 1) |

**Acciones**

| Acción | Antes | Después | Deshacer / modal | Permiso |
|---|---|---|---|---|
| Registrar cobro | Ícono `$` → modal | "Cobrar" relleno chico en filas vencidas y por cobrar → hoja lateral; también botón principal arriba (sin factura elegida) | Deshacer (existe `POST /api/cobros/:id/anular`) | Administración |
| Ver factura | Ícono ojo | Clic en la fila → hoja de la factura | — | Todos |
| Editar factura | Ícono lápiz → página aparte | ⋯ → "Editar" → misma página aparte (no se toca) | — | Administración |
| Eliminar factura | Tacho → `confirm()` | ⋯ → último grupo "Borrar factura" → modal con el número y el monto | Modal: el servidor borra | Solo dueño |
| Nueva factura | Botón verde | Botón secundario "Nueva factura" | — | Administración |
| Exportar Excel | Botón verde oscuro | Botón secundario de ícono "Exportar" con tooltip, mismo endpoint, **con los filtros puestos** | — | Todos |
| Imprimir | Botón gris | ⋯ de la cabecera → "Imprimir"; se mantiene la hoja de impresión | — | Todos |
| Enviar recordatorios | Botón naranja (a todas las vencidas) | En el pie del KPI "Vencido": "Recordar a 5" (botón chico), con toast y Deshacer durante 10 s antes de enviar | Deshacer con demora | Administración |

**Entradas:** el aviso diario por correo trae `/cobranzas?estado=vencida`; la ficha del cliente trae `/cobranzas?cliente=<id>`. Los dos siguen funcionando: el segmentado y el chip leen y escriben esos mismos parámetros.
**Salidas:** Excel (`/api/cobranzas/export`) e impresión.

### 10.3 Problemas encontrados

Revisor sobre la pantalla vieja (ejemplo de salida): **38/100** a 1440, **22/100** a 390, sin oscuro.

| # | Problema | Dónde | Severidad | Tanda |
|---|---|---|---|---|
| 1 | El "TOTAL" suma dólares y pesos: US$ 64.300 + $ 4.180.000 = "$ 4.286.300" | Caja azul | **Rompe** | 4 (se saca, con OK de administración) |
| 2 | Las vencidas no se distinguen de las otras salvo por un rosa tenue; ordenadas por ID, la más vieja queda en la página 3 | Tabla | **Rompe** | 4 |
| 3 | Después de cobrar se recarga y se pierden filtro y página | Modal de cobro | Frena | 4 |
| 4 | Filtrar necesita "Buscar"; los filtros no quedan en la URL | Filtros | Frena | 3 |
| 5 | Cuatro botones rellenos de colores arriba + cuatro íconos por fila | Cabecera, tabla | Frena | 3 y 4 |
| 6 | Cajas de totales sin período ni contexto, número blanco sobre amarillo (contraste 1,9:1) | KPIs | Frena | 4 |
| 7 | Fechas ISO, montos sin separador, `0` y `null` | Tabla | Frena | 4 |
| 8 | Celular: tabla con scroll horizontal, toques de 28 px | Todo | Frena | 6 |
| 9 | Barra superior azul saturado | Marco | Afea | 2 |
| 10 | MAYÚSCULA negrita en título y encabezados; párrafo de relleno | Cabecera, tabla | Afea | 3 y 4 |
| 11 | Font Awesome; una sola letra (Arial) | Todo | Afea | 1 y 4 |
| 12 | Spinner, "No se encontraron registros", `alert("Error")` | Estados | Frena | 4 |

**Pilas:** *Actuar* = las 5 vencidas (US$ 21.900) y las 9 que vencen esta semana. *Saber* = por cobrar, cobrado en el mes, días de cobro. *Consultar* = el resto de las facturas, CUIT, emisión, ID.

### 10.4 Mapa

| Lo viejo | Lo nuevo |
|---|---|
| Barra azul con 9 links | `BarraLateral`: grupos Principal (Inicio, Proyectos, Propuestas), Finanzas (Facturación, **Cobranzas 5**, Proveedores), Gestión (Clientes, Reportes); Configuración al pie. El conteo de Cobranzas son las vencidas |
| "COBRANZAS" + párrafo | `Cabecera`: "Cobranzas" 24/500 · "5 vencidas por US$ 21.900 · 9 vencen esta semana · US$ 41.600 cobrados en noviembre" |
| 4 botones de colores | `BotonSecundario` "Nueva factura", botón de ícono "Exportar", ⋯ (Imprimir) y `BotonPrincipal` "Registrar cobro" |
| Select de estado + Buscar | `Segmentado`: Todas 38 · Por cobrar 24 · Vencidas 5 · Cobradas; escribe `?estado=` |
| Selects de cliente y mes | Chips "Cliente" y "Noviembre"; "Limpiar" solo con filtros; escriben `?cliente=` y `?mes=` |
| Caja amarilla "PENDIENTE" | `KpiProtagonista` "Por cobrar": US$ 64.300 con curva de vencimientos de las próximas 8 semanas; debajo, "+ $ 4.180.000 en pesos" en una línea aparte |
| Caja roja "VENCIDO" | `Kpi` "Vencido": US$ 21.900 · "5 facturas de 3 clientes" · `Bloques` 5 de 24 en rojo · pie "Recordar a 5" |
| Caja verde "COBRADO" | `Kpi` "Cobrado en noviembre": US$ 41.600 · "69 % de lo que vencía" · `Rayitas` · pie `Variacion` "+12 % vs. octubre" |
| (no existía) | `Kpi` "Días de cobro": 34 · "meta 30" · `Curva` 6 meses · pie "↘ 3 días vs. octubre" en verde (bajar es bueno) |
| Caja azul "TOTAL" | Se saca |
| Tabla de 11 columnas ordenada por ID | Tabla de 5 columnas (Comprobante, Cliente, Vence, Estado, Saldo) + acción, agrupada "Vencidas 5 / Vencen esta semana 9 / Más adelante 10", cada grupo por vencimiento |
| Filas rojas | Filas blancas; pastilla "Vencida" y "hace 6 días" en rojo |
| 4 íconos por fila | "Cobrar" relleno chico (solo vencidas, por cobrar y parciales) + ⋯ (Ver · Editar · Copiar ID / Enviar recordatorio / Borrar factura) |
| Paginación 1…12 | "Ver 10 más" al pie de "Más adelante" (usa el mismo `?pagina=` del servidor) |
| Modal de cobro | Hoja lateral de 420 px con la factura ya elegida, monto = saldo, medio y cuenta recordados de la última vez |
| `alert` + recarga | Fila verde tenue, pastilla "✓ Cobrada", toast "Cobro registrado · FAC-01098 · US$ 32.000 / Quedó en Caja · Deshacer"; filtros y scroll intactos |
| `confirm` de eliminar | Modal "Borrar FAC-01090 (US$ 6.500)" con el botón "Borrar factura" |
| (no existía) | Panel derecho de 360 px "Por cliente": los 5 clientes con más saldo, cada uno con su color, barra del saldo y "2 vencidas" si corresponde; clic → `?cliente=` |
| Spinner / "No se encontraron registros" / `alert("Error")` | `EsqueletoKpi` ×4 + `EsqueletoFilas` · `Vacio` ("Nada por cobrar. Cuando emitas una factura aparece acá con su vencimiento." + "Nueva factura"; con filtro: "Mesa Fina no tiene facturas por cobrar en noviembre." + "Limpiar filtros") · `ErrorEnLugar` con Reintentar |

### 10.5 Cómo queda (esquema a 1440 px)

```
┌ lienzo ──────────────────────────────────────────────────────────────────────────────────┐
│ ┌ barra lateral ┐ ┌ panel ────────────────────────────────────────────────────────────┐ │
│ │ Estudio Faro  │ │ Estudio Faro / Cobranzas                         ⌘K   🔔   (AR)    │ │
│ │ ⌘K Buscar     │ ├───────────────────────────────────────────────────────────────────┤ │
│ │ PRINCIPAL     │ │ Cobranzas                    [Nueva factura] [⤓] [⋯] [■ Registrar │ │
│ │  Inicio       │ │ 5 vencidas por US$ 21.900 · 9 vencen esta semana · …       cobro] │ │
│ │ FINANZAS      │ │ (Todas 38|Por cobrar 24|Vencidas 5|Cobradas)  (Cliente) (Noviembre)│ │
│ │ ▣ Cobranzas 5 │ │ ┌Por cobrar ───┐ ┌Vencido ─────┐ ┌Cobrado nov.─┐ ┌Días de cobro┐ │ │
│ │  Facturación  │ │ │US$ 64.300  ↘ │ │US$ 21.900   │ │US$ 41.600   │ │34 días      │ │ │
│ │  Proveedores  │ │ │+$ 4,18 M ARS │ │▮▮▮▮▮▯▯▯▯▯▯▯ │ │|||||||||···  │ │╲_╱‾╲_       │ │ │
│ │ GESTIÓN       │ │ │~~~curva~~~●  │ │⚠ Recordar a5│ │↗ +12 % oct. │ │↘ 3 días oct.│ │ │
│ │  Clientes     │ │ └──────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │ │
│ │  Reportes     │ │ ┌ Vencidas 5 ────────────────────────────────┐ ┌ Por cliente ──┐ │ │
│ │               │ │ │FAC-01098 ▍GA Grupo Atlas  hace 6 días ●Venc│ │ ▍Grupo Atlas  │ │ │
│ │               │ │ │                     US$ 32.000 [Cobrar] ⋯ │ │ ████████ 2 v. │ │ │
│ │               │ │ ├ Vencen esta semana 9 ──────────────────────┤ │ ▍Orbe Retail  │ │ │
│ │               │ │ ├ Más adelante 10 ─────────── Ver 10 más ────┤ │ █████         │ │ │
│ │ (Sofía · Adm.)│ │ └────────────────────────────────────────────┘ └───────────────┘ │ │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

A 390 px: sin barra lateral; arriba "Cobranzas" y la cifra protagonista "US$ 64.300 por cobrar" con su delta; el segmentado con scroll horizontal propio; cada factura es una tarjeta de 2 líneas (cliente y saldo arriba, pastilla y "hace 6 días" abajo) con "Cobrar" de 44 px; la píldora negra "Registrar cobro" fija abajo sobre la barra inferior.

### 10.6 Tandas

| Tanda | Qué entra | Archivos | Alcance |
|---|---|---|---|
| **1. Tokens** | `tokens.css` con acento grafito y tinte azulado (H ≈ 265); alias de `--brand-*` y `--gray-*` viejos; Geist + Geist Mono con `next/font` (`--fuente-*`); Phosphor instalado | `app/globals.css`, `tailwind.config.js`, `app/layout.tsx` | Todo el sistema |
| **2. Marco** | `MarcoApp` + `BarraLateral` en lugar de la barra azul; barra inferior en celular; migas | `app/(app)/layout.tsx`, `components/Nav.tsx` → se borra | Todo el sistema |
| **3. Cabecera** | Título y subtítulo con cifras (del mismo `/resumen`), botones reordenados, segmentado y chips que escriben los mismos parámetros, filtrar sin "Buscar" | `app/(app)/cobranzas/page.tsx`, `Filtros.tsx` | Cobranzas |
| **4. Piezas** | KPIs en bandeja, se saca el TOTAL (con OK), tabla agrupada de 5 columnas, pastillas, "Cobrar" + ⋯, hoja de cobro, toast con Deshacer, modal solo para borrar, esqueleto, vacío y error, formato de fechas y montos | `cobranzas/*`, `components/ui/*` | Cobranzas |
| **5. Vida** | Color por cliente (`colorDe(cliente.id)`), monogramas, rayita en la tabla, protagonista con curva, panel "Por cliente", cuentas y barras al cargar | `cobranzas/Resumen.tsx`, `PorCliente.tsx` | Cobranzas |
| **6. Celular y oscuro** | Tarjetas de 2 líneas, píldora fija, toques de 44 px, revisión en oscuro; capturas del después e informe | `cobranzas/*`, `docs/rediseno/cobranzas.md` | Cobranzas |

La tanda 4 va detrás de la bandera `cobranzas_nueva` una semana con Sofía y Martín.

### 10.7 Informe (completo)

```markdown
# Rediseño: Cobranzas (gestión Estudio Faro)

**Ruta:** /cobranzas · **Quién la usa:** administración (Sofía, Martín), dirección (Ana) · **Tarea principal:** registrar un cobro
**Fecha:** 17 nov 2026 · **Tandas:** 1–6 · **Bandera:** cobranzas_nueva (tanda 4, una semana)

## Antes
- Capturas: antes-1440.png · antes-390.png (sin oscuro)
- Nota del revisor: 38/100 (1440) · 22/100 (390)
- Clics de la tarea principal: 9 (buscar la factura en la página 3, abrir el modal, 6 campos, guardar, cerrar el alert) y se pierde el filtro

## Problemas encontrados
1. TOTAL suma dólares y pesos (rompe) → se saca
2. Vencidas perdidas por orden de ID (rompe) → grupo "Vencidas" arriba, por vencimiento
3. Cobro recarga y pierde filtros (frena) → éxito en el lugar
…(los 12 de 10.3)

## Cifras que cambian (necesitan OK)
- "TOTAL $ 4.286.300" deja de existir. Era US$ 64.300 + $ 4.180.000 sumados como si fueran la misma moneda.
  Ahora: "Por cobrar US$ 64.300" y, debajo, "+ $ 4.180.000 en pesos". OK de Ana Ruiz, 17 nov.

## Qué se mudó o se sacó
- ID interno → ⋯ "Copiar ID"
- CUIT y fecha de emisión → hoja de la factura
- Columna Moneda → pegada al saldo
- Monto original → segunda línea gris en las parciales
- Imprimir → ⋯ de la cabecera (misma hoja de impresión)
- Enviar recordatorios → pie del KPI Vencido, con 10 s para deshacer

## Después
- Capturas: despues-1440.png · despues-390.png · despues-oscuro.png
- Nota del revisor: 91/100 · 88/100 · 90/100
- Clics de la tarea principal: 3 (Cobrar en la fila, revisar el monto ya cargado, Guardar)
- Peso de la ruta: 212 KB → 219 KB · LCP 1,4 s → 1,3 s
- Pruebas cambiadas: e2e/cobranzas.spec.ts ya no busca el botón "Buscar" ni el alert; busca el toast "Cobro registrado"

## Pendientes (fuera del rediseño)
- Borrar factura sigue siendo irreversible en el servidor. Propuesta: "Anular" con Deshacer y que borrar quede solo para borradores.
- El aviso diario por correo sigue con el diseño viejo.
```

---

## 11. Antes de dar por terminado un rediseño

1. ¿Está el inventario completo, con "Va a…" en cada dato y cada acción?
2. ¿Cada dato y cada acción del antes aparece en el después, o figura en "se saca" con motivo y OK?
3. ¿Funcionan igual los links, parámetros, permisos, exportaciones e impresión?
4. ¿Se avisó cada cifra que cambia?
5. ¿Las tandas se publicaron en orden y cada una se puede revertir sola?
6. ¿El revisor da 85 o más en 1440, 390 y oscuro?
7. ¿La tarea principal lleva igual o menos clics?
8. ¿Puesta al lado de 06, 07, 08 o 14, se ve igual de terminada? Si se ve más pobre o más plana, falta la tanda 5.
9. ¿El informe está en el repo con las capturas del antes y del después?
