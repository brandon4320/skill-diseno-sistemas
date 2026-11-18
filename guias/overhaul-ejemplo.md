# Overhaul de ejemplo: Cobranzas.tsx de punta a punta

Un overhaul completo de una pantalla de **Cobranzas** del sistema de gestión de **Estudio Faro** (marca inventada, la misma de `rediseno.md` §10). Va con `guias/overhaul.md`: ahí está el contrato y la técnica, acá se ve aplicada en código.

El código y las salidas de la guardia de este documento son reales: se armó el repo en una carpeta temporal, se hizo cada paso como commit y se corrió `scripts/guardia-datos.mjs` en cada uno.

Pasos:
0. La pantalla vieja (y qué tiene de contrato).
1. Extraer los datos a un hook, sin cambiar nada visual.
2. La vista nueva con las piezas de la skill.
3. Lo que verificó la guardia (y lo que no).

---

## 0. La pantalla vieja

`app/cobranzas/Cobranzas.tsx`, tal como está en producción. Datos, permisos, validación y presentación, todo en el mismo componente:

```tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { z } from 'zod'
import { fetchCobros } from '@/lib/api'
import { useUsuario } from '@/lib/sesion'

export interface Cobro {
  id: string
  factura: string
  cliente: string
  monto: number
  moneda: 'ARS' | 'USD'
  vence: string
  estado: 'pendiente' | 'vencida' | 'cobrada'
}

const esquemaCobro = z.object({
  facturaId: z.string().min(1, 'Elegí una factura'),
  monto: z.number().positive({ message: 'El monto tiene que ser mayor a 0' }),
  medio: z.enum(['transferencia', 'efectivo', 'cheque']),
})

export default function Cobranzas() {
  const sp = useSearchParams()
  const router = useRouter()
  const estado = sp.get('estado') ?? 'pendiente'
  const usuario = useUsuario()
  const puedeCobrar = usuario.rol === 'admin' || usuario.rol === 'cobranzas'
  const qc = useQueryClient()
  const [abierto, setAbierto] = useState<Cobro | null>(null)
  const { data, isLoading, error } = useQuery({ queryKey: ['cobros', estado], queryFn: () => fetchCobros(estado) })
  const registrar = useMutation({
    mutationFn: (d: z.infer<typeof esquemaCobro>) =>
      fetch('/api/cobros', { method: 'POST', body: JSON.stringify({ factura_id: d.facturaId, monto: d.monto, medio: d.medio }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cobros'] }),
  })
  if (isLoading) return <div style={{padding: 20}}>Cargando...</div>
  if (error) return <div style={{color: 'red'}}>Error!!</div>
  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold text-blue-700">COBRANZAS</h2>
      <select value={estado} onChange={e => router.push(`/cobranzas?estado=${e.target.value}`)}>
        <option value="pendiente">Pendientes</option><option value="vencida">Vencidas</option>
      </select>
      <table className="border w-full"><tbody>
        {data?.map((c: Cobro) => (
          <tr key={c.id} data-testid={`fila-${c.id}`} className={c.estado === 'vencida' ? 'bg-red-500 text-white' : ''}>
            <td>{c.factura}</td><td>{c.cliente}</td><td>{c.monto}</td>
            <td>{puedeCobrar && <button onClick={() => setAbierto(c)} className="bg-green-600 text-white">Cobrar</button>}</td>
          </tr>
        ))}
      </tbody></table>
      {abierto && (
        <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); const d = esquemaCobro.parse({ facturaId: abierto.id, monto: Number(fd.get('monto')), medio: fd.get('medio') }); registrar.mutate(d) }}>
          <input name="monto" type="number" />
          <select name="medio"><option>transferencia</option></select>
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  )
}
```

### 0.1 El contrato de esta pantalla (lo que no se toca)

| Firma | Dónde está |
|---|---|
| `GET` vía `fetchCobros(estado)` → `/api/cobros?estado=…` | `lib/api.ts` (no se toca en el overhaul) |
| `POST /api/cobros` con `{ factura_id, monto, medio }` | `mutationFn` |
| `queryKey: ['cobros', estado]` e `invalidateQueries({ queryKey: ['cobros'] })` | otras pantallas invalidan por `['cobros']` |
| `?estado=pendiente\|vencida` y `router.push('/cobranzas?estado=…')` | el filtro; hay links desde el tablero con `?estado=vencida` |
| `puedeCobrar` = rol `admin` o `cobranzas` | esconde el botón Cobrar |
| `esquemaCobro`: `facturaId` no vacío, `monto` positivo, `medio` del enum | validación del alta |
| `name="monto"`, `name="medio"` y `fd.get('monto' \| 'medio')` | el form |
| `export interface Cobro` | lo importa la ficha del cliente |
| `data-testid="fila-<id>"` | la prueba e2e de cobranzas |

