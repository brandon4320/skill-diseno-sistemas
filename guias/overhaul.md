# Overhaul: remodelar un sistema que ya está en producción sin romper los datos

Cómo agarrar un sistema hecho (React, Next o Vite con Tailwind: un CRM, un ERP, un portal) y cambiarle **la cara y la estructura de las pantallas** (el orden de los bloques, cómo se agrupan, qué va en hoja lateral, qué va en pestañas, el marco, la navegación) sin tocar cómo lee y escribe los datos.

`guias/rediseno.md` explica cómo pasar una pantalla vieja a este lenguaje (relevar, detectar, mapear, tandas, informe). Esta guía va un paso más abajo, al código: qué líneas no se tocan, cómo se separan del resto para poder cambiar todo lo demás tranquilo, y cómo se prueba que no se rompió nada. Las dos van juntas: el relevamiento y el informe salen de `rediseno.md`, y la cirugía en el código sale de acá.

Herramientas:
- `scripts/guardia-datos.mjs`: compara la base contra tu rama y frena si cambió o desapareció una firma de datos (§5.2).
- `scripts/revisar.mjs`: la nota visual.
- `guias/overhaul-ejemplo.md`: un overhaul completo de un `Cobranzas.tsx` real, paso a paso.

---

## 0. La regla en una línea

**El overhaul cambia cómo se ve y cómo se ordena. No cambia qué se pide, qué se manda, a quién se le muestra ni a dónde lleva.**

Si una tarea necesita cambiar algo del contrato (§1), deja de ser overhaul: es un cambio de datos con su pedido, su OK y su commit aparte, y la guardia lo frena hasta que alguien lo permita a propósito (§5.3).

---

## 1. El contrato

### 1.1 Intocable

Esto queda **igual, carácter por carácter**. Se puede mudar de archivo (al hook de datos, §2.1), pero no se renombra, no se "limpia" y no se reordena.

| Qué | Ejemplos | Por qué rompe |
|---|---|---|
| **Llamadas a la API** | `fetch('/api/cobros')`, `axios.post(...)`, `api.get(...)`, el `method`, los headers, el `body` y sus claves | El servidor espera exactamente eso. Cambiar `factura_id` por `facturaId` "porque queda más prolijo" rompe el alta. |
| **Hooks de datos** | `useQuery`, `useMutation`, `useSWR`, `useInfiniteQuery`, `trpc.x.useQuery`, `useLoaderData`, `useFetcher`, `useActionState` | Cambian cuándo se pide, qué se cachea y qué se invalida. |
| **Query keys** | `queryKey: ['cobros', estado]`, `invalidateQueries({ queryKey: ['cobros'] })`, la clave de `useSWR` | Otra pantalla invalida por esa clave. Si la cambiás, la lista deja de actualizarse después de guardar en otra parte. |
| **Server actions y loaders** | `'use server'`, `action={registrarCobro}`, `export async function loader`, `revalidatePath('/cobranzas')`, `export const dynamic` | Next y Remix los encuentran por nombre y por posición. |
| **Consultas** | `supabase.from('cobros').select('id, monto').eq('estado', 'pendiente')`, el SQL de D1, `.rpc('fn')` | Las columnas que se leen y los filtros son datos, no presentación. RLS y los índices dependen de eso. |
| **Rutas, URLs y parámetros** | la URL de la pantalla, `?estado=`, `?tab=`, `?foco=`, `#fila`, los `href` y `router.push` que salen | Hay links guardados, correos que el sistema mandó y botones de otras pantallas que llevan acá (y a la fila, con `withFocus`). |
| **Campos de formulario** | `name="monto"`, `register('monto')`, `formData.get('monto')`, `<Controller name>` | Con `<form action>` o `FormData`, el `name` **es** el contrato con el servidor. |
| **Validación** | `z.object({ monto: z.number().positive() })`, `required`, `min`, `pattern`, los `refine` | Cambia qué se puede guardar. Los **mensajes** de error sí se pueden reescribir (son texto de interfaz). |
| **Tipos e interfaces de datos** | `export interface Cobro { … }`, los tipos que vienen del servidor, `Database['public']…` | Otros archivos los importan. Si un campo cambia de nombre o de tipo, se rompe en otro lado. |
| **Permisos y condiciones de visibilidad** | `puedeCobrar &&`, `usuario.rol === 'admin'`, `can('cobros.anular')`, `esDirector ?` | Lo que un rol no veía, sigue sin verlo. Lo que veía, lo sigue viendo. |
| **Estado de negocio** | el registro abierto, la selección para el lote, el borrador, el paso del asistente, el orden que manda el servidor | Es lo que la persona estaba haciendo. Mudarlo a otro componente cambia cuándo se resetea. |
| **Ganchos de pruebas y de analítica** | `data-testid`, `data-cy`, `data-focus`, `data-fila`, `track('cobro_registrado')`, ids que usan las pruebas o un `#ancla` | Las pruebas, los tableros de uso y las integraciones los buscan por ese texto. |
| **Comportamiento** | guardar al salir del campo, el atajo de teclado, el `Enter` que envía, la impresión, la exportación | La gente ya lo tiene en los dedos. |

