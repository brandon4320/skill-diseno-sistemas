'use client'

import type { ReactNode } from 'react'
import { Check, X } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Tabla en tarjetas (SKILL.md §6e): misma información, otra forma. Nombre y monto arriba, fecha y
 * estado abajo, casilla con área de 44, sin encabezado. Al elegir, la barra oscura reemplaza a la
 * píldora con cantidad y total, y la acción del lote.
 */
export type FilaTarjeta = { id: string; nombre: string; monto: ReactNode; fecha: ReactNode; estado: ReactNode }

export type TarjetasCelProps = {
  filas: readonly FilaTarjeta[]
  elegidas: ReadonlySet<string>
  alElegir: (id: string, si: boolean) => void
  etiqueta: string
}

export function TarjetasCel({ filas, elegidas, alElegir, etiqueta }: TarjetasCelProps) {
  return (
    <ul aria-label={etiqueta} className="flex flex-col gap-2 px-4">
      {filas.map(f => {
        const si = elegidas.has(f.id)
        return (
          <li key={f.id} className={cx('flex items-center gap-1 rounded-tarjeta border bg-superficie py-2 pr-3 pl-1 transition-colors', si ? 'border-acento' : 'border-borde')}>
            <button
              type="button"
              role="checkbox"
              aria-checked={si}
              aria-label={`Elegir ${f.nombre}`}
              onClick={() => alElegir(f.id, !si)}
              className={cx('grid size-11 shrink-0 cursor-pointer place-items-center rounded-full', FOCO)}
            >
              <span aria-hidden className={cx('grid size-5 place-items-center rounded-[6px] border-2', si ? 'border-acento bg-acento text-superficie' : 'border-borde-fuerte text-transparent')}>
                <Check size={12} weight="bold" />
              </span>
            </button>
            <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto] gap-x-3 gap-y-0.5">
              <b className="truncate text-sm font-medium text-tinta">{f.nombre}</b>
              <b className="text-right font-mono text-sm font-medium text-tinta tabular-nums">{f.monto}</b>
              <span className="truncate text-xs text-texto-3">{f.fecha}</span>
              <span className="text-right text-xs">{f.estado}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export type BarraSeleccionProps = {
  cantidad: number
  total: ReactNode
  accion: string
  alAccion: () => void
  alLimpiar: () => void
}

/** Barra oscura que reemplaza a la píldora mientras haya elegidas. */
export function BarraSeleccion({ cantidad, total, accion, alAccion, alLimpiar }: BarraSeleccionProps) {
  if (cantidad === 0) return null
  return (
    <div role="region" aria-label="Selección" className="fixed inset-x-4 bottom-4 z-30 mb-[env(safe-area-inset-bottom)] flex h-14 items-center gap-2 rounded-full bg-tinta pr-1.5 pl-1.5 text-superficie shadow-flotante">
      <button type="button" aria-label="Quitar selección" onClick={alLimpiar} className={cx('grid size-11 cursor-pointer place-items-center rounded-full', FOCO)}>
        <X size={18} aria-hidden />
      </button>
      <p aria-live="polite" className="min-w-0 flex-1 truncate text-sm">
        <b className="font-medium">{cantidad}</b> elegidas · <span className="font-mono tabular-nums">{total}</span>
      </p>
      <button type="button" onClick={alAccion} className={cx('h-11 shrink-0 cursor-pointer rounded-full bg-superficie px-4 text-sm font-medium text-tinta', FOCO)}>
        {accion}
      </button>
    </div>
  )
}