### 0.2 Lista de comportamiento (overhaul.md §2.5)

```
[ ] Filtro por estado (?estado=pendiente|vencida)
[ ] Botón Cobrar por fila, solo si puedeCobrar
[ ] Form de cobro: monto + medio, valida esquemaCobro, manda el POST
[ ] Después de guardar se refresca la lista (invalida ['cobros'])
[ ] Cargando
[ ] Error
[ ] data-testid="fila-<id>" en cada fila
```

### 0.3 Problemas visuales (lo que el overhaul viene a arreglar)

- Título en mayúscula, negrita y azul; sin subtítulo con cifras (SKILL.md §1, §2).
- Fila pintada de rojo saturado con texto blanco para "vencida" (§7: filas pintadas por estado, estado solo con color).
- Montos sin formato, sin moneda y sin `tabular-nums` (§2, §6c).
- Botón verde relleno por fila (§5 Acciones: botones de color por acción).
- Form que aparece abajo de la tabla, sin rótulos (§5 Formularios: va en hoja lateral).
- "Cargando..." y "Error!!" en texto suelto que reemplazan la pantalla (§6b).
- Sin estado vacío.

---

## 1. Extraer los datos a un hook, sin cambiar nada visual

**Un commit, cero píxeles distintos.** Todo lo del contrato se **copia** a `useCobranzas.ts`: mismos nombres, mismas claves, mismo orden. Lo único que se escribe nuevo son dos funciones que envuelven lo que antes estaba en línea en el JSX (`cambiarEstado` y `enviarCobro`), con el cuerpo idéntico.

`app/cobranzas/useCobranzas.ts`:

```ts
'use client'
// Paso 1 del overhaul: todo lo que toca datos, copiado TAL CUAL de Cobranzas.tsx.
// No se renombra, no se "mejora", no se reordena. La vista solo consume lo que devuelve.
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { z } from 'zod'
import { fetchCobros } from '@/lib/api'
import { useUsuario } from '@/lib/sesion'

export interface Cobro {
  id: string
  factura: string
  cliente: string
  monto: number
  moneda: 'ARS' | 'USD'
  vence: string
  estado: 'pendiente' | 'vencida' | 'cobrada'
}

const esquemaCobro = z.object({
  facturaId: z.string().min(1, 'Elegí una factura'),
  monto: z.number().positive({ message: 'El monto tiene que ser mayor a 0' }),
  medio: z.enum(['transferencia', 'efectivo', 'cheque']),
})

export function useCobranzas() {
  const sp = useSearchParams()
  const router = useRouter()
  const estado = sp.get('estado') ?? 'pendiente'
  const usuario = useUsuario()
  const puedeCobrar = usuario.rol === 'admin' || usuario.rol === 'cobranzas'
  const qc = useQueryClient()
  const [abierto, setAbierto] = useState<Cobro | null>(null)
  const { data, isLoading, error } = useQuery({ queryKey: ['cobros', estado], queryFn: () => fetchCobros(estado) })
  const registrar = useMutation({
    mutationFn: (d: z.infer<typeof esquemaCobro>) =>
      fetch('/api/cobros', { method: 'POST', body: JSON.stringify({ factura_id: d.facturaId, monto: d.monto, medio: d.medio }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cobros'] }),
  })
  const cambiarEstado = (nuevo: string) => router.push(`/cobranzas?estado=${nuevo}`)
  const enviarCobro = (fd: FormData) => {
    if (!abierto) return
    const d = esquemaCobro.parse({ facturaId: abierto.id, monto: Number(fd.get('monto')), medio: fd.get('medio') })
    registrar.mutate(d)
  }
  return { estado, cambiarEstado, cobros: data as Cobro[] | undefined, isLoading, error, puedeCobrar, abierto, setAbierto, enviarCobro, registrar }
}
```

Y `Cobranzas.tsx` queda con **su mismo JSX de siempre**, ahora consumiendo el hook:

