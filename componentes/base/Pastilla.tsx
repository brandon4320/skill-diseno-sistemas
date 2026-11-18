import type { ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx, TONOS, type Tono } from './utilidades'

export type PastillaProps = {
  tono: Tono
  /** Siempre una palabra: el estado nunca va solo por color. */
  children: ReactNode
  /** Punto de 6 px a la izquierda. Se omite si hay ícono. */
  punto?: boolean
  /** Ícono chico en lugar del punto (✓ Aprobado, ↗ +12 %). */
  icono?: Icon
  /** "redonda" para deltas y filtros ("+12,4 %"). */
  forma?: 'normal' | 'redonda'
  className?: string
}

/**
 * Pastilla de estado: fondo al 10 % + texto saturado + punto.
 * verde = hecho/cobrado · ámbar = pendiente/por vencer · rojo = vencido/falló
 * azul = en curso · gris = borrador/anulado. Máximo 2 por fila de tabla.
 */
export function Pastilla({ tono, children, punto = true, icono: Icono, forma = 'normal', className }: PastillaProps) {
  const t = TONOS[tono]
  return (
    <span
      className={cx(
        'inline-flex h-[22px] items-center gap-1.5 px-2 text-xs leading-none font-medium whitespace-nowrap tabular-nums',
        forma === 'redonda' ? 'rounded-full' : 'rounded-chip',
        t.fondo,
        t.texto,
        className,
      )}
    >
      {Icono ? (
        <Icono size={12} weight="bold" aria-hidden className="-ml-0.5 shrink-0" />
      ) : (
        punto && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}
