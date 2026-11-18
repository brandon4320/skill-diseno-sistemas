'use client'

import { useId, type ComponentProps, type ReactNode, type Ref } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { EnvoltorioCampo, INPUT, cajaCampo, describedBy, type EstadoCampo, type Mensaje } from './_campo'

export type AnchoCampo = 'xs' | 's' | 'm' | 'l' | 'completo'
export const ANCHOS: Record<AnchoCampo, string> = {
  xs: 'w-24', s: 'w-44 max-sm:w-full', m: 'w-72 max-sm:w-full', l: 'w-[28rem] max-w-full', completo: 'w-full',
}

export type CampoTextoProps = Omit<ComponentProps<'input'>, 'prefix' | 'size' | 'ref'> & {
  rotulo: ReactNode
  opcional?: boolean
  /** Qué pasa con el dato, no cómo escribirlo. */
  ayuda?: ReactNode
  /** Error (frena), aviso (no frena) u ok; puede traer la corrección como botón. */
  mensaje?: Mensaje | null
  icono?: Icon
  prefijo?: ReactNode
  /** Unidad, atajo o botón chico a la derecha. */
  sufijo?: ReactNode
  /** Montos y códigos: cifras tabulares. */
  numerico?: boolean
  /** El ancho dice cuánto se espera escribir. */
  ancho?: AnchoCampo
  extraRotulo?: ReactNode
  ref?: Ref<HTMLInputElement>
}

/** Campo con rótulo arriba, ayuda o mensaje abajo, y la caja con ícono, prefijo y sufijo. */
export function CampoTexto({
  rotulo, opcional, ayuda, mensaje, icono: Icono, prefijo, sufijo, numerico, ancho = 'm', extraRotulo,
  id: idPropio, className, ref, ...input
}: CampoTextoProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const estado: EstadoCampo = mensaje?.tipo ?? 'neutro'
  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={mensaje} extraRotulo={extraRotulo} className={cx(ANCHOS[ancho], className)}>
      <div data-caja className={cajaCampo(estado, input.disabled && 'bg-suave opacity-70 shadow-none')}>
        {Icono && <Icono size={16} aria-hidden className="shrink-0 text-texto-3" />}
        {prefijo != null && <span className="shrink-0 text-[13px] text-texto-3 select-none">{prefijo}</span>}
        <input
          {...input}
          ref={ref}
          id={id}
          aria-invalid={estado === 'error' || undefined}
          aria-describedby={describedBy(id, mensaje, ayuda)}
          className={cx(INPUT, numerico && 'font-mono tabular-nums')}
        />
        {sufijo != null && <span className="flex shrink-0 items-center text-[13px] text-texto-3">{sufijo}</span>}
      </div>
    </EnvoltorioCampo>
  )
}
