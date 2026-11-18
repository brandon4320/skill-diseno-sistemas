import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type RenglonDesglose = { id: string; rotulo: string; valor: ReactNode; unidad?: string; color: string }
export type MiniKpi = { id: string; rotulo: string; valor: ReactNode; icono: ReactNode; color: string }

export type KpiDesgloseProps = {
  titulo: string
  /** Exactamente tres renglones "◯ rótulo ··· valor unidad". */
  renglones: RenglonDesglose[]
  /** Hasta cuatro mini-KPIs hundidos con su ícono de color. */
  minis?: MiniKpi[]
  /** El pie cuenta lo que viene: "Se liberan 40 h el lunes". */
  pie?: ReactNode
  className?: string
}

/**
 * KPI con desglose (patrón 7.15, anatomía fija): tres filas entre dos hairlines y debajo
 * los mini-KPIs hundidos (bg-suave) con su ícono de color.
 */
export function KpiDesglose({ titulo, renglones, minis = [], pie, className }: KpiDesgloseProps) {
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie p-5 shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <h3 className="font-display text-xl font-semibold tracking-[-.02em] text-tinta">{titulo}</h3>
      <dl className="mt-4 divide-y divide-divisor border-y border-divisor">
        {renglones.map((r) => (
          <div key={r.id} className="flex items-center gap-3 py-3 text-[13px]">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full border-2" style={{ borderColor: r.color }} />
            <dt className="min-w-0 flex-1 truncate text-texto-2">{r.rotulo}</dt>
            <dd className="font-medium text-tinta tabular-nums">
              {r.valor}
              {r.unidad && <span className="ml-1 font-normal text-texto-3">{r.unidad}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {minis.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {minis.map((m) => (
            <div key={m.id} className="flex min-w-0 flex-col gap-2 rounded-interno bg-suave p-3">
              <span aria-hidden className="grid size-7 place-items-center rounded-chip [&>svg]:size-4" style={{ color: m.color, background: `color-mix(in oklab, ${m.color} 14%, transparent)` }}>
                {m.icono}
              </span>
              <dt className="truncate text-xs text-texto-3">{m.rotulo}</dt>
              <dd className="font-display text-lg font-medium text-tinta tabular-nums">{m.valor}</dd>
            </div>
          ))}
        </dl>
      )}
      {pie && <p className="mt-4 text-xs text-texto-2">{pie}</p>}
    </section>
  )
}
