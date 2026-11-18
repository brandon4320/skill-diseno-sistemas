'use client'

import { useId, type ReactNode } from 'react'
import { CaretDown, type Icon } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { EnvoltorioCampo, cajaCampo, describedBy, type Mensaje } from './_campo'

export type OpcionSelect<V extends string> = { valor: V; texto: string; icono?: Icon; /** Color del punto o del ícono. */ color?: string }

export type SelectConIconoProps<V extends string> = {
  rotulo: ReactNode
  opciones: OpcionSelect<V>[]
  valor: V
  onCambio: (v: V) => void
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

/** Select nativo (teclado y celular gratis) con el ícono o el punto de la opción elegida adentro. */
export function SelectConIcono<V extends string>({ rotulo, opciones, valor, onCambio, opcional, ayuda, mensaje, id: idPropio, className }: SelectConIconoProps<V>) {
  const auto = useId()
  const id = idPropio ?? auto
  const actual = opciones.find((o) => o.valor === valor)
  const Icono = actual?.icono
  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={mensaje} className={cx('w-56 max-sm:w-full', className)}>
      <div data-caja className={cx(cajaCampo(mensaje?.tipo ?? 'neutro'), 'relative')}>
        {Icono ? (
          <Icono size={16} weight="duotone" aria-hidden className="shrink-0" style={{ color: actual?.color ?? 'var(--color-texto-3)' }} />
        ) : actual?.color ? (
          <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: actual.color }} />
        ) : null}
        <select
          id={id}
          value={valor}
          onChange={(e) => onCambio(e.target.value as V)}
          aria-invalid={mensaje?.tipo === 'error' || undefined}
          aria-describedby={describedBy(id, mensaje, ayuda)}
          className="h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-5 text-sm text-tinta outline-none max-sm:text-base"
        >
          {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
        </select>
        <CaretDown size={12} aria-hidden className="pointer-events-none absolute right-3 text-texto-3" />
      </div>
    </EnvoltorioCampo>
  )
}