### 1.2 Se puede cambiar

| Qué | Ejemplos |
|---|---|
| JSX de presentación | `<table>` → `<Tabla>`, `<div>` → `<Seccion>`, `<select>` → `<Segmentado>` (escribiendo el mismo parámetro) |
| Clases y estilos | Tailwind suelto → tokens (`bg-gray-100` → `bg-fondo`), `style={{}}` → clases |
| Layout | grillas, columnas, panel lateral, cabecera, marco, barra inferior en celular |
| Componentes visuales | las piezas de `componentes/` (`Kpi`, `Tabla`, `HojaLateral`, `Vacio`, `ErrorEnLugar`, `Toast`…) |
| Orden y agrupación de bloques | KPIs arriba, la tabla abajo, la ficha en hoja lateral, la configuración en pestañas |
| Textos de interfaz | títulos, rótulos, vacíos, errores, mensajes de validación (con `guias/textos.md`) |
| Íconos | todo a Phosphor (`guias/iconos.md`) |
| Animaciones | `guias/movimiento.md` (ojo con `transform` en un padre de algo `position: fixed`: lo rompe) |
| Estado visual | abierto/cerrado de un menú, pestaña activa, hover, el ancho del panel |

### 1.3 Zona gris: se cambia solo con OK y anotado

- **Sacar un dato de la vista.** No se borra: se muda a la ficha, al menú ⋯ o a una pestaña, y se anota en el informe (`rediseno.md` §9, "Qué se mudó o se sacó").
- **Un parámetro de URL nuevo** (`?tab=cobros`). Se puede sumar, pero los viejos tienen que seguir llegando al mismo lugar.
- **Partir o juntar pantallas.** La ruta vieja sigue viva: redirige (`redirect('/finanzas/cobranzas?tab=vencidas')`) o renderiza la pantalla nueva con el filtro puesto.
- **Cambiar un orden por defecto** que hoy decide el cliente. Si el orden lo manda el servidor, es intocable.
- **Un total calculado en la vista.** Si el rediseño lo muestra separado por moneda en vez de sumado, la cifra cambia: avisar (`rediseno.md` §0, punto 3).
- **Un `data-testid`** que la pieza nueva no puede poner en el mismo elemento. Se actualiza la prueba **a propósito** y se permite en la guardia con el motivo (ejemplo en `overhaul-ejemplo.md`, paso 3).

---

## 2. La técnica

### 2.1 Primero separar los datos, sin cambiar nada

El problema de un sistema viejo es que los datos y la presentación están mezclados en el mismo componente: el `useQuery` arriba, el `fetch` dentro de un `onClick`, el permiso en medio del JSX. Si cambiás el JSX ahí adentro, tocás todo a la vez.

Por eso el primer commit del overhaul de una pantalla **no cambia ni un píxel**:

