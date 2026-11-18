import type { ElementType, ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'

export type KpiLineaProps = {
  /** Qué es, corto: "En negociación". */
  rotulo: string
  /** La cifra ya formateada: "14", "31,6 %". */
  valor: ReactNode
  /** Contexto en la misma línea: "por $ 52,6 M". */
  contexto?: ReactNode
  /** Color de la rayita de 2×10 antes del rótulo (var(--color-dato-n) o color de entidad). */
  color?: string
  href?: string
  enlace?: ElementType
  className?: string
}

/**
 * KPI en una línea (patrón 7.17): cuando los KPIs no son protagonistas. 64 px de alto,
 * rayita de color antes del rótulo y la cifra con su contexto en la misma línea.
 * Van en grilla de 3 a 4; con href toda la tarjeta lleva a la lista filtrada.
 */
export function KpiLinea({ rotulo, valor, contexto, color = 'var(--color-dato-1)', href, enlace: Enlace = 'a', className }: KpiLineaProps) {
  const cuerpo = (
    <>
      <span className="flex items-center gap-2 text-xs font-medium text-texto-2">
        <span aria-hidden className="h-2.5 w-0.5 shrink-0 rounded-full" style={{ background: color }} />
        <span className="truncate">{rotulo}</span>
      </span>
      <span className="flex min-w-0 items-baseline gap-2">
        <b className="font-display text-lg font-medium tracking-[-.02em] text-tinta tabular-nums">{valor}</b>
        {contexto && <span className="truncate text-xs text-texto-3">{contexto}</span>}
      </span>
    </>
  )
  const clase = cx(
    'flex h-16 min-w-0 flex-col justify-center gap-0.5 rounded-interno border border-borde bg-superficie px-4 shadow-min [[data-tema=oscuro]_&]:shadow-none',
    href && 'transition-colors duration-150 hover:border-borde-fuerte hover:bg-hover',
    href && FOCO,
    className,
  )
  return href ? (
    <Enlace href={href} className={clase}>
      {cuerpo}
    </Enlace>
  ) : (
    <div className={clase}>{cuerpo}</div>
  )
}