```tsx
'use client'
import { useCobranzas, type Cobro } from './useCobranzas'

export type { Cobro } from './useCobranzas'   // la ficha del cliente lo sigue importando de acá

export default function Cobranzas() {
  const { estado, cambiarEstado, cobros, isLoading, error, puedeCobrar, abierto, setAbierto, enviarCobro } = useCobranzas()
  if (isLoading) return <div style={{padding: 20}}>Cargando...</div>
  if (error) return <div style={{color: 'red'}}>Error!!</div>
  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-xl font-bold text-blue-700">COBRANZAS</h2>
      <select value={estado} onChange={e => cambiarEstado(e.target.value)}>
        <option value="pendiente">Pendientes</option><option value="vencida">Vencidas</option>
      </select>
      <table className="border w-full"><tbody>
        {cobros?.map((c: Cobro) => (
          <tr key={c.id} data-testid={`fila-${c.id}`} className={c.estado === 'vencida' ? 'bg-red-500 text-white' : ''}>
            <td>{c.factura}</td><td>{c.cliente}</td><td>{c.monto}</td>
            <td>{puedeCobrar && <button onClick={() => setAbierto(c)} className="bg-green-600 text-white">Cobrar</button>}</td>
          </tr>
        ))}
      </tbody></table>
      {abierto && (
        <form onSubmit={e => { e.preventDefault(); enviarCobro(new FormData(e.currentTarget)) }}>
          <input name="monto" type="number" />
          <select name="medio"><option>transferencia</option></select>
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  )
}
```

Detalles que importan:
- `export type { Cobro }` se queda en `Cobranzas.tsx` porque otros archivos lo importan desde ahí. Moverlo sin dejar el re-export rompe el typecheck en otro lado.
- `esquemaCobro` y sus mensajes viajan tal cual. Los mensajes se reescriben recién en el paso 2, si hace falta, porque son texto de interfaz.
- El hook devuelve también `registrar` entero: la vista nueva va a usar `registrar.isPending` para el "Guardando…".

**La guardia en este commit:**

```
$ node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base main
guardia-datos · base main (db16914) → HEAD~1
2 archivos tocados · 2 con código · 38 firmas antes · 42 después

Avisos (no frenan) · 1
  · nueva hook: useCobranzas (app/cobranzas/Cobranzas.tsx:7)

Movidas (están bien) · 34 firmas cambiaron de archivo
  · 32 · app/cobranzas/Cobranzas.tsx → app/cobranzas/useCobranzas.ts
  · 2 · también en app/cobranzas/useCobranzas.ts

PASA · ningún dato, endpoint, campo, ruta ni permiso desapareció o cambió
```

Las 34 firmas (la URL, el `POST`, las tres claves del cuerpo, las dos query keys, los hooks, el esquema, el parámetro, la ruta, el permiso, los campos del tipo…) se mudaron al hook. Ninguna cambió. El aviso es el hook nuevo, esperado. Las capturas del antes y de este commit son idénticas.

Commit: `overhaul Cobranzas 1/2: datos a useCobranzas, sin cambios visuales`.

---

## 2. La vista nueva con las piezas de la skill

Desde acá, `Cobranzas.tsx` solo recibe y dibuja. Se reescribe entero.

### 2.1 El adaptador

`app/cobranzas/vista/adaptar.ts`: pasa de la forma del `Cobro` a lo que piden las piezas. Puro, sin hooks y sin lógica de negocio.

```ts
// Adaptador: de la forma de los datos viejos a lo que piden las piezas nuevas.
// Solo lee y da formato. No recalcula montos ni filtra filas: eso es del servidor.
import type { Cobro } from '../useCobranzas'
import type { Tono } from '@/componentes/base'

export const TONO_ESTADO: Record<Cobro['estado'], { tono: Tono; texto: string }> = {
  pendiente: { tono: 'ambar', texto: 'Pendiente' },
  vencida: { tono: 'rojo', texto: 'Vencida' },
  cobrada: { tono: 'verde', texto: 'Cobrada' },
}

// Los totales se muestran por moneda y nunca se suman entre sí (SKILL.md §6c).
export function resumen(cobros: Cobro[] = []) {
  const porMoneda = { ARS: 0, USD: 0 }
  let vencidas = 0
  for (const c of cobros) {
    porMoneda[c.moneda] += c.monto
    if (c.estado === 'vencida') vencidas++
  }
  return { cantidad: cobros.length, vencidas, porMoneda }
}
```

