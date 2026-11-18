'use client'

import { ArrowUpIcon, CircleNotchIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Cargar más (01-navegacion · 19): para historial y actividad. "Mostrando 10 de 46" con un botón que
 * dice cuántas trae, ancho fijo mientras carga y al final "Son todas". Con scroll infinito, poné
 * esqueletos en el lugar y usá `onVolverArriba`.
 */
export type CargarMasProps = {
  mostrando: number
  total: number
  /** Cuántas trae cada tanda. */
  tanda?: number
  cargando?: boolean
  onCargar: () => void
  onVolverArriba?: () => void
  /** "movimientos", "avisos". */
  unidad?: string
}

export function CargarMas({ mostrando, total, tanda = 10, cargando, onCargar, onVolverArriba, unidad = '' }: CargarMasProps) {
  const resto = Math.max(0, total - mostrando)
  const trae = Math.min(tanda, resto)
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-3 text-xs text-texto-3">
      <span className="font-mono tabular-nums" aria-live="polite">
        {resto === 0 ? `Son todas · ${total}` : `Mostrando ${mostrando} de ${total}${unidad ? ' ' + unidad : ''}`}
      </span>
      {resto > 0 && (
        <button type="button" onClick={onCargar} disabled={cargando} aria-busy={cargando || undefined} className={cx('inline-flex h-8 min-w-36 cursor-pointer items-center justify-center gap-1.5 rounded-control border border-borde bg-superficie px-3 text-[13px] font-medium text-tinta shadow-min hover:shadow-hover disabled:cursor-wait', FOCO)}>
          {cargando ? <><CircleNotchIcon className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />Cargando</> : `Ver ${trae} más`}
        </button>
      )}
      {onVolverArriba && (
        <button type="button" onClick={onVolverArriba} className={cx('inline-flex cursor-pointer items-center gap-1 rounded-control px-2 py-1 hover:bg-hover hover:text-tinta', FOCO)}>
          <ArrowUpIcon className="size-3.5" aria-hidden />Volver arriba
        </button>
      )}
    </div>
  )
}