1. Creá `useCobranzas.ts` (o `datos.ts`) al lado del componente.
2. **Copiá** ahí todo lo del contrato (§1.1): hooks, query keys, mutaciones, fetch, esquemas, permisos, parámetros de la URL y estado de negocio. Copiar, no reescribir: mismos nombres, mismo orden, mismas claves.
3. Lo que estaba en un handler del JSX (`onSubmit={e => { … esquema.parse(…); registrar.mutate(d) }}`) pasa a una función del hook (`enviarCobro(fd)`) con el cuerpo idéntico. El JSX queda llamándola.
4. El hook devuelve un objeto con todo lo que la vista usa: datos, banderas (`isLoading`, `error`), permisos (`puedeCobrar`), acciones (`cambiarEstado`, `enviarCobro`) y el estado de negocio (`abierto`, `setAbierto`).
5. El componente viejo pasa a consumir el hook **con su mismo JSX de siempre**.
6. Corré la guardia: tiene que dar **PASA** con todo "movido". Sacá las capturas: tienen que ser idénticas a las del antes.
7. Commit: "overhaul Cobranzas 1/3: datos a useCobranzas, sin cambios visuales".

Desde acá, la vista es un archivo que **solo recibe cosas y las dibuja**. Ese archivo se puede reescribir entero.

Si el sistema ya separa (páginas server que leen y pasan props a un componente cliente), el contenedor es la página y el paso 1 ya está hecho: el overhaul toca solo el componente cliente y no cambia los props que recibe.

**En Next con Server Components**, el "hook" es el componente server:

```tsx
// app/cobranzas/page.tsx: el contenedor. No se toca en el overhaul.
export default async function Page({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = 'pendiente' } = await searchParams
  const cobros = await traerCobros(estado)        // consulta intocable
  const usuario = await usuarioActual()
  return <CobranzasVista cobros={cobros} estado={estado} puedeCobrar={puedeCobrar(usuario)} registrar={registrarCobro} />
}
// app/cobranzas/CobranzasVista.tsx: la presentación. Se reescribe entera.
```

No conviertas un Server Component en cliente (ni al revés) "de paso": cambia dónde y cuándo se piden los datos.

### 2.2 Adaptadores: los datos viejos a las piezas nuevas

Las piezas de `componentes/` piden formas propias (`Columna<T>`, `tono: 'verde' | 'ambar'…`, `cifras: Cifra[]`). No cambies los datos para que encajen: escribí un **adaptador** chico al lado de la vista.

```ts
// vista/adaptar.ts: solo lee y da formato. No filtra filas ni recalcula montos.
export const TONO_ESTADO: Record<Cobro['estado'], { tono: Tono; texto: string }> = {
  pendiente: { tono: 'ambar', texto: 'Pendiente' },
  vencida: { tono: 'rojo', texto: 'Vencida' },
  cobrada: { tono: 'verde', texto: 'Cobrada' },
}
```

Reglas del adaptador:
- **Es puro**: entra el dato del hook, sale lo que pide la pieza. No hace fetch ni usa hooks de datos.
- **No agrega lógica de negocio.** Si el adaptador necesita decidir algo (si está vencida, cuánto se debe), ese dato tiene que venir del hook o del servidor. Un adaptador que calcula vencimientos con `new Date()` del navegador es un bug (Vercel corre en UTC, el navegador no).
- **No suma monedas distintas** (SKILL.md §6c).
- Un `Record` por enum, con todos los valores: si el servidor suma un estado nuevo, TypeScript avisa.

### 2.3 Alias de tokens

El cambio de colores, radios y sombras se hace **una vez para todo el sistema** apuntando las variables viejas a las nuevas, y después cada pantalla pasa a los nombres nuevos cuando le toca. Está paso a paso en `rediseno.md` §6 (shadcn, Tailwind v3, variables propias y la tabla de clases viejas → nuevas). Es la tanda 1 y va en su propio commit.

### 2.4 Pantalla por pantalla, detrás de una bandera o de una ruta paralela

Nunca un overhaul "big bang" de todo el sistema en una rama de tres semanas. Una pantalla por vez, y la pantalla nueva convive con la vieja hasta que se prueba.

**Bandera** (la más simple, para pantallas que cobran, facturan o liquidan):