`resumen` suma lo que ya llegó, por moneda: no hay cifra que antes se mostrara y ahora diga otra cosa (antes no había totales). Si la vieja hubiera mostrado un total que mezclaba pesos con dólares, separarlo **cambia una cifra** y va en "Cifras que cambian" del informe con OK (`rediseno.md` §0).

### 2.2 La vista

`app/cobranzas/Cobranzas.tsx` (las piezas se copiaron a `@/componentes/` desde `componentes/` de la skill):

```tsx
'use client'
import { HandCoinsIcon, WarningIcon } from '@phosphor-icons/react'
import { useCobranzas, type Cobro } from './useCobranzas'
import { TONO_ESTADO, resumen } from './vista/adaptar'
import { Segmentado, Pastilla, Boton, Campo } from '@/componentes/base'
import { Kpi, Cuenta } from '@/componentes/datos'
import { Cabecera, Tabla, HojaLateral, Vacio, ErrorEnLugar, EsqueletoKpi, type Columna } from '@/componentes/estructura'

export type { Cobro } from './useCobranzas'

const ESTADOS = [
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'vencida', texto: 'Vencidas' },
] as const

export default function Cobranzas() {
  const { estado, cambiarEstado, cobros, isLoading, error, puedeCobrar, abierto, setAbierto, enviarCobro, registrar } = useCobranzas()
  const r = resumen(cobros)

  const columnas: Columna<Cobro>[] = [
    { id: 'factura', titulo: 'Comprobante', tipo: 'codigo', valor: c => c.factura, movil: 'meta' },
    { id: 'cliente', titulo: 'Cliente', valor: c => c.cliente, movil: 'titulo' },
    { id: 'estado', titulo: 'Estado', tipo: 'estado', movil: 'estado',
      celda: c => <Pastilla tono={TONO_ESTADO[c.estado].tono}>{TONO_ESTADO[c.estado].texto}</Pastilla> },
    { id: 'vence', titulo: 'Vence', tipo: 'fecha', valor: c => c.vence, movil: 'meta' },
    { id: 'monto', titulo: 'Monto', tipo: 'monto', moneda: c => c.moneda, valor: c => c.monto, movil: 'monto' },
    { id: 'acciones', titulo: '', tipo: 'acciones', movil: 'oculta',
      celda: c => puedeCobrar
        ? <Boton tamano="chico" variante="principal" onClick={() => setAbierto(c)}>Cobrar</Boton>
        : null },
  ]

  return (
    <div className="flex flex-col gap-7">
      <Cabecera
        titulo="Cobranzas"
        cifras={[
          { valor: r.cantidad, texto: estado === 'vencida' ? 'vencidas' : 'por cobrar' },
          ...(r.vencidas ? [{ valor: r.vencidas, texto: 'vencidas', tono: 'rojo' as const }] : []),
        ]}
      />

      <Segmentado aria-label="Estado" opciones={ESTADOS} valor={estado as 'pendiente' | 'vencida'} onCambio={cambiarEstado} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading ? <><EsqueletoKpi /><EsqueletoKpi /><EsqueletoKpi /></> : <>
          <Kpi rotulo="En pesos" icono={<HandCoinsIcon size={16} />} unidad="$" valor={<Cuenta hasta={r.porMoneda.ARS} />} contexto={`${r.cantidad} comprobantes`} />
          <Kpi rotulo="En dólares" icono={<HandCoinsIcon size={16} />} unidad="US$" valor={<Cuenta hasta={r.porMoneda.USD} />} contexto="sin pasar a pesos" />
          <Kpi rotulo="Vencidas" icono={<WarningIcon size={16} />} valor={<Cuenta hasta={r.vencidas} />} contexto="requieren atención" />
        </>}
      </div>

      <Tabla
        etiqueta="Cobros"
        filas={cobros ?? []}
        columnas={columnas}
        clave={c => c.id}
        cargando={isLoading}
        error={error ? { titulo: 'No pudimos cargar los cobros', texto: 'Los datos que ya estaban siguen a la vista.' } : undefined}
        vacio={<Vacio titulo={estado === 'vencida' ? 'No hay cobros vencidos' : 'No hay cobros pendientes'} texto="Cuando se emita una factura aparece acá." />}
      />

      <HojaLateral abierta={!!abierto} onCerrar={() => setAbierto(null)} titulo={abierto ? `Cobrar ${abierto.factura}` : 'Cobrar'}
        pie={<Boton variante="principal" type="submit" form="form-cobro" cargando={registrar.isPending} textoCargando="Guardando…">Guardar</Boton>}>
        <form id="form-cobro" className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); enviarCobro(new FormData(e.currentTarget)) }}>
          <Campo rotulo="Monto" name="monto" type="number" numerico prefijo={abierto?.moneda === 'USD' ? 'US$' : '$'} />
          <label className="flex flex-col gap-1.5 text-[13px] text-texto-2">
            Medio de pago
            <select name="medio" className="h-[38px] rounded-control border border-borde bg-superficie px-3 text-[14px] text-tinta">
              <option>transferencia</option>
            </select>
          </label>
        </form>
      </HojaLateral>
    </div>
  )
}
```

