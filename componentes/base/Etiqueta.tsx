'use client'

import type { ReactNode } from 'react'
import { X, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from './utilidades'

export type EtiquetaProps = {
  children: ReactNode
  /** Color de la entidad (cliente, proyecto): se ve como un puntito, nunca pinta la etiqueta. */
  color?: string
  icono?: Icon
  /** Si viene, muestra una × para sacar la etiqueta. */
  onQuitar?: () => void
  className?: string
}

/**
 * Etiqueta descriptiva (rubro, tipo, "Branding"): borde de 1 px, texto gris, sin relleno.
 * No es un estado: para estados va Pastilla.
 */
export function Etiqueta({ children, color, icono: Icono, onQuitar, className }: EtiquetaProps) {
  return (
    <span
      className={cx(
        'inline-flex h-[22px] max-w-full items-center gap-1.5 rounded-chip border border-borde bg-superficie px-2',
        'text-xs leading-none font-medium whitespace-nowrap text-texto-2',
        onQuitar && 'pr-0.5',
        className,
      )}
    >
      {color && <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: color }} />}
      {Icono && <Icono size={12} aria-hidden className="shrink-0 text-texto-3" />}
      <span className="truncate leading-[18px]">{children}</span>
      {onQuitar && (
        <button
          type="button"
          onClick={onQuitar}
          aria-label={`Quitar ${typeof children === 'string' ? children : 'etiqueta'}`}
          className={cx(
            'grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-[5px] text-texto-3',
            'transition-colors hover:bg-suave hover:text-tinta',
            FOCO,
          )}
        >
          <X size={11} weight="bold" aria-hidden />
        </button>
      )}
    </span>
  )
}

export type EtiquetaFiltroProps = {
  children: ReactNode
  activa: boolean
  onCambio: (activa: boolean) => void
  conteo?: number
  color?: string
  className?: string
}

/** Filtro redondo (calendario, listas): el activo va en tinta, como en la referencia 02. */
export function EtiquetaFiltro({ children, activa, onCambio, conteo, color, className }: EtiquetaFiltroProps) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={() => onCambio(!activa)}
      className={cx(
        'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap',
        'transition-[background-color,color,border-color,transform] duration-150 ease-(--ease) active:scale-[.97]',
        'pointer-coarse:h-9 motion-reduce:transition-none',
        activa
          ? 'border-tinta bg-tinta text-superficie'
          : 'border-borde bg-superficie text-texto-2 shadow-min hover:bg-hover hover:text-tinta',
        FOCO,
        className,
      )}
    >
      {color && <span aria-hidden className="size-1.5 rounded-full" style={{ background: color }} />}
      {children}
      {conteo != null && <span className={cx('font-medium tabular-nums', activa ? 'opacity-60' : 'text-texto-3')}>{conteo}</span>}
    </button>
  )
}
