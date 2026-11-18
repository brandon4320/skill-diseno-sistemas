'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { DIAS_CORTOS, diaSemana, fechaLarga, numeroDia, sumarDias, type Dia } from './tiempo'

export type SelectorDiasProps = {
  valor: Dia
  onElegir: (d: Dia) => void
  /** Del server. */
  hoy: Dia
  /** Primer día de la tira y cuántos mostrar (14 por defecto, scrollea de costado). */
  desde: Dia
  cantidad?: number
  /** Cuántos eventos tiene cada día: un punto debajo si hay alguno. */
  ocupacion?: Record<Dia, number>
  className?: string
}

/**
 * Selector de días de celular (patrón 8.13): tira horizontal con scroll-snap, botones de 44 px,
 * el elegido en tinta y hoy marcado con punto de acento. Flechas izquierda/derecha mueven el día.
 */
export function SelectorDias({ valor, onElegir, hoy, desde, cantidad = 14, ocupacion, className }: SelectorDiasProps) {
  const tira = useRef<HTMLDivElement>(null)
  const dias = Array.from({ length: cantidad }, (_, i) => sumarDias(desde, i))
  useEffect(() => {
    tira.current?.querySelector<HTMLElement>(`[data-dia="${valor}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [valor])
  const tecla = (ev: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const sig = ev.key === 'ArrowRight' ? i + 1 : ev.key === 'ArrowLeft' ? i - 1 : null
    const d = sig != null ? dias[sig] : undefined
    if (!d) return
    ev.preventDefault()
    onElegir(d)
    tira.current?.querySelector<HTMLButtonElement>(`[data-dia="${d}"]`)?.focus()
  }
  return (
    <div ref={tira} role="tablist" aria-label="Elegir día" className={cx('flex snap-x gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none]', className)}>
      {dias.map((d, i) => {
        const sel = d === valor
        const esHoy = d === hoy
        return (
          <button
            key={d}
            type="button"
            role="tab"
            data-dia={d}
            aria-selected={sel}
            tabIndex={sel ? 0 : -1}
            aria-label={`${fechaLarga(d)}${esHoy ? ', hoy' : ''}${ocupacion?.[d] ? `, ${ocupacion[d]} eventos` : ''}`}
            onClick={() => onElegir(d)}
            onKeyDown={ev => tecla(ev, i)}
            className={cx(
              'relative flex h-16 w-11 flex-none snap-center flex-col items-center justify-center gap-0.5 rounded-control transition-colors duration-150',
              FOCO,
              sel ? 'bg-tinta text-superficie' : 'text-tinta hover:bg-suave',
            )}
          >
            <span className={cx('text-[11px] capitalize', sel ? 'text-superficie/80' : 'text-texto-3')}>{DIAS_CORTOS[diaSemana(d)]}</span>
            <span className="text-base font-medium tabular-nums">{numeroDia(d)}</span>
            <span aria-hidden className={cx('size-1 rounded-full', esHoy ? (sel ? 'bg-superficie' : 'bg-acento') : ocupacion?.[d] ? (sel ? 'bg-superficie/60' : 'bg-texto-3') : 'bg-transparent')} />
          </button>
        )
      })}
    </div>
  )
}
