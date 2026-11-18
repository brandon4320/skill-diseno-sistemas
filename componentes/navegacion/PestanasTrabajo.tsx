'use client'

import { type KeyboardEvent } from 'react'
import { XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Pestañas de trabajo abiertas (01-navegacion · 16): varias fichas a la vez como pestañas tipo
 * editor de 44 px, con punto de "sin guardar" que se vuelve × al pasar. La nueva entra al final.
 * Cmd/Ctrl+W no se intercepta (es del navegador); Supr o Retroceso cierran la enfocada.
 */
export type FichaAbierta = { id: string; texto: string; icono: Icon; color?: string; sinGuardar?: boolean }

export type PestanasTrabajoProps = {
  fichas: readonly FichaAbierta[]
  activa: string
  onCambio: (id: string) => void
  onCerrar: (id: string) => void
}

export function PestanasTrabajo({ fichas, activa, onCambio, onCerrar }: PestanasTrabajoProps) {
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = fichas.findIndex(f => f.id === activa)
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); onCerrar(activa); return }
    const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: fichas.length - 1 }[e.key]
    if (j === undefined) return
    e.preventDefault()
    const k = (j + fichas.length) % fichas.length
    onCambio(fichas[k].id)
    e.currentTarget.querySelectorAll<HTMLElement>('[role=tab]')[k]?.focus()
  }
  return (
    <div role="tablist" aria-label="Fichas abiertas" onKeyDown={teclas} className="flex h-11 items-end overflow-x-auto border-b border-divisor bg-panel [scrollbar-width:none]">
      {fichas.map(f => {
        const on = f.id === activa
        const I = f.icono
        return (
          <div key={f.id} className={cx('group relative flex h-11 max-w-56 min-w-32 shrink-0 items-center border-r border-divisor', on ? 'bg-superficie' : 'hover:bg-hover')}>
            {on && <span className="absolute inset-x-0 top-0 h-0.5 bg-tinta" aria-hidden />}
            <button
              type="button"
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onCambio(f.id)}
              className={cx('flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 pr-1 pl-3 text-left text-[13px]', on ? 'text-tinta' : 'text-texto-2', FOCO)}
            >
              <I weight="fill" className="size-4 shrink-0" style={f.color ? { color: f.color } : undefined} aria-hidden />
              <span className="truncate">{f.texto}</span>
              {f.sinGuardar && <span className="sr-only"> (sin guardar)</span>}
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onCerrar(f.id)}
              aria-label={`Cerrar ${f.texto}`}
              className="relative mr-1.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta"
            >
              {f.sinGuardar && <span className="absolute size-2 rounded-full bg-tinta group-hover:hidden" aria-hidden />}
              <XIcon className={cx('size-3.5', f.sinGuardar ? 'hidden group-hover:block' : on ? '' : 'opacity-0 group-hover:opacity-100')} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
