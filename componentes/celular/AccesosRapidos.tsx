'use client'

import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Accesos rápidos (SKILL.md §5 Celular): grilla de 3 o 4 tiles iguales justo debajo del
 * protagonista, ícono arriba y una palabra abajo; lo pendiente en una insignia con el número.
 */
export type AccesoRapido = { id: string; texto: string; icono: Icon; pendientes?: number; onClick: () => void }

export function AccesosRapidos({ accesos, etiqueta = 'Accesos rápidos' }: { accesos: readonly AccesoRapido[]; etiqueta?: string }) {
  const lista = accesos.slice(0, 4)
  return (
    <nav aria-label={etiqueta} className={cx('mx-4 grid gap-2', lista.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
      {lista.map(a => (
        <button
          key={a.id}
          type="button"
          onClick={a.onClick}
          aria-label={a.pendientes ? `${a.texto}, ${a.pendientes} pendientes` : a.texto}
          className={cx(
            'relative flex min-h-[76px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-control border border-borde bg-superficie px-1 text-xs font-medium text-tinta',
            'transition-[transform,background-color] duration-150 hover:bg-hover active:scale-[.97] motion-reduce:active:scale-100',
            FOCO,
          )}
        >
          <a.icono size={22} aria-hidden className="text-acento" />
          <span aria-hidden className="truncate">{a.texto}</span>
          {a.pendientes ? (
            <span aria-hidden className="absolute top-1.5 right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ambar-fondo px-1 font-mono text-[11px] font-medium text-ambar-texto tabular-nums">
              {a.pendientes}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  )
}
