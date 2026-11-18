'use client'

import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

/**
 * Acciones rápidas de una fila (SKILL.md §5 Acciones, patrón 1.14).
 * Aparecen con hover Y con foco de teclado (:focus-within), superpuestas a la derecha sobre un
 * degradé del fondo de la fila; en pantallas táctiles están siempre, en su propio renglón.
 * La fila tiene que llevar la clase `group/fila` y `relative` (o usar <FilaConAcciones>).
 * Máximo 2 rellenos chicos (solo la decisión pendiente: Cobrar, Aprobar); el resto de ícono + ⋯.
 */
export function AccionesFila({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        'flex items-center gap-1',
        // escritorio con mouse: superpuestas, con degradé del fondo de la fila
        'pointer-fine:absolute pointer-fine:top-1/2 pointer-fine:right-4 pointer-fine:-translate-y-1/2 pointer-fine:pl-10',
        'pointer-fine:bg-linear-to-r pointer-fine:from-transparent pointer-fine:via-hover pointer-fine:via-40% pointer-fine:to-hover',
        'pointer-fine:pointer-events-none pointer-fine:opacity-0 pointer-fine:transition-opacity pointer-fine:duration-150',
        'pointer-fine:group-hover/fila:pointer-events-auto pointer-fine:group-hover/fila:opacity-100',
        'pointer-fine:group-focus-within/fila:pointer-events-auto pointer-fine:group-focus-within/fila:opacity-100',
        // táctil: siempre visibles, renglón propio alineado a la derecha
        'pointer-coarse:w-full pointer-coarse:justify-end',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Fila de lista con lugar para <AccionesFila>: hover un escalón de luz, éxito en verde tenue. */
export function FilaConAcciones({ children, exito, className }: { children: ReactNode; exito?: boolean; className?: string }) {
  return (
    <div
      className={cx(
        'group/fila relative flex min-h-14 flex-wrap items-center gap-3 border-t border-divisor px-4 py-2 first:border-t-0 sm:flex-nowrap sm:pl-5',
        'transition-colors duration-300 ease-(--ease) hover:bg-hover',
        exito && 'bg-verde-fondo/70 hover:bg-verde-fondo/70',
        className,
      )}
    >
      {children}
    </div>
  )
}
