'use client'

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type OpcionSelector = { id: string; rotulo: string; valor: ReactNode; contexto?: ReactNode; color: string }

export type KpiSelectorProps = {
  opciones: OpcionSelector[]
  /** Controlado: el KPI cuya serie muestra el gráfico. */
  activo: string
  onCambiar: (id: string) => void
  /** El gráfico de la serie activa. */
  children: ReactNode
  etiqueta?: string
  className?: string
}

/**
 * KPIs como selector del gráfico: los KPIs son pestañas (role=tab, flechas para moverse)
 * y el gráfico de abajo muestra la serie del elegido. El elegido lleva una rayita de su color.
 */
export function KpiSelector({ opciones, activo, onCambiar, children, etiqueta = 'Métrica del gráfico', className }: KpiSelectorProps) {
  const base = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const mover = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const j = (i + d + opciones.length) % opciones.length
    onCambiar(opciones[j].id)
    refs.current[j]?.focus()
  }
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <div role="tablist" aria-label={etiqueta} className="grid grid-cols-2 border-b border-divisor sm:flex">
        {opciones.map((o, i) => {
          const sel = o.id === activo
          return (
            <button
              key={o.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${base}-t-${o.id}`}
              aria-selected={sel}
              aria-controls={`${base}-p`}
              tabIndex={sel ? 0 : -1}
              onClick={() => onCambiar(o.id)}
              onKeyDown={(e) => mover(e, i)}
              className={cx(
                'relative flex min-w-0 flex-1 flex-col items-start gap-0.5 px-5 py-4 text-left transition-colors',
                sel ? 'bg-superficie' : 'bg-suave/60 hover:bg-hover',
                'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-acento/45',
              )}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-texto-2">
                <span aria-hidden className="size-2 rounded-full" style={{ background: o.color }} />
                {o.rotulo}
              </span>
              <span className={cx('font-display text-2xl font-medium tracking-[-.02em] tabular-nums', sel ? 'text-tinta' : 'text-texto-2')}>{o.valor}</span>
              {o.contexto && <span className="truncate text-xs text-texto-3">{o.contexto}</span>}
              {sel && <span aria-hidden className="absolute inset-x-5 bottom-0 h-0.5 rounded-full" style={{ background: o.color }} />}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t-${activo}`} className="p-5">
        {children}
      </div>
    </section>
  )
}