Qué cambió y qué no:

| Antes | Después | El contrato |
|---|---|---|
| `<h2>` COBRANZAS azul en negrita | `<Cabecera>` con título display y cifras reales | — |
| `<select>` que hace `router.push` | `<Segmentado>` que llama a `cambiarEstado` | mismo `?estado=` con los mismos valores |
| `<table>` sin formato | `<Tabla>` con montos por moneda, pastilla de estado, tarjetas en celular | mismas filas, mismo orden (el que manda el servidor) |
| Fila roja con texto blanco | Pastilla "Vencida" con punto | — |
| Botón verde | Acción de fila chica (resuelve una decisión pendiente) | **la misma condición `puedeCobrar`** |
| Form debajo de la tabla | `<HojaLateral>` con `<Campo name="monto">` y `<select name="medio">` | mismos `name`, mismo handler, mismo esquema |
| "Cargando..." | Esqueletos de KPI y de la tabla | sigue habiendo estado de carga |
| "Error!!" reemplaza la pantalla | Error en el lugar dentro de la tabla | sigue habiendo estado de error |
| — | `<Vacio>` | se suma (está permitido) |
| — | 3 KPI por moneda, sin sumar monedas | cifras nuevas, sin cifra vieja que cambie |
| `data-testid="fila-<id>"` en `<tr>` | `<Tabla>` pone `data-fila="<id>"` en cada fila | **cambia**: ver paso 3 |

La lista de comportamiento queda:

```
[x] Filtro por estado (?estado=pendiente|vencida) → Segmentado, mismo parámetro
[x] Botón Cobrar por fila, solo si puedeCobrar → acción de fila, misma condición
[x] Form de cobro: monto + medio, valida esquemaCobro, manda el POST → HojaLateral, mismos name, mismo handler
[x] Después de guardar se refresca la lista → sin cambios (vive en el hook)
[x] Cargando → EsqueletoKpi + Tabla cargando
[x] Error → ErrorEnLugar dentro de la Tabla (antes reemplazaba la pantalla: mejora anotada)
[x] data-testid="fila-<id>" → la Tabla usa data-fila; prueba e2e actualizada a propósito (permitido)
[+] Vacío → nuevo
```

---

## 3. Qué verificó la guardia

### 3.1 La primera corrida del paso 2 frena

```
$ node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base HEAD~1
guardia-datos · base HEAD~1 (ee74bfe) → HEAD
3 archivos tocados · 2 con código · 7 firmas antes · 7 después

FALLA · 1 firma de datos cambió o desapareció

  prueba
    app/cobranzas/Cobranzas.tsx:18 · desapareció
      antes:   data-testid="fila-${}"
      después: —

  Si el cambio es a propósito y lo aprobó el dueño de los datos: --permitir "<texto de la firma>"
  o una línea en .guardia-datos-permitir. Si no, volvé a poner la firma como estaba.

Avisos (no frenan) · 1
  · nueva ancla: id="form-cobro" (app/cobranzas/Cobranzas.tsx:65)
```

La `<Tabla>` de la skill marca cada fila con `data-fila="<id>"` (lo usa para llevarte a la fila con `enfocar`) y no deja poner atributos propios en el `<tr>`. Había dos salidas:

- Pedirle al coordinador una prop `atributosFila` en la `Tabla` (cambio de pieza compartida, para todos).
- Cambiar la prueba e2e para que busque `[data-fila="<id>"]`.

