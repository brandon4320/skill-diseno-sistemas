'use client'

import type { Icon } from '@phosphor-icons/react'
import { Tooltip } from '../base/Tooltip'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón que queda prendido (aria-pressed): fondo suave e ícono relleno. El texto pasa al ESTADO
 * ("Seguir" → "Siguiendo"), nunca a la orden contraria. Solo ícono: el nombre no cambia y el
 * estado lo anuncia aria-pressed; el tooltip muestra el nombre.
 */
export type BotonConmutableProps = {
  activo: boolean
  onCambio: (activo: boolean) => void
  icono: Icon
  /** Texto apagado ("Seguir"). Si falta, es solo ícono y `aria-label` es obligatorio. */
  texto?: string
  /** Texto prendido ("Siguiendo"). */
  textoActivo?: string
  'aria-label'?: string
  tamano?: 'normal' | 'chico'
}

export function BotonConmutable({ activo, onCambio, icono: Ico, texto, textoActivo, tamano = 'normal', ...a11y }: BotonConmutableProps) {
  const chico = tamano === 'chico'
  const soloIcono = !texto
  const b = (
    <button
      type="button"
      aria-pressed={activo}
      aria-label={a11y['aria-label']}
      onClick={() => onCambio(!activo)}
      className={cx(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border font-medium whitespace-nowrap',
        'transition-[background-color,color,transform] duration-150 ease-(--ease) active:scale-[.97] motion-reduce:active:scale-100',
        activo ? 'border-borde bg-suave text-tinta' : 'border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
        chico ? 'h-7 rounded-chip text-xs' : 'h-[38px] rounded-control text-[13px]',
        soloIcono ? (chico ? 'w-7' : 'w-[38px]') : chico ? 'px-2.5' : 'pr-3.5 pl-3',
        'pointer-coarse:min-h-11 pointer-coarse:min-w-11',
        FOCO,
      )}
    >
      <Ico
        size={chico ? 14 : 17}
        weight={activo ? 'fill' : 'regular'}
        aria-hidden
        className={cx('transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none', activo && 'scale-100', activo && 'text-ambar-texto')}
      />
      {!soloIcono && <span>{activo ? textoActivo ?? texto : texto}</span>}
    </button>
  )
  return soloIcono && a11y['aria-label'] ? <Tooltip texto={a11y['aria-label']} describir={false}>{b}</Tooltip> : b
}
