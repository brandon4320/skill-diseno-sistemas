import type { ElementType, ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'

export type FilaRanking = { id: string; nombre: string; valor: number; detalle?: ReactNode; href?: string }

export type KpiRankingProps = {
  rotulo: string
  /** La cifra del primero ya formateada. */
  valor: ReactNode
  sufijo?: string
  /** "Orbe Retail lidera el año". */
  contexto?: ReactNode
  filas: FilaRanking[]
  /** Cuántos se muestran: top 6 por defecto. */
  top?: number
  formato?: (n: number) => string
  /** A la derecha del rótulo: un Segmentado "Clientes | Equipo". */
  accion?: ReactNode
  enlace?: ElementType
  className?: string
}

/**
 * KPI con ranking (ref. 14): la cifra es la del primero y debajo el top numerado en mono,
 * el líder en acento y el resto en gris. Cada fila con href lleva a su ficha.
 */
export function KpiRanking({ rotulo, valor, sufijo, contexto, filas, top = 6, formato = String, accion, enlace: Enlace = 'a', className }: KpiRankingProps) {
  const lista = [...filas].sort((a, b) => b.valor - a.valor).slice(0, top)
  const max = lista[0]?.valor || 1
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie p-5 shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-xs font-medium text-texto-2">{rotulo}</h3>
        {accion}
      </div>
      <div className="font-display mt-3 flex items-baseline text-[32px] leading-[1.1] font-medium tracking-[-.03em] text-tinta tabular-nums">
        {valor}
        {sufijo && <span className="ml-1 text-xl font-normal tracking-normal text-texto-3">{sufijo}</span>}
      </div>
      {contexto && <p className="text-xs text-texto-3">{contexto}</p>}
      <ol className="mt-4 flex flex-col">
        {lista.map((f, i) => {
          const cuerpo = (
            <>
              <span className="w-5 font-mono text-[11px] text-texto-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cx('truncate text-[13px]', i === 0 ? 'font-medium text-tinta' : 'text-texto-2')}>{f.nombre}</span>
                  <span className="shrink-0 text-xs text-texto-2 tabular-nums">{f.detalle ?? formato(f.valor)}</span>
                </span>
                <span className="h-1 overflow-hidden rounded-full bg-suave" aria-hidden>
                  <span className={cx('block h-full rounded-full', i === 0 ? 'bg-acento' : 'bg-texto-3/50')} style={{ width: `${(f.valor / max) * 100}%` }} />
                </span>
              </span>
            </>
          )
          const clase = 'flex items-center gap-3 rounded-control px-2 py-2'
          return (
            <li key={f.id}>
              {f.href ? (
                <Enlace href={f.href} className={cx(clase, 'transition-colors hover:bg-hover', FOCO)}>
                  {cuerpo}
                </Enlace>
              ) : (
                <div className={clase}>{cuerpo}</div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
