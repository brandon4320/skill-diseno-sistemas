# scripts

## revisar.mjs: revisor automático de pantallas

Abre una pantalla en Chromium (Playwright), mide los estilos computados y la compara con las reglas de `SKILL.md`. Devuelve una nota de 0 a 100, la lista de problemas con selector y sugerencia, y dos capturas de página entera en `/tmp`.

```sh
node scripts/revisar.mjs ejemplos/tablero-crm.html
node scripts/revisar.mjs http://localhost:3000/cobranzas --ancho 1280
node scripts/revisar.mjs pantalla.html --celular            # la pasada principal a 390 px, táctil
node scripts/revisar.mjs pantalla.html --oscuro             # carga en claro, anota los colores, pasa a data-tema="oscuro" + prefers-color-scheme: dark
node scripts/revisar.mjs ejemplos/componentes.html --galeria  # catálogo: no cuenta botones rellenos
node scripts/revisar.mjs pantalla.html --json --minimo 80   # para otro agente o CI: sale con 1 si queda debajo
```

### Instalar Playwright (una vez, fuera del repo de la skill)

```sh
mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
npx playwright install chromium
```

El revisor busca Playwright en este orden: `PLAYWRIGHT_DIR`, la carpeta desde donde lo corrés, la carpeta del script y el `npm root -g`. Lo más simple es correrlo parado en `/tmp/pw`, o así:

```sh
PLAYWRIGHT_DIR=/tmp/pw/node_modules/playwright node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs <url|archivo>
```

Si no está el Chromium de Playwright, prueba con el Chrome instalado (`channel: 'chrome'`).

### Qué revisa

Siempre hace dos pasadas: la principal (`--ancho`, 1440 por defecto) y otra a 390 px como celular. Espera las fuentes y 1,6 s para que terminen las cuentas y las barras que se dibujan al cargar.