```tsx
// app/cobranzas/Cobranzas.tsx
import { useCobranzas } from './useCobranzas'
import { CobranzasVieja } from './CobranzasVieja'   // el JSX de siempre
import { CobranzasNueva } from './CobranzasNueva'
import { usarVistaNueva } from '@/lib/vista-nueva'  // cookie, ?vista=nueva o lista de usuarios

export default function Cobranzas() {
  const datos = useCobranzas()                       // UN solo cargador para las dos vistas
  return usarVistaNueva('cobranzas') ? <CobranzasNueva {...datos} /> : <CobranzasVieja {...datos} />
}
```

```ts
// lib/vista-nueva.ts
'use client'
export function usarVistaNueva(pantalla: string) {
  if (typeof document === 'undefined') return false
  const params = new URLSearchParams(location.search)
  if (params.get('vista') === 'nueva') document.cookie = `vista-${pantalla}=nueva; path=/; max-age=2592000`
  if (params.get('vista') === 'vieja') document.cookie = `vista-${pantalla}=; path=/; max-age=0`
  return document.cookie.includes(`vista-${pantalla}=nueva`)
}
```

Si la pantalla renderiza en el servidor, leé la cookie con `cookies()` en la página para que no parpadee la vista vieja.

**Ruta paralela** (para cambios de estructura grandes: partir una pantalla en pestañas, mover la ficha a una hoja): `app/(nuevo)/cobranzas/page.tsx` que usa **el mismo** `useCobranzas` o el mismo cargador server. Nadie llega por el menú; se prueba entrando a mano, y cuando está lista, la ruta de siempre pasa a renderizar la nueva y la paralela se borra.

En los dos casos:
- **Las dos vistas leen del mismo cargador.** Si la nueva necesita un dato que la vieja no pedía, es un cambio de datos aparte (con su OK), no algo que se mete en la vista nueva.
- Una semana con dos o tres personas del equipo en la vista nueva antes de dejarla para todos.
- Al terminar, en un commit aparte: se borra la vista vieja, la bandera y los alias de tokens que ya nadie usa.

### 2.5 Nunca borrar comportamiento

Antes de reescribir la vista, hacé la lista de **todo lo que hace hoy** (sale del inventario de `rediseno.md` §2.3 y §2.4) y pegala arriba del archivo nuevo como comentario mientras trabajás:

```tsx
/* Comportamiento de Cobranzas (vieja) → dónde queda en la nueva
 * [x] Filtro por estado (?estado=pendiente|vencida) → Segmentado, mismo parámetro
 * [x] Botón Cobrar por fila, solo si puedeCobrar → acción de fila, misma condición
 * [x] Form de cobro: monto + medio, valida esquemaCobro → HojaLateral, mismos name
 * [x] Invalida ['cobros'] al guardar → sin cambios (vive en el hook)
 * [x] Cargando → esqueleto de la tabla y de los KPI
 * [x] Error → ErrorEnLugar dentro de la tabla (antes reemplazaba la pantalla)
 * [ ] Vacío → no existía: se suma Vacio (agregar está permitido)
 * [x] data-testid="fila-<id>" → la Tabla pone data-fila; prueba actualizada (permitido)
 */
```

Cada renglón tiene que terminar en [x]. Se puede **sumar** (un vacío que no había, un toast, un Deshacer), nunca restar sin OK. Lo que más se pierde en un overhaul, en orden:

1. **La condición de permiso de una acción que se mudó** al menú ⋯, a la hoja o a la barra de lote. La condición se muda con la acción.
2. **Los estados raros**: vacío por filtro, error parcial, el registro bloqueado, "sin permiso", la moneda que no está.
3. **Los links que entran**: `?foco=FAC-01101` que te dejaba parado en la fila, `#pagos`, `?tab=`.
4. **Los atajos**: `Enter` para enviar, `Esc` para cerrar, el foco que volvía al buscador.
5. **La impresión y la exportación.**
6. **El guardado al salir del campo**, cuando se pasa un input no controlado a uno controlado.

### 2.6 Cambios de estructura sin romper

Lo que más cambia en un overhaul de estructura, y cómo hacerlo bien:

| Cambio | Cómo | Qué cuidar |
|---|---|---|
| Ficha de página entera → hoja lateral | La hoja se abre con el mismo estado de negocio (`abierto`) o con `?ficha=<id>` | La ruta vieja `/cobros/[id]` sigue funcionando (abre la lista con la hoja abierta o queda como página) |
| Pantalla larga → pestañas | Cada pestaña es un bloque que ya existía. La pestaña activa va en `?tab=` | Los links viejos sin `?tab=` caen en la pestaña que muestra lo que antes se veía primero |
| Dos pantallas → una | La nueva usa los dos cargadores tal cual. Las rutas viejas redirigen con el filtro | Los permisos de cada una: si un rol veía solo una, ve solo esa parte |
| Tabla → tarjetas en celular | `<Tabla>` ya lo hace (columnas con `movil`) | Toda acción de la fila sigue en la tarjeta |
| `<select>` → `<Segmentado>` o chips | `onCambio` llama a la misma función que antes (`cambiarEstado`) | Que escriba el mismo parámetro con el mismo valor (`vencida`, no `vencidas`) |
| Botones sueltos → menú ⋯ | Cada ítem del menú lleva su condición de permiso | La acción destructiva queda última y con su confirmación de siempre |
| `<form>` nativo → `<HojaLateral>` con `<Campo>` | `<Campo name="monto">` pasa el `name` al input. El submit llama al mismo handler | Si era `<form action={serverAction}>`, sigue siendo `action`, no un `onClick` con fetch |

### 2.7 Lo que no se hace "de paso"

- Renombrar lo que devuelve el hook o los campos del tipo "para que quede en español".
- Cambiar una query key "para que sea más clara".
- Pasar de `useQuery` a `useSuspenseQuery`, de SWR a React Query o de `fetch` a server action.
- Mover un cálculo del servidor al cliente "porque ya tenemos los datos".
- Actualizar dependencias (React, Next, la librería de tablas) en la misma rama.
- Sacar un `useEffect` "que no se entiende". Se pregunta (`rediseno.md` §7.10).

Cada uno es un cambio válido en otro momento, con su propio commit y su propia prueba.

---

## 3. El plan por fases

| Fase | Qué sale | Se publica sola | Guardia |
|---|---|---|---|
| **0. Relevar** | Capturas del antes (1440, 390, oscuro), inventario de datos y acciones, lista de comportamiento (§2.5), la red grabada (§5.4) | — | — |
| **1. Tokens** | `tokens.css` con alias de las variables viejas (`rediseno.md` §6) | Sí | PASA sin firmas tocadas |
| **2. Marco** | Barra lateral, panel, migas, barra inferior en celular | Sí | PASA (el menú lleva los mismos `href` y las mismas condiciones de rol) |
| **3. Por pantalla, de la más usada a la menos** | Para cada una: 3a extraer datos (§2.1) → 3b vista nueva detrás de bandera (§2.4) → 3c probar con el equipo → 3d dejarla para todos | Cada sub-paso es un commit | PASA en cada sub-paso |
| **4. Limpieza** | Borrar vistas viejas, banderas, rutas paralelas y alias que nadie usa | Sí | PASA (lo borrado era presentación) |

Las fases 1 y 2 tocan todo el sistema y no cambian ninguna firma. Si la guardia salta en la fase 1 o 2, algo se metió de más.

---

## 4. Trabajar con agentes en paralelo sin pisarse

Un overhaul grande se reparte bien entre agentes **si cada uno tiene archivos propios**.

### 4.1 Cómo se reparte

1. **Un agente coordina y no escribe pantallas.** Hace las fases 0, 1 y 2 (relevamiento, tokens, marco), copia las piezas de `componentes/` al proyecto y las deja **congeladas**.
2. **Un agente por pantalla**, cada uno en su rama o worktree (`git worktree add ../crm-cobranzas overhaul/cobranzas`).
3. **Cada agente es dueño solo de su carpeta**: `app/cobranzas/**`. Puede crear archivos nuevos ahí (`useCobranzas.ts`, `vista/`, `CobranzasNueva.tsx`).
4. **Archivos prohibidos para los agentes de pantalla**: `tokens.css`, el CSS global, `componentes/**` (las piezas compartidas), `lib/api*`, los tipos compartidos, el marco, `package.json` y el lockfile, las migraciones.
5. **Si una pieza compartida necesita un cambio** (a la `Tabla` le falta una prop), el agente no la toca: lo pide al coordinador, que la cambia una vez para todos y la vuelve a congelar.
6. **El paso 3a (extraer datos) lo hace cada agente en su pantalla**, pero sin cambiar el archivo de API compartido: el hook nuevo importa lo de siempre.
7. Un **agente revisor** por tanda: corre la guardia, el typecheck, las pruebas y el revisor visual sobre cada rama, compara la red, y devuelve "perfecto" o la lista de lo que falta. Se corrige y se vuelve a revisar hasta que diga perfecto.