Se eligió la segunda, con OK de quien mantiene las pruebas. Se cambió la prueba en el mismo commit y se dejó escrita la decisión en la raíz del repo:

```
# .guardia-datos-permitir
# Overhaul Cobranzas (17/11): la Tabla marca cada fila con data-fila="<id>".
# La prueba e2e se cambió a propósito a [data-fila="<id>"]. OK de Lucía (administración).
data-testid="fila-${}"
```

### 3.2 La corrida final, contra main

```
$ node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base main
guardia-datos · base main (db16914) → árbol actual
4 archivos tocados · 3 con código · 38 firmas antes · 42 después

Avisos (no frenan) · 2
  · nueva hook: useCobranzas (app/cobranzas/Cobranzas.tsx:17)
  · nueva ancla: id="form-cobro" (app/cobranzas/Cobranzas.tsx:65)

Permitidas a propósito · 1
  · prueba: data-testid="fila-${}" → —

Movidas (están bien) · 34 firmas cambiaron de archivo
  · 32 · app/cobranzas/Cobranzas.tsx → app/cobranzas/useCobranzas.ts
  · 2 · también en app/cobranzas/useCobranzas.ts

PASA · ningún dato, endpoint, campo, ruta ni permiso desapareció o cambió (fuera de lo permitido)
```

### 3.3 Las tentaciones que la guardia frenó

Durante el paso 2 se probaron a propósito los "de paso" típicos. Cada uno frenó con código 1:

| Tentación | Lo que dijo la guardia |
|---|---|
| `fetch('/api/cobranzas')` "porque la pantalla se llama así" | `api · cambió · antes: /api/cobros · después: /api/cobranzas` |
| `facturaId` en el cuerpo "para que sea camelCase" | `cuerpo · cambió · antes: JSON.stringify → factura_id · después: JSON.stringify → facturaId` |
| `queryKey: ['cobranzas', estado]` | `query-key · cambió · antes: queryKey ['cobros',estado] · después: queryKey ['cobranzas',estado]` |
| `rol === 'cobrador'` "que es como se dice" | `permiso · cambió · antes: rol === 'cobranzas' · después: rol === 'cobrador'` |
| `<select name="medioPago">` | `campo · cambió · antes: name="medio" · después: name="medioPago"` |
| `celda: c => <Boton …>` sin `puedeCobrar` | `permiso · desapareció · antes: puedeCobrar · después: —` |
| `z.number().nonnegative()` en vez de `positive()` | `esquema · cambió · antes: esquemaCobro.monto: z.number().positive()` |

Reescribir el mensaje `'El monto tiene que ser mayor a 0'` por `'Poné un monto mayor a cero'` **no** frena: los mensajes de validación son texto de interfaz.

### 3.4 Lo que la guardia no ve (y se miró a mano)

- **Una condición nueva que no es de permiso.** `puedeCobrar && c.estado !== 'cobrada'` esconde Cobrar en las filas cobradas: parece lógico, pero la vieja lo mostraba (sirve para registrar un segundo pago parcial). La guardia no lo frena porque `puedeCobrar` sigue usándose. Lo frenó la lista de comportamiento. Se sacó.
- **El orden.** `<Tabla>` puede ordenar por columna. El orden inicial quedó sin `ordenInicial`, así que se respeta el que manda el servidor.
- **La red.** Se grabó la tarea "filtrar vencidas → cobrar FAC-01101 por $ 120.000 en transferencia" antes y después (`overhaul.md` §5.4): mismo `GET /api/cobros?estado=vencida`, mismo `POST /api/cobros` con `{"factura_id":"…","monto":120000,"medio":"transferencia"}` y el mismo `GET` de refresco. `diff` vacío.
- **Los roles.** Con las cuentas de prueba de `admin`, `cobranzas` y `comercial`: los dos primeros ven Cobrar, el tercero no. Igual que antes.
- **El revisor visual.** `revisar.mjs` en 1440, `--celular` y `--oscuro`, con nota de 85 o más en los tres.
- **Typecheck y pruebas.** `tsc --noEmit` sin errores (el `export type { Cobro }` evitó que se rompiera la ficha del cliente) y la e2e verde con el selector nuevo.

Commit: `overhaul Cobranzas 2/2: vista nueva (Cabecera, KPI por moneda, Tabla, HojaLateral)`, detrás de la bandera `usarVistaNueva('cobranzas')` (`overhaul.md` §2.4) durante una semana.
