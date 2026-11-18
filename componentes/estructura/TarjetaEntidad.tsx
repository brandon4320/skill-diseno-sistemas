'use client'
/**
 * TarjetaEntidad: lo que está "en curso" (proyecto, servicio, oportunidad grande) va en
 * tarjeta, no en fila (referencia 06). Lleva el color propio de la entidad en el cuadrito,
 * en la barra de bloques y en la curva de actividad; abajo, los próximos pasos con check.
 *
 * También exporta las piezas chicas que usan las demás: Pastilla, colorEntidad, Bloques y Curva.
 */
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { ArrowUpRightIcon, CalendarBlankIcon, CheckIcon, PlusIcon, type Icon } from '@phosphor-icons/react'
import { useMarco } from './MarcoApp'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'

/* ── Color fijo por entidad ─────────────────────────────────────────────── */

/** Paleta de entidades (no de estados). El mismo id da siempre el mismo color. */
export const PALETA_ENTIDAD = ['#3b6fe0', '#d6336c', '#c8692b', '#25a866', '#7c5ce0', '#0e9aa7'] as const

export function colorEntidad(id: string): string {
  const h = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  return PALETA_ENTIDAD[h % PALETA_ENTIDAD.length]
}

/* ── Pastilla de estado ─────────────────────────────────────────────────── */

export type Tono = 'verde' | 'ambar' | 'rojo' | 'azul' | 'gris'

export const TONO_PASTILLA: Record<Tono, string> = {
  verde: 'bg-verde-fondo text-verde-texto',
  ambar: 'bg-ambar-fondo text-ambar-texto',
  rojo: 'bg-rojo-fondo text-rojo-texto',
  azul: 'bg-azul-fondo text-azul-texto',
  gris: 'bg-gris-fondo text-gris-texto',
}

/** Fondo al 10 % + texto saturado + punto. Nunca solo color: siempre con palabra. */
export function Pastilla({ tono, children, punto = true }: { tono: Tono; children: ReactNode; punto?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-chip px-2 text-xs font-medium whitespace-nowrap',
        TONO_PASTILLA[tono],
      )}
    >
      {punto && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* ── Dibujos ────────────────────────────────────────────────────────────── */

const sinMovimiento = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Barra de bloques "3 de 6". Los hechos crecen uno detrás del otro al cargar. */
export function Bloques({ hechos, total, color, alto = 7 }: { hechos: number; total: number; color: string; alto?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (sinMovimiento() || !ref.current) return
    ;[...ref.current.children].slice(0, hechos).forEach((el, i) =>
      (el as HTMLElement).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: 420,
        delay: 120 + i * 45,
        easing: 'cubic-bezier(.23,1,.32,1)',
        fill: 'backwards',
      }),
    )
  }, [hechos])
  return (
    <div ref={ref} className="flex flex-1 gap-1" role="img" aria-label={`${hechos} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className="flex-1 origin-left rounded-[3px] bg-suave"
          style={{ height: alto, ...(i < hechos ? { background: color } : null) }}
        />
      ))}
    </div>
  )
}

function trazo(p: [number, number][]) {
  return p.reduce((acc, [x, y], i) => {
    if (!i) return `M${x},${y}`
    const a = p[i - 2] ?? p[i - 1]
    const b = p[i + 1] ?? p[i]
    const [px, py] = p[i - 1]
    return `${acc} C${px + (x - a[0]) / 6},${py + (y - a[1]) / 6} ${x - (b[0] - px) / 6},${y - (b[1] - py) / 6} ${x},${y}`
  }, '')
}

/** Curva con área degradé y puntos marcados. Se dibuja de izquierda a derecha al cargar. */
export function Curva({
  valores,
  color,
  alto = 42,
  marcas = [],
}: {
  valores: number[]
  color: string
  alto?: number
  /** Índices de los puntos a marcar con un círculo (el último hito, el pico). */
  marcas?: number[]
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const w = 200
  const mx = Math.max(...valores)
  const mn = Math.min(...valores)
  const p = valores.map((v, i): [number, number] => [
    (i * w) / Math.max(1, valores.length - 1),
    alto - 5 - ((v - mn) / (mx - mn || 1)) * (alto - 12),
  ])
  const d = trazo(p)

  useEffect(() => {
    if (sinMovimiento() || !ref.current) return
    ref.current.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
      duration: 1100,
      easing: 'cubic-bezier(.23,1,.32,1)',
      fill: 'backwards',
      delay: 80,
    })
  }, [])

  if (valores.length < 2) return null
  return (
    <div ref={ref} className="relative" style={{ height: alto }}>
      <svg viewBox={`0 0 ${w} ${alto}`} preserveAspectRatio="none" className="absolute inset-0 block size-full" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${w},${alto} L0,${alto}Z`} fill={`url(#${id})`} />
        <path d={d} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Los puntos van en HTML para que no se deformen con preserveAspectRatio="none". */}
      {marcas.map((i) =>
        p[i] ? (
          <span
            key={i}
            aria-hidden
            className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.6px] bg-superficie"
            style={{ left: `${(p[i][0] / w) * 100}%`, top: p[i][1], borderColor: color }}
          />
        ) : null,
      )}
    </div>
  )
}