### 4.2 El encargo para cada agente de pantalla

```
Overhaul de <pantalla> en <repo>, rama overhaul/<pantalla>. Skill: diseno-sistemas.
Leé guias/overhaul.md (el contrato y la técnica) y guias/overhaul-ejemplo.md.
Solo podés escribir en <carpeta>/**. No toques componentes/, tokens.css, lib/, tipos compartidos,
package.json ni migraciones. Si te falta algo de una pieza compartida, anotalo y seguí.
Pasos, un commit cada uno:
  1. Extraé los datos a use<Pantalla>.ts sin cambiar nada visual (guardia: PASA, capturas iguales).
  2. Vista nueva con las piezas de componentes/, detrás de la bandera usarVistaNueva('<pantalla>').
  3. Lista de comportamiento (guias/overhaul.md §2.5) en [x] completa.
Antes de entregar: node <skill>/scripts/guardia-datos.mjs --base main --solo <carpeta> → PASA;
typecheck y pruebas verdes; revisar.mjs ≥ 85 en 1440, --celular y --oscuro.
Devolvé: commits, salida de la guardia, capturas antes/después y lo que pediste cambiar en piezas compartidas.
```

### 4.3 Por qué así

- Dos agentes que tocan la misma pieza compartida terminan con dos variantes de la `Tabla`. Congelarla obliga a que haya una sola.
- La guardia con `--solo <carpeta>` revisa solo lo de ese agente: si salta, el problema es de él.
- Las ramas por pantalla se pueden publicar y revertir solas (regla 1 de las tandas en `rediseno.md` §5).
- Si dos pantallas comparten un hook de datos, una sola es dueña del hook y la otra lo importa sin tocarlo.

---

## 5. "No rompí nada": la lista de verificación

Se corre en cada commit de la fase 3 y antes de dejar una pantalla para todos.

### 5.1 Lo automático

```sh
npx tsc --noEmit                         # o el typecheck del proyecto
npm run lint
npm test                                 # unitarias y e2e si hay
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base main
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas --celular
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas --oscuro
```

| Chequeo | Pasa si |
|---|---|
| Typecheck | Sin errores nuevos. Un `as any` o un `@ts-ignore` nuevo en la vista es una señal de que se forzó un dato |
| Pruebas | Verdes. Las que se cambiaron, cambiadas a propósito y anotadas |
| Guardia de datos | PASA. Lo permitido está en `.guardia-datos-permitir` con el motivo y el OK |
| Revisor visual | 85 o más en 1440, 390 y oscuro |
| Build | `npm run build` sin advertencias nuevas de server/client |

### 5.2 La guardia de datos

`scripts/guardia-datos.mjs` saca de cada archivo tocado las firmas de datos de antes y de después (URLs, métodos, claves del cuerpo, query keys, hooks, server actions, consultas, `name` de campos, esquemas, parámetros, rutas, tipos exportados, permisos, `data-testid` y eventos) y las compara **en conjunto**: si una firma se mudó de `Cobranzas.tsx` a `useCobranzas.ts`, está bien. Si desapareció o cambió, sale con código 1 y dice archivo, línea, antes y después. Un permiso que quedó en menos lugares que antes también frena: casi siempre es un botón que se mudó sin su condición.

Es una red de patrones, no un compilador: no ve una condición nueva que esconde un botón (`puedeCobrar && c.estado !== 'cobrada'` suma una condición que no es de permiso), ni un `useEffect` que dejó de correr. Para eso están la lista de comportamiento y la red.

Uso y opciones: `scripts/README.md`, sección "guardia-datos.mjs".

