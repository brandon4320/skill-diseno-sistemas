'use client'

import type { KeyboardEvent } from 'react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Selector de días (SKILL.md §5 Calendario/Celular): tira de días de 52 × 72 con encastre; hoy con
 * borde de acento y el elegido lleno; puntos de carga debajo del número (máx. 3). La lista de
 * abajo debería cambiar con un fundido de 180 ms (lo hace quien la renderiza).
 */
export type DiaSelector = { id: string; semana: string; numero: number; carga?: number; hoy?: boolean; nombre: string }

export type SelectorDiasProps = { dias: readonly DiaSelector[]; elegido: string; alElegir: (id: string) => void }

export function SelectorDias({ dias, elegido, alElegir }: SelectorDiasProps) {
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = dias.findIndex(d => d.id === elegido)
    const sig = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1
    if (sig < 0 || sig >= dias.length) return
    e.preventDefault()
    alElegir(dias[sig].id)
    ;(e.currentTarget.querySelector(`[data-dia="${dias[sig].id}"]`) as HTMLElement | null)?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Día" onKeyDown={teclas} className="flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
      {dias.map(d => {
        const es = d.id === elegido
        return (
          <button
            key={d.id}
            data-dia={d.id}
            type="button"
            role="radio"
            aria-checked={es}
            aria-label={`${d.nombre}${d.hoy ? ', hoy' : ''}${d.carga ? `, ${d.carga} cargados` : ''}`}
            tabIndex={es ? 0 : -1}
            onClick={() => alElegir(d.id)}
            className={cx(
              'flex h-[72px] w-[52px] shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-0.5 rounded-control border transition-colors duration-150',
              es ? 'border-tinta bg-tinta text-superficie' : d.hoy ? 'border-acento bg-superficie text-tinta' : 'border-borde bg-superficie text-tinta',
              FOCO,
            )}
          >
            <span aria-hidden className={cx('text-[11px] font-medium uppercase', es ? 'opacity-70' : 'text-texto-3')}>{d.semana}</span>
            <span aria-hidden className="font-display text-lg font-semibold tabular-nums">{d.numero}</span>
            <span aria-hidden className="flex h-1.5 gap-0.5">
              {Array.from({ length: Math.min(3, d.carga ?? 0) }, (_, i) => (
                <span key={i} className={cx('size-1 rounded-full', es ? 'bg-superficie' : 'bg-acento')} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