| Chequeo | Nivel | Cómo lo mide |
|---|---|---|
| Un solo botón relleno | falla | Botones de 32 px o más cuyo fondo contrasta 2,2:1 o más con lo que tienen debajo (la pastilla blanca del segmentado no cuenta). Los chicos rellenos (acciones de fila) se avisan aparte si hay más de 2. |
| Dos voces tipográficas | falla | Familia por cantidad de caracteres. Falla si hay una sola familia o si los títulos y las cifras de 20 px o más usan la misma que el texto. Avisa si hay 3 o más familias o si una declarada no cargó. |
| Radios en la escala | aviso | 7–12, 16, 20, 24, 26. No cuenta círculos ni píldoras, ni radios de 6 o menos en piezas de hasta 24 px (ticks, kbd). |
| Contraste AA | falla < 3:1, aviso 3–4,5 | Color computado del texto (con la opacidad de los padres) contra el fondo compuesto capa por capa. Los degradés se promedian (marcados `~degradé`). El texto sobre foto no se mide y se informa la cantidad. |
| Toques de 44 px | falla | En la pasada de 390: botones, enlaces, campos, `[onclick]` y lo que tiene cursor de mano. Exceptúa enlaces dentro de un párrafo. |
| Estado solo con color | falla | Puntos de hasta 12 px o pastillas (`chip`, `badge`, `estado`…) sin palabra, sin `aria-label`, y sin texto en el padre ni en el abuelo. Un punto sobre un botón exige que el botón tenga nombre. |
| Cifras sin `tabular-nums` | aviso | Montos, porcentajes, miles con punto, decimales con coma y cifras sueltas de 20 px o más. Marca "(tiene .num y igual no es tabular)" cuando un atajo `font:` lo pisó. |
| Imágenes sin `alt` | falla | `<img>` visibles sin el atributo (`alt=""` es válido para decorativas). |
| Botón de ícono sin nombre | falla | Clickeables sin texto visible, sin `aria-label`, `aria-labelledby`, `title` ni `<label for>`. |
| Clickeable sin teclado | aviso | `<div>` o `<span>` con cursor de mano que no son botón ni enlace. |
| Tamaños de letra | aviso | 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40, y de 36 a 44 para títulos grandes. |
| Desborde a 390 px | falla | `scrollWidth` mayor que la ventana. Lista los elementos de más afuera que se salen y no están dentro de un contenedor con scroll. |
| Scroll de costado dentro de un componente | falla | En la pasada de 390: todo contenedor visible con `overflow-x: auto/scroll` cuyo `scrollWidth` supera su `clientWidth` en más de 1 px (tabla ancha, kanban, cronograma, riel de filtros o pestañas, código). No cuenta si es un **carrusel a propósito**: `scroll-snap-type` distinto de `none` o el atributo `data-carrusel` en el contenedor (que además tiene que llevar indicador "2 de 5" o puntos: eso no lo mide). Tampoco cuenta lo que está dentro de un lienzo con paneo marcado `data-lienzo` (flujo de nodos, mapa), ni lo que está plegado dentro de un padre de 0 px (un "Ver código" cerrado). La cantidad de carruseles aceptados sale en `resumen.carruselesCelular`. Ver SKILL.md §6e. |
| Se sale de la pantalla | falla | En la pasada de 390: textos y controles que quedan cortados en el borde (parte adentro, parte afuera) sin un scroll que los muestre, también cuando `body` esconde el desborde. No cuenta lo que está del todo afuera (una hoja cerrada), lo `fixed`, lo que está en un `data-lienzo` ni lo truncado con "…" por un padre que entra en la pantalla. |
| Oscuro · la página no cambia | aviso | Solo con `--oscuro`: el fondo de `body` sigue claro; en ese caso no mide lo demás de oscuro. |
| Oscuro · blanco puro sobre negro puro | aviso | Solo con `--oscuro`: texto de 253 o más en los tres canales sobre un fondo de 3 o menos. |
| Oscuro · color sin versión oscura | aviso | Solo con `--oscuro`: la página se carga primero en claro y se anota el color de cada texto; después pasa a oscuro. Avisa los textos de color (saturación > 0,3) que quedaron **con el mismo valor que en claro** y no llegan a 4,5:1 (3:1 desde 24 px) sobre su fondo oscuro: un estado o un delta escrito a mano. |
| Oscuro · sombra como única separación | aviso | Solo con `--oscuro`: piezas de 120 × 56 o más con sombra difusa, sin borde (ni anillo de 1 px hecho con sombra) y con un fondo que contrasta menos de 1,12:1 con lo de abajo. |
| Errores en la consola | aviso | Errores de JS y de consola de las dos pasadas. |
| Simetría y alineación | aviso (tope 10 entre todos) | Ver `guias/simetria.md` §15. **Hermanos de distinto alto:** tarjetas de la misma clase en una fila de grid o flex (tops a ≤ 2 px, hasta 520 de alto) que difieren en más de 2 px. **Pies a distinta altura:** en esas filas con el mismo alto, el último hijo no coincide ni arriba ni abajo (> 2 px). **Padding asimétrico:** botones y pastillas con fondo o borde de hasta 48 px y tarjetas con clase de tarjeta, > 1 px de diferencia; se tolera hasta 4 px con un ícono del lado más chico y 10 con un avatar redondo; no cuentan apilados en columna ni tarjetas con padding 0 en un lado. **Ícono descentrado:** `svg` o `i.ph*` solo en un cuadro de 24–48 px, centro a más de 1,5 px. **Bordes casi alineados:** bloques apilados del contenido principal (`main`) y de cada tarjeta, por su caja (fondo o borde izquierdo) y su primer texto o ícono, a entre 1 y 6 px (1 px exacto se tolera; los íconos colgados con margen negativo y lo centrado no cuentan). **Botones de distinto ancho:** 2–4 botones estirados que llenan su fila, > 2 px. **Borde duplicado:** hermanos pegados con borde en los dos lados que se tocan. **Medio píxel:** piezas con borde de 1 px movidas por un `transform` a una posición con decimales. |

La nota parte de 100 y cada problema resta según su peso, con tope por chequeo. 85 o más: lista para comparar contra las referencias. Entre 65 y 84: hay que corregir antes de entregar. Menos de 65: rehacer.

### Lo que no ve

El revisor mide reglas, no el gusto. No sabe si la pantalla tiene vida, si hay un protagonista o si se ve tan bien como 06, 07, 08 y 14. Para eso: abrí la captura al lado de la referencia. Tampoco mide el contraste de texto dentro de un SVG ni el foco con teclado. Del celular no mira si un carrusel marcado tiene indicador, ni prueba 360 y 414: la pasada de celular es siempre a 390, así que esos dos anchos se miran a mano. Del oscuro no mide la escalera de superficies ni si la grilla de un gráfico quedó más brillante que los datos. De simetría no mide radios concéntricos, la línea base de las cifras ni el alto de los controles de una barra: eso se mira con `?grilla` (`ejemplos/simetria.html`). `ejemplos/simetria.html` es la prueba del chequeo: sus "antes" tienen que salir todos como avisos (se revisa con `--galeria`).

## guardia-datos.mjs: que un overhaul no toque los datos

Para remodelar un sistema que ya está en producción (`guias/overhaul.md`). Compara la base contra tu rama y frena si cambió o desapareció una **firma de datos**. Sin dependencias: Node 18+ y git. Se corre parado en el repo del sistema, no en el de la skill.

```sh
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs                    # contra main (o master), desde donde salió tu rama, incluidos los cambios sin commit
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base HEAD~1      # solo el último commit
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base main --hasta HEAD   # en CI, sin mirar el árbol de trabajo
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --solo app/cobranzas      # solo la carpeta de un agente
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --listar           # todas las firmas de antes y de después
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --json             # para otro agente
```

