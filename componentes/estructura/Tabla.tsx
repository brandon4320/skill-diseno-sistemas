'use client'
/**
 * Tabla<T>: columnas tipadas, alineación por tipo, orden, selección con barra de lote,
 * estado vacío obligatorio, cargando con esqueleto, error en el lugar, y en celular pasa a
 * tarjetas de 2 líneas (título y monto arriba, estado y metadatos abajo).
 *
 * - Sin líneas verticales. Encabezado de 12 px gris sobre bandeja `bg-suave`. Filas de 46 px.
 * - Montos a la derecha, `tabular-nums`, la moneda y los centavos en gris. Códigos en mono.
 * - Lo que falta es "—", nunca 0 ni "null".
 * - `colorFila` dibuja la rayita de 3 px del color de la entidad (no pinta la fila).
 * - `enfocar={id}` lleva a la fila y la hace destellar en dorado (todo botón que lleva a
 *   una lista te deja parado en su fila).
 *
 *   const columnas: Columna<Factura>[] = [
 *     { id: 'codigo', titulo: 'Comprobante', tipo: 'codigo', valor: (f) => f.codigo, movil: 'meta' },
 *     { id: 'cliente', titulo: 'Cliente', valor: (f) => f.cliente, celda: (f) => <><Monograma nombre={f.cliente} /> {f.cliente}</>, movil: 'titulo' },
 *     { id: 'estado', titulo: 'Estado', tipo: 'estado', celda: (f) => <Pastilla tono={…}>{…}</Pastilla>, movil: 'estado' },
 *     { id: 'vence', titulo: 'Vence', tipo: 'fecha', valor: (f) => f.vence, movil: 'meta' },
 *     { id: 'monto', titulo: 'Monto', tipo: 'monto', moneda: 'USD', valor: (f) => f.monto, movil: 'monto' },
 *   ]
 *   <Tabla filas={facturas} columnas={columnas} clave={(f) => f.id} vacio={<Vacio … />} />
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, MinusIcon, XIcon } from '@phosphor-icons/react'
import { EsqueletoFilas } from './Esqueleto'
import { ErrorEnLugar } from './ErrorEnLugar'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

/* ── Tipos ──────────────────────────────────────────────────────────────── */

export type TipoColumna = 'texto' | 'codigo' | 'numero' | 'monto' | 'porcentaje' | 'fecha' | 'estado' | 'acciones'
export type Alineacion = 'izquierda' | 'centro' | 'derecha'
/** Qué lugar ocupa la columna en la tarjeta del celular. */
export type RolMovil = 'titulo' | 'monto' | 'estado' | 'meta' | 'oculta'
export type Valor = string | number | Date | null | undefined

export type Columna<T> = {
  id: string
  titulo: string
  tipo?: TipoColumna
  /** Dato crudo: se usa para ordenar y, si no hay `celda`, para dibujar según el tipo. */
  valor?: (fila: T) => Valor
  /** Dibujo propio (pastilla, monograma + nombre). */
  celda?: (fila: T) => ReactNode
  /** Por defecto sale del tipo: monto, número y porcentaje a la derecha. */
  alinear?: Alineacion
  /** Ancho CSS de la columna: '120px', '28%'. */
  ancho?: string
  /** Por defecto, ordenable si tiene `valor`. */
  ordenable?: boolean
  /** Fija o por fila (tablas bi-moneda). Si conviven monedas, no se suman. */
  moneda?: 'ARS' | 'USD' | ((fila: T) => 'ARS' | 'USD')
  /** Por defecto: estado→estado, monto→monto, la primera de texto→título, el resto→meta. */
  movil?: RolMovil
}

