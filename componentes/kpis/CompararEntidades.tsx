import type { ReactNode } from 'react'
import { Avatar } from '../base/Avatar'
import { colorDe, cx } from '../base/utilidades'

export type EntidadComparada = { id: string; nombre: string; valor: number; foto?: string; detalle?: ReactNode }

export type CompararEntidadesProps = {
  titulo: string
  contexto?: ReactNode
  entidades: EntidadComparada[]
  formato?: (n: number) => string
  /** Línea de referencia: promedio del equipo o meta. */
  referencia?: { valor: number; rotulo: string }
  /** Segmentado "Tasa de cierre | Ganado". */
  accion?: ReactNode
  className?: string
}

/**
 * Comparar entidades: una fila por responsable o cliente con su avatar, su barra en su
 * color fijo (colorDe) y la línea punteada del promedio. Ordenado de mayor a menor.
 */
export function CompararEntidades({ titulo, contexto, entidades, formato = String, referencia, accion, className }: CompararEntidadesProps) {
  const lista = [...entidades].sort((a, b) => b.valor - a.valor)
  const tope = Math.max(referencia?.valor ?? 0, ...lista.map((e) => e.valor)) || 1
  return (
    <section className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min [[data-tema=oscuro]_&]:shadow-none', className)}>
      <header className="flex flex-wrap items-start gap-3 border-b border-divisor px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-tinta">{titulo}</h3>
          {contexto && <p className="mt-1 text-xs text-texto-3">{contexto}</p>}
        </div>
        {accion && <div className="ml-auto">{accion}</div>}
      </header>
      <ul className="flex flex-col gap-1 p-3">
        {lista.map((e) => (
          <li key={e.id} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-3 rounded-control px-2 py-2">
            <span className="flex min-w-0 items-center gap-2">
              <Avatar persona={{ id: e.id, nombre: e.nombre, foto: e.foto }} tamano="xs" decorativo />
              <span className="truncate text-[13px] text-texto-2">{e.nombre}</span>
            </span>
            <span className="relative h-2 rounded-full bg-suave" aria-hidden>
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(e.valor / tope) * 100}%`, background: colorDe(e.id) }} />
              {referencia && <span className="absolute -inset-y-1.5 border-l border-dashed border-texto-3" style={{ left: `${(referencia.valor / tope) * 100}%` }} />}
            </span>
            <span className="text-right text-[13px] font-medium text-tinta tabular-nums">{e.detalle ?? formato(e.valor)}</span>
          </li>
        ))}
      </ul>
      {referencia && (
        <p className="flex items-center gap-2 border-t border-divisor px-5 py-3 text-xs text-texto-3">
          <span aria-hidden className="h-3 border-l border-dashed border-texto-3" />
          {referencia.rotulo}: <b className="font-medium text-texto-2 tabular-nums">{formato(referencia.valor)}</b>
        </p>
      )}
    </section>
  )
}
