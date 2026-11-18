import { useId, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type ComparativoProps = {
  /** "Noviembre al día 18". */
  actualRotulo: string
  actual: number
  /** "Octubre al día 18". Por defecto se compara al mismo día: el mes completo engaña. */
  anteriorRotulo: string
  anterior: number
  formato?: (n: number) => string
  /** Arriba: el selector de métrica y de base (Segmentado), si hace falta. */
  controles?: ReactNode
  /** <Variacion/> ya armada con el delta. */
  variacion?: ReactNode
  color?: string
  className?: string
}

/**
 * Comparativo con el mes anterior (patrones 7.7 y 7.13): dos barras horizontales, el período
 * en curso en acento y el anterior rayado, con la cifra y el delta arriba.
 */
export function Comparativo({ actualRotulo, actual, anteriorRotulo, anterior, formato = String, controles, variacion, color = 'var(--color-acento)', className }: ComparativoProps) {
  const tope = Math.max(actual, anterior) || 1
  const id = `cmp${useId().replace(/:/g, '')}`
  const filas = [
    { rotulo: actualRotulo, valor: actual, rayado: false },
    { rotulo: anteriorRotulo, valor: anterior, rayado: true },
  ]
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie p-5 shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      {controles && <div className="flex flex-wrap items-center justify-between gap-2">{controles}</div>}
      <div className={cx('flex flex-wrap items-baseline gap-3', controles != null && 'mt-6')}>
        <span className="font-display text-[32px] leading-[1.1] font-medium tracking-[-.03em] text-tinta tabular-nums">{formato(actual)}</span>
        {variacion}
      </div>
      <p className="text-xs text-texto-3">
        {actualRotulo} contra {anteriorRotulo.charAt(0).toLowerCase() + anteriorRotulo.slice(1)}
      </p>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2.5" height="6" fill="var(--color-texto-3)" opacity=".55" />
          </pattern>
        </defs>
      </svg>
      <dl className="mt-5 flex flex-col gap-3">
        {filas.map((f) => (
          <div key={f.rotulo} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
            <dt className="truncate text-xs text-texto-2">{f.rotulo}</dt>
            <dd className="text-xs font-medium text-tinta tabular-nums">{formato(f.valor)}</dd>
            <dd className="col-span-2 h-2.5 overflow-hidden rounded-full bg-suave" aria-hidden>
              <svg className="h-full" style={{ width: `${(f.valor / tope) * 100}%` }} preserveAspectRatio="none">
                <rect width="100%" height="100%" rx="5" fill={f.rayado ? `url(#${id})` : color} />
              </svg>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
