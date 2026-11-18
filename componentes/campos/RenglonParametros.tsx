'use client'

import type { ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'

/*
  Renglón de parámetros: la regla se lee como una frase y cada dato es un control chico en línea.
  <RenglonParametros rotulo="Aumento">
    Ajustar por <ParametroSelect … /> cada <ParametroNumero … /> meses, desde <ParametroSelect … />
  </RenglonParametros>
*/

export type RenglonParametrosProps = { rotulo: string; children: ReactNode; /** Lo que resulta: "próximo: 1 mar 2027". */ resultado?: ReactNode; className?: string }

export function RenglonParametros({ rotulo, children, resultado, className }: RenglonParametrosProps) {
  return (
    <div role="group" aria-label={rotulo} className={cx('flex flex-col gap-1.5', className)}>
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm leading-8 text-texto-2">{children}</p>
      {resultado && <p aria-live="polite" className="text-xs text-texto-3">{resultado}</p>}
    </div>
  )
}

const CONTROL =
  'inline-flex h-8 items-center rounded-control border border-borde-fuerte bg-superficie text-sm text-tinta shadow-min outline-none hover:border-texto-3/60 focus:border-acento focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-acento)_18%,transparent)] max-sm:h-11 max-sm:text-base'

export type ParametroNumeroProps = { rotulo: string; valor: number; onCambio: (n: number) => void; min?: number; max?: number; /** Ancho en caracteres. */ largo?: number }

export function ParametroNumero({ rotulo, valor, onCambio, min = 0, max = 9999, largo = 3 }: ParametroNumeroProps) {
  return (
    <input
      aria-label={rotulo}
      inputMode="numeric"
      value={valor}
      onChange={(e) => onCambio(Math.min(max, Math.max(min, Number(e.target.value.replace(/\D/g, '')) || min)))}
      style={{ width: `calc(${largo}ch + 1.25rem)` }}
      className={cx(CONTROL, 'px-2 text-center font-mono tabular-nums')}
    />
  )
}

export type ParametroSelectProps<V extends string> = { rotulo: string; valor: V; onCambio: (v: V) => void; opciones: { valor: V; texto: string }[] }

export function ParametroSelect<V extends string>({ rotulo, valor, onCambio, opciones }: ParametroSelectProps<V>) {
  return (
    <span className="relative inline-flex">
      <select aria-label={rotulo} value={valor} onChange={(e) => onCambio(e.target.value as V)} className={cx(CONTROL, 'cursor-pointer appearance-none pl-2.5 pr-7')}>
        {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
      <CaretDown size={12} aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-texto-3" />
    </span>
  )
}
