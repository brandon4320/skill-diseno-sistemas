'use client'

import type { ReactNode } from 'react'
import { ArrowLeft, DotsThree, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Cabecera del celular (SKILL.md §5 y §1). Dos formas:
 * - Inicio: saludo gris chico y fecha en tinta a la izquierda; máximo dos botones circulares de 44.
 * - Detalle: flecha, título centrado y ⋯. Con `compacta` (el título grande ya salió de pantalla)
 *   el título aparece en la barra con un fundido.
 */
export type BotonCabecera = { id: string; etiqueta: string; icono: Icon; onClick: () => void; punto?: boolean }

const CIRCULO = cx(
  'relative grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-borde bg-superficie text-tinta transition-colors hover:bg-hover',
  FOCO,
)

export function CabeceraSaludo({ saludo, fecha, botones = [] }: { saludo: string; fecha: ReactNode; botones?: readonly BotonCabecera[] }) {
  return (
    <header className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),16px)] pb-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-texto-3">{saludo}</p>
        <h1 className="truncate font-display text-xl font-semibold text-tinta">{fecha}</h1>
      </div>
      {botones.slice(0, 2).map(b => (
        <button key={b.id} type="button" aria-label={b.etiqueta} onClick={b.onClick} className={CIRCULO}>
          <b.icono size={20} aria-hidden />
          {b.punto && <span aria-hidden className="absolute top-2.5 right-2.5 size-2 rounded-full bg-acento ring-2 ring-superficie" />}
        </button>
      ))}
    </header>
  )
}

export type CabeceraDetalleProps = {
  titulo: string
  alVolver: () => void
  alMas?: () => void
  /** true cuando el título grande del contenido ya no se ve. */
  compacta?: boolean
}

export function CabeceraDetalle({ titulo, alVolver, alMas, compacta }: CabeceraDetalleProps) {
  return (
    <header
      className={cx(
        'sticky top-0 z-20 grid grid-cols-[44px_1fr_44px] items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),8px)] pb-2 transition-[background-color,box-shadow] duration-200',
        compacta ? 'bg-superficie/90 shadow-[0_1px_0_var(--color-divisor)] backdrop-blur' : 'bg-transparent',
      )}
    >
      <button type="button" aria-label="Volver" onClick={alVolver} className={CIRCULO}>
        <ArrowLeft size={20} aria-hidden />
      </button>
      <p
        aria-hidden={!compacta}
        className={cx('truncate text-center text-[15px] font-semibold text-tinta transition-opacity duration-200', compacta ? 'opacity-100' : 'opacity-0')}
      >
        {titulo}
      </p>
      {alMas ? (
        <button type="button" aria-label="Más acciones" aria-haspopup="dialog" onClick={alMas} className={CIRCULO}>
          <DotsThree size={22} weight="bold" aria-hidden />
        </button>
      ) : <span />}
    </header>
  )
}