Sale con **0** si pasa, **1** si cambió o desapareció una firma, **2** si hay un error de uso o de git.

### Qué saca de cada .ts / .tsx / .js / .jsx tocado

| Tipo | Ejemplos |
|---|---|
| `api` | strings que empiezan con `/api`, `/rest`, `/graphql`, `/trpc`; el primer argumento de `fetch`, `axios`, `api.get/post/put/patch/delete` |
| `metodo` | `method: 'POST'` |
| `cuerpo` | las claves de los objetos en `JSON.stringify({…})`, `mutate({…})`, `insert/update/upsert({…})`, `api.post(url, {…})` |
| `query-key` | `queryKey: [...]`, `mutationKey`, el primer argumento de `useQuery([...])` y `useSWR(...)`, `invalidateQueries([...])` |
| `hook` | `useQuery`, `use…Query`, `use…Mutation`, `useSWR`, `useLoaderData`, `useFetcher`, `useActionState`, `useForm`, `useSearchParams`, `useParams`, `useRouter`… y los hooks propios importados del proyecto (`useUsuario`), menos los visuales (`useMediaQuery`, `useToast`…) |
| `import-datos` | lo que se importa de módulos de datos (`api`, `hooks`, `queries`, `actions`, `db`, `supabase`…), por nombre |
| `accion-servidor`, `cargador` | `action={…}`, `formAction`, los `export` de un archivo `'use server'`, `loader`, `getServerSideProps`, `generateMetadata`, `export const dynamic`, `revalidatePath` |
| `directiva` | `'use client'` y `'use server'` |
| `consulta` | `.from()`, `.select()`, `.eq('estado', 'pendiente')` y los demás filtros, `.rpc()`, SQL en `prepare`/`query`/`sql\`…\`` |
| `campo` | `name=` en inputs, selects y componentes de formulario (`Campo`, `*Input`, `*Select`, `Controller`…), `register('x')`, `formData.get('x')` |
| `esquema` | cada campo de `z.object({…})` / `yup.object` con su regla, sin los mensajes (los mensajes son texto de interfaz) |
| `parametro` | `searchParams.get('x')`, `params.id`, `?tab=` dentro de un string |
| `ruta` | `path:`, `href` y `to` que empiezan con `/`, `router.push`, `redirect`, `navigate`, `withFocus` |
| `tipo` | cada prop de los `export interface` y `export type X = {…}` |
| `permiso` | usos de `puede*`, `can*`, `has/tienePermiso*`, `es/isAdmin*`; `rol === 'x'`, `roles.includes('x')`, `can('x')`, `requireRole(…)` |
| `prueba`, `analitica` | `data-testid`, `data-cy`, `data-focus`; `track('evento')`, `capture`, `gtag('event', …)` |
| `ancla` (solo avisa) | `id="x"` estáticos |

Las firmas se comparan **en conjunto**: si una se mudó de `Cobranzas.tsx` a `useCobranzas.ts`, figura como "movida" y está bien. Frena si:

- una firma **desapareció** de todos lados o **cambió** (se empareja con la nueva más parecida para mostrar antes → después);
- un **permiso** quedó con **menos usos** que antes (un botón que se mudó sin su condición). Definirlo, devolverlo desde el hook o pasarlo como prop no cuenta como uso.

Solo avisa (y con `--estricto` también frena): firmas nuevas, otras firmas con menos usos, anclas, y un `.select()` que solo suma columnas.

Saltea `node_modules` y los tipos generados (`database.types.ts`, `types/database.ts`, `*.gen.ts`, archivos que empiezan con `@generated` o "do not edit"). Más con `--ignorar <texto de la ruta>`.

### Cuando frena a propósito

Si el cambio está aprobado por el dueño de los datos, una línea en `.guardia-datos-permitir` en la raíz del repo del sistema (va en el commit, con el motivo):

```
# Overhaul Cobranzas (17/11): la Tabla usa data-fila; la e2e pasó a [data-fila]. OK de <quién>.
data-testid="fila-${}"
```

O por única vez: `--permitir 'data-testid="fila-'`. Cada línea es un texto: se permiten las firmas que lo contienen.

### Lo que no ve

Lee patrones, no ejecuta ni compila. No ve una condición nueva que esconde algo sin ser un permiso (`&& c.estado !== 'cobrada'`), un `useEffect` que dejó de correr, una URL armada en una variable en otro archivo no tocado, ni un cambio de comportamiento en el servidor. Va junto con el typecheck, las pruebas, la red grabada y la lista de comportamiento (`guias/overhaul.md` §5). Probado en un repo de ejemplo (`guias/overhaul-ejemplo.md`) y contra el historial de sistemas reales en Next + Supabase y Vite + Workers (1–3 s para 40–90 archivos).