/* ── Tarjeta ────────────────────────────────────────────────────────────── */

export type PasoEntidad = {
  id: string
  texto: string
  /** "Hoy", "mañana", "15 dic". */
  cuando?: string
  vencido?: boolean
  hecho?: boolean
}

export type TarjetaEntidadProps = {
  id: string
  nombre: string
  icono: Icon
  /** Si no viene, sale de colorEntidad(id). */
  color?: string
  href?: string
  descripcion?: string
  prioridad?: { texto: string; tono: Tono }
  etiquetas?: string[]
  avance?: { hechos: number; total: number }
  /** "9 dic". */
  vence?: string
  /** Serie de actividad de los últimos días (sparkline). */
  actividad?: number[]
  /** Textos al pie de la curva: ["12 movimientos · 14 días", "1 hecha"]. */
  actividadPie?: [string, string?]
  pasos?: PasoEntidad[]
  onTildar?: (pasoId: string, hecho: boolean) => void
  onAgregarPaso?: () => void
  className?: string
}

export function TarjetaEntidad({
  id,
  nombre,
  icono: Icono,
  color,
  href,
  descripcion,
  prioridad,
  etiquetas = [],
  avance,
  vence,
  actividad,
  actividadPie,
  pasos,
  onTildar,
  onAgregarPaso,
  className,
}: TarjetaEntidadProps) {
  const { enlace: Enlace } = useMarco()
  const c = color ?? colorEntidad(id)
  const pct = avance && avance.total ? Math.round((avance.hechos / avance.total) * 100) : null
  const abiertos = pasos?.filter((p) => !p.hecho).length ?? 0

  const titulo = (
    <>
      <span className="grid size-[22px] shrink-0 place-items-center rounded-chip text-white" style={{ background: c }}>
        <Icono weight="fill" size={12} />
      </span>
      <span className="min-w-0 truncate">{nombre}</span>
      {href && (
        <ArrowUpRightIcon
          size={16}
          className={cn('ml-auto shrink-0 text-texto-3 transition-transform duration-300', EASE, 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-tinta')}
        />
      )}
    </>
  )

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-tarjeta border border-borde bg-superficie',
        'transition-[transform,box-shadow,border-color] duration-300 motion-reduce:transition-none',
        EASE,
        'hover:-translate-y-0.5 hover:border-borde-fuerte hover:shadow-hover',
        className,
      )}
    >
      <div className="px-5 pt-4 pb-4">
        {(prioridad || etiquetas.length > 0) && (
          <div className="flex items-center gap-1.5">
            {prioridad && (
              <Pastilla tono={prioridad.tono} punto={false}>
                {prioridad.texto}
              </Pastilla>
            )}
            <span className="ml-auto flex gap-1">
              {etiquetas.map((t) => (
                <span key={t} className="inline-flex h-[22px] items-center rounded-chip border border-borde px-2 text-xs font-medium text-texto-2">
                  {t}
                </span>
              ))}
            </span>
          </div>
        )}
        <h3 className="font-display mt-4 text-xl leading-tight font-medium tracking-[-.02em]">
          {href ? (
            <Enlace href={href} className="flex items-center gap-2 rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45">
              {titulo}
            </Enlace>
          ) : (
            <span className="flex items-center gap-2">{titulo}</span>
          )}
        </h3>
        {descripcion && <p className="mt-1.5 line-clamp-2 text-[13px] text-texto-2">{descripcion}</p>}
        {avance && (
          <>
            <div className="mt-4 flex items-center gap-2">
              <Bloques hechos={avance.hechos} total={avance.total} color={c} />
              <b className="font-display text-[13px] font-medium tabular-nums">{pct} %</b>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-texto-3 tabular-nums">
              {avance.hechos} de {avance.total} hechas
              {vence && (
                <>
                  <span aria-hidden>·</span>
                  <CalendarBlankIcon size={13} />
                  Vence {vence}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {actividad && actividad.length > 1 && (
        <div className="border-y border-divisor bg-linear-to-b from-panel to-superficie px-5 pt-3 pb-2">
          <Curva valores={actividad} color={c} alto={56} marcas={[Math.max(0, actividad.length - 3), actividad.length - 1]} />
          {actividadPie && (
            <div className="mt-1 flex justify-between text-xs text-texto-3 tabular-nums">
              <span>{actividadPie[0]}</span>
              {actividadPie[1] && <span>{actividadPie[1]}</span>}
            </div>
          )}
        </div>
      )}

      {pasos && (
        <div className="flex flex-1 flex-col px-5 pt-3 pb-1.5">
          <div className="mb-1 flex justify-between text-xs font-medium text-texto-3 tabular-nums">
            <span>Próximos pasos</span>
            <span>{abiertos} abiertos</span>
          </div>
          <ul className="divide-y divide-divisor">
            {pasos.map((p) => (
              <li key={p.id} className="flex h-[34px] items-center gap-2 text-[13px]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={!!p.hecho}
                  aria-label={p.hecho ? `Marcar "${p.texto}" como pendiente` : `Marcar "${p.texto}" como hecho`}
                  onClick={() => onTildar?.(p.id, !p.hecho)}
                  className={cn(
                    'relative grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-[background,border-color,transform] duration-200 active:scale-90',
                    EASE,
                    'before:absolute before:-inset-[13px] before:content-[""]', // toque de 44 px
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45',
                    p.hecho ? 'border-verde-texto bg-verde-texto text-white' : 'border-borde-fuerte hover:border-verde-texto',
                  )}
                >
                  {p.hecho && <CheckIcon size={10} weight="bold" />}
                </button>
                <span className={cn('min-w-0 flex-1 truncate', p.hecho && 'text-texto-3')}>{p.texto}</span>
                {p.cuando && (
                  <span className={cn('shrink-0 text-xs', p.vencido && !p.hecho ? 'font-medium text-rojo-texto' : 'text-texto-3')}>
                    {p.vencido && !p.hecho ? 'Vencido' : p.cuando}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {onAgregarPaso && (
            <button
              type="button"
              onClick={onAgregarPaso}
              className="mt-auto flex h-10 items-center gap-1.5 rounded-chip text-[13px] font-medium text-texto-3 hover:text-tinta focus-visible:outline-2 focus-visible:outline-acento/45"
            >
              <PlusIcon size={14} />
              Agregar paso
            </button>
          )}
        </div>
      )}
    </article>
  )
}

/* ── Monograma ──────────────────────────────────────────────────────────── */

/** Avatar sin foto: iniciales sobre el color de la entidad al 14 %. */
export function Monograma({ nombre, id, tamano = 26, foto }: { nombre: string; id?: string; tamano?: number; foto?: string }) {
  const c = colorEntidad(id ?? nombre)
  const iniciales = nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  if (foto)
    return <img src={foto} alt="" className="shrink-0 rounded-full bg-suave object-cover" style={{ width: tamano, height: tamano }} />
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full font-medium"
      style={{
        width: tamano,
        height: tamano,
        fontSize: Math.round(tamano * 0.38),
        background: `color-mix(in oklch, ${c} 14%, var(--color-superficie))`,
        color: c,
      }}
    >
      {iniciales}
    </span>
  )
}
