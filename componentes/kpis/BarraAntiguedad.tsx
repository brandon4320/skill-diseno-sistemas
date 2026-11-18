'use client'

import type { ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type TramoAntiguedad = {
  id: string
  /** "Al día", "1–30 días", "31–60", "Más de 60". */
  nombre: string
  valor: number
  color: string
  /** Cantidad de comprobantes: "12 facturas". */
  detalle?: ReactNode
}

export type BarraAntiguedadProps = {
  /** "Por cobrar al 18 nov". */
  rotulo: string
  total: ReactNode
  unidad?: string
  tramos: TramoAntiguedad[]
  /** Tramo filtrado (controlado). */
  seleccionado: string | null
  onSeleccionar: (id: string | null) => void
  formato?: (n: number) => string
  /** La lista filtrada de abajo. */
  children?: ReactNode
  className?: string
}

/**
 * Barra por antigüedad (patrones 7.2 y 7.3): lo que se debe partido en tramos. Cada tramo es
 * un botón que filtra la lista de abajo; "Quitar filtro" aparece solo con un tramo elegido.
 */
export function BarraAntiguedad({ rotulo, total, unidad = '$', tramos, seleccionado, onSeleccionar, formato = String, children, className }: BarraAntiguedadProps) {
  const suma = tramos.reduce((a, t) => a + t.valor, 0) || 1
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie p-5 shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-medium text-texto-2">{rotulo}</h3>
          <div className="font-display mt-2 flex items-baseline text-[32px] leading-[1.1] font-medium tracking-[-.03em] text-tinta tabular-nums">
            <span className="mr-1 text-xl font-normal tracking-normal text-texto-3">{unidad}</span>
            {total}
          </div>
        </div>
        {seleccionado && (
          <button type="button" onClick={() => onSeleccionar(null)} className={cx('flex h-8 items-center gap-1.5 rounded-control px-2.5 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
            <XIcon size={14} aria-hidden />
            Quitar filtro
          </button>
        )}
      </div>

      <div role="group" aria-label="Tramos de antigüedad" className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full">
        {tramos.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={seleccionado === t.id}
            aria-label={`${t.nombre}: ${formato(t.valor)}`}
            onClick={() => onSeleccionar(seleccionado === t.id ? null : t.id)}
            className={cx('h-full min-w-1 transition-opacity duration-200', seleccionado && seleccionado !== t.id && 'opacity-30', FOCO)}
            style={{ flexGrow: t.valor / suma, flexBasis: 0, background: t.color }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tramos.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={seleccionado === t.id}
            onClick={() => onSeleccionar(seleccionado === t.id ? null : t.id)}
            className={cx(
              'flex min-w-0 flex-col items-start gap-0.5 rounded-control border px-3 py-2 text-left transition-colors',
              seleccionado === t.id ? 'border-borde-fuerte bg-hover' : 'border-borde hover:bg-hover',
              FOCO,
            )}
          >
            <span className="flex items-center gap-1.5 text-xs text-texto-2">
              <span aria-hidden className="size-2 rounded-full" style={{ background: t.color }} />
              {t.nombre}
            </span>
            <span className="text-sm font-medium text-tinta tabular-nums">{formato(t.valor)}</span>
            {t.detalle && <span className="text-xs text-texto-3">{t.detalle}</span>}
          </button>
        ))}
      </div>

      {children && (
        <div className="mt-4" aria-live="polite">
          {children}
        </div>
      )}
    </section>
  )
}
