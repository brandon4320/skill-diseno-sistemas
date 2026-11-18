'use client'

import type { ReactNode } from 'react'
import { Avatar, type Persona, type TamanoAvatar } from './Avatar'
import { Tooltip } from './Tooltip'
import { cx } from './utilidades'

export type PilaAvataresProps = {
  personas: readonly Persona[]
  /** Cuántas caras se ven antes del "+N". */
  max?: number
  tamano?: Extract<TamanoAvatar, 'xs' | 'sm' | 'md' | 'lg'>
  /** Texto gris a la derecha: "3 activas hoy". */
  texto?: ReactNode
  /** Qué grupo es, para el lector de pantalla. */
  rotulo?: string
  className?: string
}

const SOLAPE: Record<NonNullable<PilaAvataresProps['tamano']>, { margen: string; resto: string }> = {
  xs: { margen: '-ml-1.5', resto: 'size-5 text-xs' },
  sm: { margen: '-ml-2', resto: 'size-[26px] text-xs' },
  md: { margen: '-ml-2.5', resto: 'size-8 text-xs' },
  lg: { margen: '-ml-3', resto: 'size-10 text-xs' },
}

/**
 * Pila de avatares superpuestos con borde del color de la superficie.
 * Al pasar el mouse cada cara sube un poco y muestra el nombre; el "+N" lista el resto.
 */
export function PilaAvatares({ personas, max = 4, tamano = 'sm', texto, rotulo = 'Participantes', className }: PilaAvataresProps) {
  const visibles = personas.slice(0, max)
  const ocultas = personas.slice(max)
  const s = SOLAPE[tamano]
  const nombres = personas.map((p) => p.nombre).join(', ')

  return (
    <div className={cx('flex items-center gap-2', className)}>
      <ul role="list" aria-label={`${rotulo}: ${nombres}`} className="flex items-center">
        {visibles.map((p, i) => (
          <li
            key={p.id}
            className={cx(
              'relative transition-transform duration-200 ease-(--ease) hover:z-10 hover:-translate-y-0.5 motion-reduce:transition-none',
              i > 0 && s.margen,
            )}
          >
            <Tooltip texto={p.nombre} describir={false} retardo={200}>
              <span>
                <Avatar persona={p} tamano={tamano} anillo decorativo />
              </span>
            </Tooltip>
          </li>
        ))}
        {ocultas.length > 0 && (
          <li className={cx('relative', s.margen)}>
            <Tooltip texto={ocultas.map((p) => p.nombre).join(', ')} describir={false} retardo={200}>
              <span
                aria-hidden
                className={cx(
                  'inline-grid place-items-center rounded-full bg-suave font-medium text-texto-2 tabular-nums ring-[2.5px] ring-superficie',
                  s.resto,
                )}
              >
                +{ocultas.length}
              </span>
            </Tooltip>
          </li>
        )}
      </ul>
      {texto && <span className="text-[13px] text-texto-2 tabular-nums">{texto}</span>}
    </div>
  )
}