### 5.3 Cuando la guardia frena

1. **Si no fue a propósito**, volvé a poner la firma exactamente como estaba (está en "antes").
2. **Si fue a propósito** (el `data-testid` que la pieza nueva no puede poner en la fila, un `.select()` que el dueño de los datos aprobó cambiar): una línea en `.guardia-datos-permitir`, en la raíz del repo, con el motivo y quién dio el OK. Ese archivo va en el commit: queda la decisión escrita.

```
# Overhaul Cobranzas (17/11): la Tabla marca cada fila con data-fila="<id>".
# La prueba e2e pasó a [data-fila="<id>"]. OK de Lucía (administración).
data-testid="fila-${}"
```

3. **Nunca** se apaga la guardia ni se corre con una base que esconda el cambio.

### 5.4 Las mismas requests en la pestaña de red

Grabá la red de la tarea principal en el antes y en el después, con la misma cuenta y los mismos datos, y compará. A mano: DevTools → Network → Fetch/XHR, hacé la tarea (abrir la pantalla, filtrar, registrar un cobro) y guardá el HAR. Con Playwright:

```js
// red.mjs: node red.mjs http://localhost:3000/cobranzas > red-antes.txt
import { chromium } from 'playwright'
const b = await chromium.launch(); const p = await b.newPage({ storageState: 'sesion.json' })
const vistas = []
p.on('request', r => { if (['fetch', 'xhr', 'document'].includes(r.resourceType()))
  vistas.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, '')} ${r.postData() ?? ''}`) })
await p.goto(process.argv[2]); await p.waitForLoadState('networkidle')
// acá los pasos de la tarea: await p.getByRole('button', { name: 'Cobrar' }).first().click() …
console.log(vistas.sort().join('\n')); await b.close()
```

`diff red-antes.txt red-despues.txt` tiene que dar vacío o solo diferencias de orden. **Mismas URLs, mismos métodos, mismo cuerpo (mismas claves y mismos valores)**. Una request de más (la vista nueva pide algo que antes no) o de menos (la pantalla dejó de refrescar algo) se explica o se corrige.

### 5.5 Mismos permisos

Entrá con **una cuenta de prueba de cada rol** (director, comercial, contador, el que no tiene acceso) en el antes y en el después, y anotá qué ve y qué puede hacer cada uno. Las dos tablas tienen que ser iguales. No alcanza con la cuenta de quien hace el overhaul, que suele ser la que ve todo.

### 5.6 Capturas antes y después

Mismos datos, misma fecha, mismos anchos (1440 y 390) y mismo tema (`rediseno.md` §8.1). Ponelas lado a lado con el formato de `ejemplos/antes-despues.html`. Recorré el inventario: cada dato del antes tiene que estar en el después, o en "se mudó" con su lugar.

### 5.7 La tarea principal

Contá los clics de la tarea más frecuente (registrar un cobro) en el antes y en el después. Igual o menos.

---

## 6. Antes de dejar una pantalla para todos

1. ¿El paso de "extraer datos" fue un commit propio, con la guardia en PASA y las capturas idénticas?
2. ¿La vista nueva solo consume lo que devuelve el hook o el contenedor, sin fetch ni hooks de datos propios?
3. ¿Los adaptadores son puros, sin lógica de negocio ni fechas del navegador?
4. ¿La lista de comportamiento (§2.5) está toda en [x]?
5. ¿La guardia da PASA contra `main`, y lo permitido tiene motivo y OK en `.guardia-datos-permitir`?
6. ¿Typecheck, lint, pruebas y build en verde?
7. ¿La red de la tarea principal es la misma (§5.4)?
8. ¿Cada rol ve y hace lo mismo que antes (§5.5)?
9. ¿El revisor da 85 o más en 1440, 390 y oscuro, y las capturas al lado de las referencias no se ven más pobres?
10. ¿Los links viejos (`?estado=`, `?foco=`, `#ancla`, rutas que se juntaron) siguen llegando al mismo lugar?
11. ¿La bandera estuvo una semana con dos o tres personas del equipo?
12. ¿El informe de `rediseno.md` §9 está en el repo con las capturas?
