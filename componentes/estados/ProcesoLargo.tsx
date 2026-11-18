'use client'
/**
 * ProcesoLargo: importaciones, facturación en lote, exportes grandes. Ilustración animada a la
 * izquierda; título, barra con cantidad y tiempo restante, pasos que pasan de ◌ a ✓ y la frase
 * "Podés seguir usando el sistema". Se puede mandar a segundo plano (PildoraProceso) y al terminar
 * se reemplaza por ResultadoProceso: lo que hizo en verbos y cifras, lo parcial con ⚠ y su salida.
 *
 *   const restante = useTiempoRestante(hechos, total)
 *   <ProcesoLargo titulo="Importando contactos de clientes-2026.csv" hechos={hechos} total={1284}
 *     unidad="filas" restante={restante} pasos={pasos} onSegundoPlano={...} onCancelar={...} />
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowsInSimpleIcon, CheckCircleIcon, CheckIcon, CircleNotchIcon, WarningIcon } from '@phosphor-icons/react'
import { Ilustracion } from './Ilustracion'
import type { NombreIlustracion } from './ilustraciones'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
const num = (n: number) => new Intl.NumberFormat('es-AR').format(n)

export type EstadoPaso = 'pendiente' | 'activo' | 'hecho'
export type PasoProceso = { texto: string; estado: EstadoPaso; nota?: string }

/**
 * Tiempo restante con el ritmo de los últimos `ventana` ms, redondeado ("unos 40 s", "unos 3 min")
 * y que nunca sube de golpe: si el ritmo cae, se queda donde estaba hasta que vuelva a bajar.
 */
export function useTiempoRestante(hechos: number, total: number, ventana = 2000): string | null {
  const muestras = useRef<[number, number][]>([])
  const minimo = useRef(Infinity)
  const [texto, setTexto] = useState<string | null>(null)
  useEffect(() => {
    if (hechos <= 0) {
      muestras.current = []
      minimo.current = Infinity
      setTexto(null)
      return
    }
    const t = performance.now()
    muestras.current = [...muestras.current, [t, hechos] as [number, number]].filter(([x]) => t - x <= ventana)
    if (muestras.current.length < 3) return
    const [t0, h0] = muestras.current[0]
    const ritmo = (hechos - h0) / ((t - t0) / 1000)
    if (ritmo <= 0) return
    minimo.current = Math.min(minimo.current, (total - hechos) / ritmo)
    const s = minimo.current
    setTexto(s <= 5 ? 'casi listo' : s < 60 ? `quedan unos ${Math.ceil(s / 5) * 5} s` : `quedan unos ${Math.ceil(s / 60)} min`)
  }, [hechos, total, ventana])
  return texto
}

export type ProcesoLargoProps = {
  titulo: string
  /** Arriba del título: "Importando", con su estado. */
  rotulo?: string
  hechos: number
  total: number
  /** "filas", "facturas", "contactos". */
  unidad: string
  restante?: string | null
  pasos?: PasoProceso[]
  ilustracion?: NombreIlustracion
  onSegundoPlano?: () => void
  onCancelar?: () => void
  /** Reemplaza el pie cuando terminó (normalmente <ResultadoProceso>). */
  resultado?: ReactNode
  className?: string
}

