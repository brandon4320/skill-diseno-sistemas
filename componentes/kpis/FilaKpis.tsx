'use client'

import type { ReactNode } from 'react'
import { ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type MetricaFila = {
  id: string
  rotulo: string
  valor: ReactNode
  /** "%", "h", "días": en gris, más chico. */
  sufijo?: string
  contexto?: ReactNode
  /** <Variacion/> o una alerta chica. */
  pie?: ReactNode
}

export type FilaKpisProps = {
  titulo: string
  metricas: MetricaFila[]
  /** "Sincronizado hace 12 min". */
  frescura?: ReactNode
  /** Con esto aparece el botón de sincronizar. */
  onRecargar?: () => void
  recargando?: boolean
  className?: string
}

/**
 * Fila de KPIs con divisores (patrones 7.17 y 7.18): métricas hermanas en una sola tarjeta
 * partida con divide-x, no cuatro cajas. En celular pasa a 2 columnas con divide-y.
 */
export function FilaKpis({ titulo, metricas, frescura, onRecargar, recargando = false, className }: FilaKpisProps) {
  return (
    <section aria-busy={recargando || undefined} className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <header className="flex min-h-12 items-center gap-3 border-b border-divisor px-5">
        <h3 className="truncate text-sm font-semibold text-tinta">{titulo}</h3>
        <div className="ml-auto flex items-center gap-2 text-xs text-texto-3">
          {frescura && (
            <span className="flex items-center gap-1.5" aria-live="polite">
              <span aria-hidden className="size-1.5 rounded-full bg-verde-texto" />
              {frescura}
            </span>
          )}
          {onRecargar && (
            <button
              type="button"
              onClick={onRecargar}
              disabled={recargando}
              aria-label="Sincronizar ahora"
              title="Sincronizar ahora"
              className={cx('grid size-8 place-items-center rounded-control text-texto-2 transition-colors hover:bg-hover hover:text-tinta disabled:opacity-60', FOCO)}
            >
              <ArrowsClockwiseIcon size={16} aria-hidden className={cx(recargando && 'animate-spin motion-reduce:animate-none')} />
            </button>
          )}
        </div>
      </header>
      <dl className="grid grid-cols-2 divide-divisor max-sm:[&>div:nth-child(n+3)]:border-t max-sm:[&>div:nth-child(n+3)]:border-divisor max-sm:[&>div:nth-child(even)]:border-l max-sm:[&>div:nth-child(even)]:border-divisor sm:flex sm:divide-x">
        {metricas.map((m) => (
          <div key={m.id} className="flex min-w-0 flex-1 flex-col gap-1 px-5 py-4">
            <dt className="truncate text-xs font-medium text-texto-2">{m.rotulo}</dt>
            <dd className="font-display flex items-baseline text-[26px] leading-tight font-medium tracking-[-.03em] text-tinta tabular-nums">
              {m.valor ?? <span className="text-texto-3">—</span>}
              {m.sufijo && m.valor != null && <span className="ml-0.5 text-base font-normal tracking-normal text-texto-3">{m.sufijo}</span>}
            </dd>
            {m.contexto && <dd className="truncate text-xs text-texto-3">{m.contexto}</dd>}
            {m.pie && <dd className="mt-1 text-xs">{m.pie}</dd>}
          </div>
        ))}
      </dl>
    </section>
  )
}