export type TablaProps<T> = {
  filas: T[]
  columnas: Columna<T>[]
  clave: (fila: T) => string
  /** Obligatorio: toda lista diseña su vacío. Usá <Vacio>. */
  vacio: ReactNode
  cargando?: boolean
  /** Si hay filas, va como banda arriba y las filas siguen a la vista. */
  error?: { titulo: string; texto?: string; onReintentar?: () => void | Promise<void> }
  seleccion?: { ids: ReadonlySet<string>; onCambiar: (ids: Set<string>) => void }
  /** Botones de la barra de lote (aparece al elegir filas). */
  accionesLote?: (ids: string[]) => ReactNode
  onFila?: (fila: T) => void
  /** Rayita de 3 px con el color de la entidad. */
  colorFila?: (fila: T) => string | undefined
  /** Fila a la que llevar y hacer destellar (por ejemplo, ?foco=FAC-01101). */
  enfocar?: string
  /** Fila marcada como recién resuelta: tinte verde tenue (éxito en el lugar). */
  resueltas?: ReadonlySet<string>
  ordenInicial?: { id: string; dir: 'asc' | 'desc' }
  /** Envoltorio de tarjeta (borde, radio 20, p-2). Apagalo si ya está dentro de una. */
  marco?: boolean
  /** Nombre para lectores de pantalla: "Facturas". */
  etiqueta: string
  className?: string
}

/* ── Formato por tipo ───────────────────────────────────────────────────── */

const nf = (o: Intl.NumberFormatOptions = {}) => new Intl.NumberFormat('es-AR', o)
const NADA = <span className="text-texto-3">—</span>
const vacioDe = (v: Valor) => v == null || v === '' || (typeof v === 'number' && Number.isNaN(v))

function fechaCorta(v: Date | string) {
  if (typeof v === 'string') return v
  const hoy = new Date()
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    ...(v.getFullYear() !== hoy.getFullYear() ? { year: 'numeric' } : null),
  })
    .format(v)
    .replace('.', '')
}

