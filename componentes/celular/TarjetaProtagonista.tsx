import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

/**
 * Un solo protagonista por pantalla (SKILL.md §5 Celular). Nunca dos en la misma pantalla.
 * - TarjetaAnillo: frase que dice cuánto falta + anillo de 88 con el porcentaje.
 * - TarjetaMonto: monto de 34 con moneda y centavos en gris y la variación debajo.
 * Server Component: sin estado.
 */
export type TarjetaAnilloProps = {
  rotulo: string
  /** "Te faltan $ 182.000 para la meta". */
  frase: ReactNode
  pct: number
  detalle?: ReactNode
}

export function TarjetaAnillo({ rotulo, frase, pct, detalle }: TarjetaAnilloProps) {
  const p = Math.max(0, Math.min(100, Math.round(pct)))
  const r = 38
  const largo = 2 * Math.PI * r
  return (
    <section aria-label={rotulo} className="mx-4 flex items-center gap-4 rounded-tarjeta border border-borde bg-superficie p-5 shadow-min">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-texto-3">{rotulo}</p>
        <p className="mt-1 font-display text-lg leading-snug font-semibold text-tinta text-balance">{frase}</p>
        {detalle && <p className="mt-2 text-sm text-texto-2">{detalle}</p>}
      </div>
      <div className="relative size-[88px] shrink-0" role="img" aria-label={`${p} % cumplido`}>
        <svg viewBox="0 0 88 88" className="size-full -rotate-90" aria-hidden>
          <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" className="stroke-suave" />
          <circle
            cx="44" cy="44" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={largo} strokeDashoffset={largo * (1 - p / 100)}
            className="stroke-acento transition-[stroke-dashoffset] duration-700 ease-(--ease) motion-reduce:transition-none"
          />
        </svg>
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-xl font-semibold text-tinta tabular-nums">
          {p}<small className="text-xs text-texto-3">%</small>
        </span>
      </div>
    </section>
  )
}

export type TarjetaMontoProps = {
  rotulo: string
  /** Moneda: "$" o "US$". */
  moneda?: string
  entero: string
  centavos?: string
  /** Variación ya formateada: "+12 % vs. noviembre". */
  variacion?: string
  sube?: boolean
}

export function TarjetaMonto({ rotulo, moneda = '$', entero, centavos, variacion, sube }: TarjetaMontoProps) {
  return (
    <section aria-label={rotulo} className="mx-4 rounded-tarjeta border border-borde bg-superficie p-5 shadow-min">
      <p className="text-xs font-medium text-texto-3">{rotulo}</p>
      <p className="mt-1 font-display text-[34px] leading-tight font-semibold text-tinta tabular-nums">
        <span className="mr-1 text-xl text-texto-3">{moneda}</span>{entero}
        {centavos && <span className="text-xl text-texto-3">,{centavos}</span>}
      </p>
      {variacion && (
        <p className={cx('mt-1 text-sm font-medium', sube === undefined ? 'text-texto-2' : sube ? 'text-verde-texto' : 'text-rojo-texto')}>
          {variacion}
        </p>
      )}
    </section>
  )
}
