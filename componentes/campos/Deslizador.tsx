'use client'

import { useId, type ReactNode } from 'react'
import { cx } from '../base/utilidades'
import { numeroAR } from './_campo'

export type MarcaDeslizador = { valor: number; texto: string }

export type DeslizadorProps = {
  rotulo: ReactNode
  valor: number
  onCambio: (n: number) => void
  min?: number
  max?: number
  paso?: number
  /** "%", "días". */
  unidad?: string
  /** Puntos con nombre debajo ("Conservador", "Habitual"). */
  marcas?: MarcaDeslizador[]
  /** Lo que resulta del valor: "$ 1.250.000 de descuento". */
  resultado?: ReactNode
  /** Para lectores: "15 por ciento". */
  textoValor?: (n: number) => string
  className?: string
}

/** Deslizador nativo (flechas, Inicio/Fin, RePág) con el número editable al lado y marcas con nombre. */
export function Deslizador({ rotulo, valor, onCambio, min = 0, max = 100, paso = 1, unidad, marcas, resultado, textoValor, className }: DeslizadorProps) {
  const id = useId()
  const pct = ((valor - min) / (max - min)) * 100
  const fijar = (n: number) => onCambio(Math.min(max, Math.max(min, Math.round(n / paso) * paso)))
  return (
    <div className={cx('flex w-[26rem] max-w-full flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-texto-2">{rotulo}</label>
        <span className="flex items-baseline gap-1">
          <input
            aria-label={`${typeof rotulo === 'string' ? rotulo : 'Valor'} (número)`}
            inputMode="decimal"
            value={valor}
            onChange={(e) => fijar(Number(e.target.value.replace(',', '.')) || 0)}
            className="h-7 w-14 rounded-control border border-borde bg-superficie px-1.5 text-right font-mono text-sm tabular-nums text-tinta outline-none focus:border-acento max-sm:h-11 max-sm:text-base"
          />
          {unidad && <span className="text-[13px] text-texto-3">{unidad}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        aria-valuetext={textoValor?.(valor) ?? `${numeroAR(valor, paso < 1 ? 1 : 0)}${unidad ? ` ${unidad}` : ''}`}
        onChange={(e) => onCambio(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--color-acento) ${pct}%, var(--color-divisor) ${pct}%)` }}
        className={cx(
          'h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none max-sm:h-2',
          '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-acento [&::-webkit-slider-thumb]:bg-superficie [&::-webkit-slider-thumb]:shadow-min',
          '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-acento [&::-moz-range-thumb]:bg-superficie',
          'max-sm:[&::-webkit-slider-thumb]:size-6',
          'focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_color-mix(in_oklch,var(--color-acento)_25%,transparent)]',
        )}
      />
      {marcas && (
        <div className="relative h-5" aria-hidden>
          {marcas.map((m) => {
            const p = ((m.valor - min) / (max - min)) * 100
            return (
              <button
                key={m.valor}
                type="button"
                tabIndex={-1}
                onClick={() => fijar(m.valor)}
                style={{ left: `${p}%` }}
                className={cx('absolute -translate-x-1/2 whitespace-nowrap text-xs hover:text-tinta', p === 0 && 'translate-x-0', p === 100 && '-translate-x-full', m.valor === valor ? 'text-tinta' : 'text-texto-3')}
              >
                {m.texto}
              </button>
            )
          })}
        </div>
      )}
      {resultado && <p aria-live="polite" className="text-xs text-texto-3">{resultado}</p>}
    </div>
  )
}