function Monto({ n, moneda = 'ARS', grande }: { n: number; moneda?: 'ARS' | 'USD'; grande?: boolean }) {
  const [entero, cent] = nf({ minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(n)).split(',')
  return (
    <span className={cn('whitespace-nowrap tabular-nums', grande && 'font-display text-base font-medium tracking-[-.01em]')}>
      <span className="mr-1 text-[.86em] font-normal text-texto-3">{moneda === 'USD' ? 'US$' : '$'}</span>
      {n < 0 && '−'}
      {entero}
      {cent !== '00' && <span className="text-[.86em] text-texto-3">,{cent}</span>}
    </span>
  )
}

function dibujar<T>(c: Columna<T>, f: T, grande = false): ReactNode {
  if (c.celda) return c.celda(f)
  const v = c.valor?.(f)
  if (vacioDe(v)) return NADA
  switch (c.tipo) {
    case 'monto':
      return typeof v === 'number' ? <Monto n={v} moneda={typeof c.moneda === 'function' ? c.moneda(f) : c.moneda} grande={grande} /> : String(v)
    case 'numero':
      return typeof v === 'number' ? <span className="tabular-nums">{nf().format(v)}</span> : String(v)
    case 'porcentaje':
      return typeof v === 'number' ? <span className="tabular-nums">{nf({ maximumFractionDigits: 1 }).format(v)} %</span> : String(v)
    case 'fecha':
      return <span className="whitespace-nowrap tabular-nums">{fechaCorta(v as Date | string)}</span>
    case 'codigo':
      return <span className="font-mono text-[13px] font-medium text-texto-2">{String(v)}</span>
    default:
      return <span className="block truncate">{v instanceof Date ? fechaCorta(v) : String(v)}</span>
  }
}

const alineacion = <T,>(c: Columna<T>): Alineacion =>
  c.alinear ?? (c.tipo === 'monto' || c.tipo === 'numero' || c.tipo === 'porcentaje' ? 'derecha' : c.tipo === 'acciones' ? 'derecha' : 'izquierda')
const CLASE_ALINEAR: Record<Alineacion, string> = { izquierda: 'text-left', centro: 'text-center', derecha: 'text-right' }

function comparar(a: Valor, b: Valor) {
  if (vacioDe(a)) return vacioDe(b) ? 0 : 1 // lo vacío siempre al final
  if (vacioDe(b)) return -1
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' })
}

/* ── Casilla ────────────────────────────────────────────────────────────── */

function Casilla({ estado, onCambiar, etiqueta }: { estado: boolean | 'mixto'; onCambiar: () => void; etiqueta: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={estado === 'mixto' ? 'mixed' : estado}
      aria-label={etiqueta}
      onClick={(e) => {
        e.stopPropagation()
        onCambiar()
      }}
      className={cn(
        'relative grid size-4 place-items-center rounded-[5px] border transition-[background,border-color] duration-150',
        'before:absolute before:-inset-3 before:content-[""]',
        estado ? 'border-tinta bg-tinta text-superficie' : 'border-borde-fuerte bg-superficie hover:border-texto-3',
        FOCO,
      )}
    >
      {estado === 'mixto' ? <MinusIcon size={10} weight="bold" /> : estado ? <CheckIcon size={10} weight="bold" /> : null}
    </button>
  )
}

/* ── Tabla ──────────────────────────────────────────────────────────────── */

export function Tabla<T>({
  filas,
  columnas,
  clave,
  vacio,
  cargando,
  error,
  seleccion,
  accionesLote,
  onFila,
  colorFila,
  enfocar,
  resueltas,
  ordenInicial,
  marco = true,
  etiqueta,
  className,
}: TablaProps<T>) {
  const [orden, setOrden] = useState(ordenInicial ?? null)
  const raiz = useRef<HTMLDivElement>(null)

  const ordenadas = useMemo(() => {
    if (!orden) return filas
    const col = columnas.find((c) => c.id === orden.id)
    if (!col?.valor) return filas
    const get = col.valor
    const s = [...filas].sort((a, b) => comparar(get(a), get(b)))
    return orden.dir === 'desc' ? s.reverse() : s
  }, [filas, columnas, orden])

  // Destello dorado en la fila enfocada (escritorio y celular).
  useEffect(() => {
    if (!enfocar || !raiz.current) return
    const els = [...raiz.current.querySelectorAll<HTMLElement>('[data-fila]')].filter((el) => el.dataset.fila === enfocar)
    const visible = els.find((el) => el.offsetParent !== null)
    if (!visible) return
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    visible.scrollIntoView({ block: 'center', behavior: quieto ? 'auto' : 'smooth' })
    visible.focus({ preventScroll: true })
    if (!quieto)
      visible.animate(
        [
          { backgroundColor: 'color-mix(in oklch, var(--color-ambar-fondo) 100%, transparent)', boxShadow: 'inset 3px 0 0 var(--color-ambar-texto)' },
          { backgroundColor: 'transparent', boxShadow: 'inset 3px 0 0 transparent' },
        ],
        { duration: 2200, delay: 250, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' },
      )
  }, [enfocar, ordenadas.length])

  const ids = ordenadas.map(clave)
  const nSel = seleccion ? ids.filter((id) => seleccion.ids.has(id)).length : 0
  const estadoTodas: boolean | 'mixto' = nSel === 0 ? false : nSel === ids.length ? true : 'mixto'

  function alternarFila(id: string) {
    if (!seleccion) return
    const n = new Set(seleccion.ids)
    if (n.has(id)) n.delete(id)
    else n.add(id)
    seleccion.onCambiar(n)
  }
  function alternarTodas() {
    if (!seleccion) return
    const n = new Set(seleccion.ids)
    if (estadoTodas === true) ids.forEach((id) => n.delete(id))
    else ids.forEach((id) => n.add(id))
    seleccion.onCambiar(n)
  }

  // Roles del celular
  const rol = (c: Columna<T>, i: number): RolMovil =>
    c.movil ??
    (c.tipo === 'estado' ? 'estado' : c.tipo === 'monto' ? 'monto' : c.tipo === 'acciones' ? 'oculta' : i === columnas.findIndex((x) => !x.tipo || x.tipo === 'texto') ? 'titulo' : 'meta')
  const cTitulo = columnas.find((c, i) => rol(c, i) === 'titulo')
  const cMonto = columnas.find((c, i) => rol(c, i) === 'monto')
  const cEstado = columnas.find((c, i) => rol(c, i) === 'estado')
  const cMeta = columnas.filter((c, i) => rol(c, i) === 'meta')

  const cuerpo = (() => {
    if (cargando && filas.length === 0) return <EsqueletoFilas filas={6} columnas={Math.min(6, columnas.length)} className="px-1" />
    if (filas.length === 0) return error ? <ErrorEnLugar titulo={error.titulo} texto={error.texto} onReintentar={error.onReintentar} /> : vacio

    return (
      <>
        {error && <ErrorEnLugar variante="banda" className="mb-2" titulo={error.titulo} texto={error.texto} onReintentar={error.onReintentar} />}

        {/* Escritorio */}
        <div className="hidden overflow-x-auto md:block">
          <table aria-label={etiqueta} aria-busy={cargando || undefined} className="w-full border-separate border-spacing-0 text-sm">
            <colgroup>
              {seleccion && <col style={{ width: 44 }} />}
              {columnas.map((c) => (
                <col key={c.id} style={c.ancho ? { width: c.ancho } : undefined} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {seleccion && (
                  <th className="rounded-l-[10px] bg-suave pl-4">
                    <Casilla estado={estadoTodas} onCambiar={alternarTodas} etiqueta={estadoTodas === true ? 'Quitar todas' : 'Elegir todas'} />
                  </th>
                )}
                {columnas.map((c, i) => {
                  const ord = (c.ordenable ?? !!c.valor) && c.tipo !== 'acciones'
                  const activo = orden?.id === c.id
                  const al = alineacion(c)
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      aria-sort={activo ? (orden.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                      className={cn(
                        'h-9 bg-suave px-3 text-xs font-medium whitespace-nowrap text-texto-3',
                        CLASE_ALINEAR[al],
                        !seleccion && i === 0 && 'rounded-l-[10px]',
                        i === columnas.length - 1 && 'rounded-r-[10px]',
                      )}
                    >
                      {ord ? (
                        <button
                          type="button"
                          onClick={() =>
                            setOrden((o) => (o?.id === c.id ? (o.dir === 'asc' ? { id: c.id, dir: 'desc' } : null) : { id: c.id, dir: 'asc' }))
                          }
                          className={cn(
                            'group/orden -mx-1 inline-flex items-center gap-1 rounded-chip px-1 transition-colors hover:text-tinta',
                            al === 'derecha' && 'flex-row-reverse',
                            activo && 'text-tinta',
                            FOCO,
                          )}
                        >
                          {c.titulo}
                          <span className={cn('transition-opacity', activo ? 'opacity-100' : 'opacity-0 group-hover/orden:opacity-60')}>
                            {activo && orden.dir === 'desc' ? <ArrowDownIcon size={11} weight="bold" /> : <ArrowUpIcon size={11} weight="bold" />}
                          </span>
                        </button>
                      ) : (
                        c.titulo
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ordenadas.map((f, fi) => {
                const id = clave(f)
                const sel = !!seleccion?.ids.has(id)
                const color = colorFila?.(f)
                const resuelta = resueltas?.has(id)
                const linea = fi < ordenadas.length - 1 && 'border-b border-divisor'
                return (
                  <tr
                    key={id}
                    data-fila={id}
                    tabIndex={onFila ? 0 : -1}
                    onClick={onFila ? () => onFila(f) : undefined}
                    onKeyDown={onFila ? (e) => e.key === 'Enter' && e.target === e.currentTarget && onFila(f) : undefined}
                    aria-selected={seleccion ? sel : undefined}
                    className={cn(
                      'group/f outline-none transition-colors duration-300',
                      onFila && 'cursor-pointer',
                      resuelta ? 'bg-verde-fondo/60' : sel ? 'bg-acento-suave/60 in-data-[tema=oscuro]:bg-acento/10' : 'hover:bg-hover',
                      'focus-visible:bg-hover',
                    )}
                  >
                    {seleccion && (
                      <td className={cn('relative h-[46px] pl-4 group-focus-visible/f:shadow-[inset_2px_0_0_var(--color-acento)]', linea)}>
                        {color && <Rayita color={color} />}
                        <Casilla estado={sel} onCambiar={() => alternarFila(id)} etiqueta={sel ? 'Quitar de la selección' : 'Elegir fila'} />
                      </td>
                    )}
                    {columnas.map((c, i) => (
                      <td
                        key={c.id}
                        className={cn(
                          'relative h-[46px] px-3',
                          // Texto: se trunca y se lleva el ancho que sobra. El resto: ancho justo, sin cortar.
                          !c.ancho && (!c.tipo || c.tipo === 'texto' ? 'w-full max-w-0' : 'w-px whitespace-nowrap'),
                          CLASE_ALINEAR[alineacion(c)],
                          c.tipo === 'monto' && 'font-medium',
                          !seleccion && i === 0 && 'group-focus-visible/f:shadow-[inset_2px_0_0_var(--color-acento)]',
                          linea,
                        )}
                      >
                        {!seleccion && i === 0 && color && <Rayita color={color} />}
                        <div className={cn('flex min-w-0 items-center gap-2', alineacion(c) === 'derecha' && 'justify-end', alineacion(c) === 'centro' && 'justify-center')}>
                          {dibujar(c, f)}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Celular: tarjetas de 2 líneas */}
        <ul aria-label={etiqueta} className="flex flex-col divide-y divide-divisor md:hidden">
          {ordenadas.map((f) => {
            const id = clave(f)
            const sel = !!seleccion?.ids.has(id)
            const color = colorFila?.(f)
            const resuelta = resueltas?.has(id)
            return (
              <li
                key={id}
                data-fila={id}
                tabIndex={onFila ? 0 : -1}
                onClick={onFila ? () => onFila(f) : undefined}
                onKeyDown={onFila ? (e) => e.key === 'Enter' && e.target === e.currentTarget && onFila(f) : undefined}
                className={cn(
                  'relative flex min-h-[64px] items-center gap-3 rounded-control px-2 py-3 outline-none transition-colors duration-300',
                  onFila && 'cursor-pointer active:bg-hover',
                  resuelta ? 'bg-verde-fondo/60' : sel && 'bg-acento-suave/60 in-data-[tema=oscuro]:bg-acento/10',
                  'focus-visible:bg-hover',
                )}
              >
                {color && <span aria-hidden className="absolute inset-y-3.5 left-0 w-[3px] rounded-full" style={{ background: color }} />}
                {seleccion && <Casilla estado={sel} onCambiar={() => alternarFila(id)} etiqueta={sel ? 'Quitar de la selección' : 'Elegir fila'} />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <div className="min-w-0 flex-1 truncate text-sm font-medium">{cTitulo ? dibujar(cTitulo, f) : null}</div>
                    {cMonto && <div className="shrink-0">{dibujar(cMonto, f, true)}</div>}
                  </div>
                  <div className="mt-1.5 flex min-w-0 items-center gap-2 text-xs text-texto-3">
                    {cEstado && <span className="shrink-0">{dibujar(cEstado, f)}</span>}
                    <span className="flex min-w-0 items-center gap-1.5 truncate">
                      {cMeta.map((c, i) => (
                        <span key={c.id} className="flex min-w-0 items-center gap-1.5">
                          {i > 0 && <span aria-hidden>·</span>}
                          {dibujar(c, f)}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )
  })()

  const lote = seleccion && nSel > 0 && (
    <div
      role="region"
      aria-label="Acciones sobre la selección"
      className={cn(
        'sticky bottom-3 z-10 mx-auto mt-2 flex w-fit max-w-full items-center gap-1 rounded-control bg-tinta py-1.5 pr-1.5 pl-4 text-superficie shadow-flotante',
        'animate-[ds-lote_.3s_cubic-bezier(.23,1,.32,1)] motion-reduce:animate-none',
        'max-md:bottom-[calc(var(--ds-pie-movil,0px)+12px+env(safe-area-inset-bottom))]',
      )}
    >
      <style href="ds-lote" precedence="ds">{`@keyframes ds-lote{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`}</style>
      <b className="mr-2 text-[13px] font-medium whitespace-nowrap tabular-nums">
        {nSel} {nSel === 1 ? 'elegida' : 'elegidas'}
      </b>
      <div className="flex items-center gap-1 [&_button]:text-superficie">{accionesLote?.(ids.filter((i) => seleccion.ids.has(i)))}</div>
      <button
        type="button"
        onClick={() => seleccion.onCambiar(new Set([...seleccion.ids].filter((i) => !ids.includes(i))))}
        aria-label="Quitar la selección"
        className="ml-1 grid size-8 place-items-center rounded-chip text-superficie/60 transition-colors hover:bg-superficie/10 hover:text-superficie"
      >
        <XIcon size={14} />
      </button>
    </div>
  )

  return (
    <div ref={raiz} className={cn('min-w-0', marco && 'rounded-tarjeta border border-borde bg-superficie p-2', className)}>
      {cuerpo}
      {lote}
    </div>
  )
}

function Rayita({ color }: { color: string }) {
  return <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-r-full" style={{ background: color }} />
}

/** Botón para la barra de lote (texto claro sobre la barra oscura). */
export function BotonLote({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('h-8 rounded-chip px-3 text-[13px] font-medium whitespace-nowrap transition-colors hover:bg-superficie/10', EASE, FOCO)}
    >
      {children}
    </button>
  )
}
