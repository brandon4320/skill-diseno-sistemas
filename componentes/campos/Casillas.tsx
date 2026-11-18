'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type CasillaProps = {
  rotulo: ReactNode
  /** true, false o 'mixto' (estado intermedio: algunos de los de abajo). */
  marcada: boolean | 'mixto'
  onCambio: (marcada: boolean) => void
  descripcion?: ReactNode
  /** "3 de 5" gris a la derecha. */
  extra?: ReactNode
  disabled?: boolean
  className?: string
}

/** Casilla nativa de 16 px (teclado, lector y formularios gratis) con estado intermedio real. */
export function Casilla({ rotulo, marcada, onCambio, descripcion, extra, disabled, className }: CasillaProps) {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = marcada === 'mixto' }, [marcada])
  return (
    <label htmlFor={id} className={cx('flex min-h-9 cursor-pointer items-start gap-2.5 rounded-control px-2 py-2 hover:bg-hover max-sm:min-h-11', disabled && 'cursor-not-allowed opacity-60', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={marcada === true}
        aria-checked={marcada === 'mixto' ? 'mixed' : marcada}
        disabled={disabled}
        onChange={() => onCambio(marcada !== true)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] accent-(--color-acento) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm text-tinta">{rotulo}</span>
        {descripcion && <span className="text-xs text-texto-3">{descripcion}</span>}
      </span>
      {extra && <span className="shrink-0 font-mono text-xs text-texto-3 tabular-nums">{extra}</span>}
    </label>
  )
}

export type ItemCasilla = { valor: string; texto: ReactNode; descripcion?: ReactNode }

export type CasillasGrupoProps = {
  /** Rótulo de la casilla madre ("Todos los permisos de Facturación"). */
  rotulo: ReactNode
  items: ItemCasilla[]
  valores: string[]
  onCambio: (valores: string[]) => void
  className?: string
}

/** Casilla madre con estado intermedio que marca o desmarca a sus hijas, con el conteo a la vista. */
export function CasillasGrupo({ rotulo, items, valores, onCambio, className }: CasillasGrupoProps) {
  const marcadas = items.filter((i) => valores.includes(i.valor)).length
  const madre = marcadas === 0 ? false : marcadas === items.length ? true : 'mixto'
  return (
    <div role="group" className={cx('flex flex-col', className)}>
      <Casilla
        rotulo={<span className="font-medium">{rotulo}</span>}
        marcada={madre}
        extra={`${marcadas} de ${items.length}`}
        onCambio={(m) => onCambio(m ? Array.from(new Set([...valores, ...items.map((i) => i.valor)])) : valores.filter((v) => !items.some((i) => i.valor === v)))}
      />
      <div className="ml-4 flex flex-col border-l border-divisor pl-3">
        {items.map((i) => (
          <Casilla
            key={i.valor}
            rotulo={i.texto}
            descripcion={i.descripcion}
            marcada={valores.includes(i.valor)}
            onCambio={(m) => onCambio(m ? [...valores, i.valor] : valores.filter((v) => v !== i.valor))}
          />
        ))}
      </div>
    </div>
  )
}
