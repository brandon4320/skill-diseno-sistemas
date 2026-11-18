'use client'

import type { ReactNode } from 'react'
import { CaretDown, type Icon } from '@phosphor-icons/react'
import { Menu, type GrupoMenu } from '../base/Menu'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón dividido: la acción de siempre a la izquierda y sus variantes en el caret de 34 px.
 * Mismo alto, rayita de 1 px entre las mitades, caret que gira 180° al abrir, menú alineado al fin.
 * Las variantes son de la MISMA acción ("Guardar y crear otro", "Guardar como borrador").
 */
export type BotonDivididoProps = {
  children: ReactNode
  icono?: Icon
  variante?: 'principal' | 'secundario'
  onClick: () => void
  /** Variantes de la acción, en grupos (ver base/Menu). */
  opciones: readonly GrupoMenu[]
  /** Nombre del caret para lectores ("Más formas de guardar"). */
  rotuloOpciones: string
  disabled?: boolean
}

export function BotonDividido({ children, icono: Ico, variante = 'principal', onClick, opciones, rotuloOpciones, disabled }: BotonDivididoProps) {
  const principal = variante === 'principal'
  const base = cx(
    'inline-flex h-[38px] cursor-pointer items-center justify-center text-[13px] font-medium whitespace-nowrap',
    'transition-[background-color,transform] duration-150 ease-(--ease) active:scale-[.97] motion-reduce:active:scale-100',
    'disabled:cursor-not-allowed disabled:opacity-45 pointer-coarse:min-h-11',
    principal ? 'bg-tinta text-superficie hover:bg-tinta/90' : 'border border-borde bg-superficie text-tinta hover:bg-hover',
    FOCO,
  )
  return (
    <div className={cx('inline-flex shrink-0 rounded-control', principal ? 'shadow-principal' : 'shadow-min')}>
      <button type="button" onClick={onClick} disabled={disabled} className={cx(base, 'gap-2 rounded-l-control pr-3.5 pl-3')}>
        {Ico && <Ico size={17} aria-hidden />}
        {children}
      </button>
      <Menu
        grupos={opciones}
        alinear="fin"
        disparador={props => (
          <button
            type="button"
            {...props}
            aria-label={rotuloOpciones}
            disabled={disabled}
            className={cx(
              base,
              'group w-[34px] rounded-r-control pointer-coarse:w-11',
              principal ? 'border-l border-superficie/15' : '-ml-px',
            )}
          >
            <CaretDown size={14} aria-hidden className="transition-transform duration-150 group-aria-expanded:rotate-180 motion-reduce:transition-none" />
          </button>
        )}
      />
    </div>
  )
}
