import { useId, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type MetaProyeccionProps = {
  rotulo: string
  /** Lo logrado hasta hoy. */
  logrado: number
  /** Proyección a fin de período (ritmo de días hábiles × días hábiles del mes). */
  proyeccion: number
  meta: number
  formato?: (n: number) => string
  /** "Llega con 4 % de margen" o "Faltan $ 1,2 M por día hábil". Una oración. */
  conclusion?: ReactNode
  color?: string
  className?: string
}

/**
 * Meta con proyección (§1b.6, patrones 7.7 y 7.8): logrado sólido, proyección rayada,
 * meta como línea punteada con su rótulo y la marca de hoy. Abajo, si llega y cuánto falta.
 */
export function MetaProyeccion({ rotulo, logrado, proyeccion, meta, formato = String, conclusion, color = 'var(--color-acento)', className }: MetaProyeccionProps) {
  const tope = Math.max(meta, proyeccion, logrado) * 1.08 || 1
  const pct = (n: number) => `${Math.min(100, (n / tope) * 100)}%`
  const llega = proyeccion >= meta
  const idRayado = `rayado${useId().replace(/:/g, '')}`

  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie p-5 shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <h3 className="text-xs font-medium text-texto-2">{rotulo}</h3>
      <div className="font-display mt-2 text-[32px] leading-[1.1] font-medium tracking-[-.03em] text-tinta tabular-nums">{formato(logrado)}</div>
      <div className="text-xs text-texto-3">
        Proyección <b className="font-medium text-texto-2">{formato(proyeccion)}</b> · meta {formato(meta)}
      </div>

      <div
        className="relative mt-8 h-4"
        role="img"
        aria-label={`Logrado ${formato(logrado)}, proyección ${formato(proyeccion)}, meta ${formato(meta)}`}
      >
        <div className="absolute inset-0 rounded-full bg-suave" />
        <svg className="absolute inset-y-0 left-0 h-full" style={{ width: pct(proyeccion) }} preserveAspectRatio="none" aria-hidden>
          <defs>
            <pattern id={idRayado} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="2.5" height="6" fill={color} opacity=".45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" rx="8" fill={`url(#${idRayado})`} />
        </svg>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: pct(logrado), background: color }} />
        <div className="absolute -top-2 -bottom-2 w-px bg-tinta/70" style={{ left: pct(logrado) }} aria-hidden>
          <span className="absolute top-full mt-0.5 -translate-x-1/2 font-mono text-[11px] text-texto-3">Hoy</span>
        </div>
        <div className="absolute -top-6 -bottom-2 border-l border-dashed border-texto-2" style={{ left: pct(meta) }} aria-hidden>
          <span className="absolute -top-0.5 left-1 font-mono text-[11px] whitespace-nowrap text-texto-2">Meta</span>
        </div>
      </div>

      {conclusion && (
        <p className={cx('mt-7 text-[13px]', llega ? 'text-verde-texto' : 'text-ambar-texto')} aria-live="polite">
          {conclusion}
        </p>
      )}
    </section>
  )
}