export function ProcesoLargo({ titulo, rotulo = 'En curso', hechos, total, unidad, restante, pasos, ilustracion = 'cargando-algo-grande', onSegundoPlano, onCancelar, resultado, className }: ProcesoLargoProps) {
  const pct = total ? Math.min(1, hechos / total) : 0
  return (
    <section
      aria-label={titulo}
      className={cn(
        'grid items-center gap-5 overflow-hidden rounded-tarjeta border border-borde bg-superficie p-4 md:grid-cols-[200px_minmax(0,1fr)] md:gap-6 md:px-6 md:py-5',
        'bg-[radial-gradient(60%_90%_at_16%_40%,var(--ilus-clima),transparent_70%)]',
        className,
      )}
    >
      <Ilustracion nombre={ilustracion} tamano={200} className="mx-auto max-md:w-[132px]!" />
      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-azul-texto">
          {!resultado && <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" />}
          {rotulo}
        </span>
        <h4 className="mt-1 font-display text-xl leading-tight font-medium tracking-[-.02em] text-tinta">{titulo}</h4>
        <div
          role="progressbar"
          aria-label={titulo}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={hechos}
          aria-valuetext={`${num(hechos)} de ${num(total)} ${unidad}`}
          className="mt-4 h-2 overflow-hidden rounded-[4px] bg-suave"
        >
          <i className="block h-full rounded-[4px] bg-acento transition-[width] duration-300 ease-linear" style={{ width: `${pct * 100}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-[13px] tabular-nums">
          <span>
            <b className="font-medium">{num(hechos)}</b> <span className="text-texto-3">de {num(total)} {unidad}</span>
          </span>
          <span className="text-texto-3">{restante ?? '—'}</span>
        </div>
        {pasos && (
          <ol className="mt-4 flex flex-col gap-0.5">
            {pasos.map((p) => (
              <li
                key={p.texto}
                className={cn(
                  'flex h-[30px] items-center gap-2 rounded-chip px-2 text-[13px] transition-colors duration-300',
                  p.estado === 'activo' && 'bg-acento/5 text-tinta',
                  p.estado === 'hecho' && 'text-texto-2',
                  p.estado === 'pendiente' && 'text-texto-3',
                )}
              >
                <span className="grid size-[18px] place-items-center" aria-hidden>
                  {p.estado === 'hecho' ? <CheckCircleIcon size={16} weight="fill" className="text-verde-texto" /> : p.estado === 'activo' ? <CircleNotchIcon size={16} className="animate-spin text-acento motion-reduce:animate-none" /> : <span className="size-1.5 rounded-full bg-borde-fuerte" />}
                </span>
                {p.texto}
                <span className="sr-only">{p.estado === 'hecho' ? ' (hecho)' : p.estado === 'activo' ? ' (en curso)' : ''}</span>
                {p.nota && <span className="ml-auto font-mono text-xs text-texto-3">{p.nota}</span>}
              </li>
            ))}
          </ol>
        )}
        {resultado ?? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-auto text-xs text-texto-3">Podés seguir usando el sistema. Te avisamos al terminar.</span>
            {onSegundoPlano && (
              <button type="button" onClick={onSegundoPlano} className={cn('inline-flex h-7 items-center gap-1 rounded-chip border border-borde bg-superficie px-2.5 text-xs font-medium shadow-min hover:bg-hover max-md:h-11', FOCO)}>
                <ArrowsInSimpleIcon size={14} />
                Seguir en segundo plano
              </button>
            )}
            {onCancelar && (
              <button type="button" onClick={onCancelar} className={cn('inline-flex h-7 items-center rounded-chip px-2.5 text-xs font-medium text-rojo-texto hover:bg-rojo-fondo max-md:h-11', FOCO)}>
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/** Píldora negra abajo a la derecha mientras el proceso sigue en segundo plano. Clic la vuelve a abrir. */
export function PildoraProceso({ texto, hechos, total, onAbrir, className }: { texto: string; hechos: number; total: number; onAbrir: () => void; className?: string }) {
  const pct = total ? Math.min(1, hechos / total) : 0
  const r = 13
  const c = 2 * Math.PI * r
  return (
    <button
      type="button"
      onClick={onAbrir}
      className={cn('inline-flex h-11 items-center gap-2 rounded-full bg-tinta pr-3 pl-1.5 text-[13px] font-medium text-superficie tabular-nums shadow-flotante', FOCO, className)}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="-rotate-90">
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className="transition-[stroke-dashoffset] duration-300" />
      </svg>
      {texto} · {Math.round(pct * 100)} %
    </button>
  )
}

export type Efecto = { texto: ReactNode; tipo?: 'hecho' | 'aviso'; accion?: ReactNode }

/** Resultado como lista de efectos: verbos y cifras; lo parcial con ⚠ y la acción que lo resuelve. */
export function ResultadoProceso({ efectos, accion }: { efectos: Efecto[]; accion?: ReactNode }) {
  return (
    <div className="mt-3">
      <ul className="flex flex-col">
        {efectos.map((e, i) => (
          <li key={i} className="flex min-h-9 flex-wrap items-center gap-2 border-t border-divisor text-[13px] first:border-t-0">
            <span className={cn('grid size-[22px] place-items-center rounded-[7px]', e.tipo === 'aviso' ? 'bg-ambar-fondo text-ambar-texto' : 'bg-verde-fondo text-verde-texto')} aria-hidden>
              {e.tipo === 'aviso' ? <WarningIcon size={13} /> : <CheckIcon size={13} />}
            </span>
            {e.texto}
            {e.accion && <span className="ml-auto">{e.accion}</span>}
          </li>
        ))}
      </ul>
      {accion && <div className="mt-3">{accion}</div>}
    </div>
  )
}
