import type { ReactNode } from 'react'
import { CheckIcon, WarningIcon } from '@phosphor-icons/react/ssr'
import { cx } from '../base/utilidades'

export type EstadoPaso = 'hecho' | 'actual' | 'pendiente' | 'vencido'

export type PasoTiempo = {
  id: string
  titulo: ReactNode
  /** "12 nov · 10:32", "vence 25 nov". */
  cuando?: ReactNode
  detalle?: ReactNode
  estado: EstadoPaso
  /** Acción del paso (por ejemplo "Enviar recordatorio"); solo en el actual. */
  accion?: ReactNode
}

export type LineaTiempoProps = {
  pasos: PasoTiempo[]
  'aria-label': string
  className?: string
}

/**
 * Línea de tiempo de tareas o de un documento (patrones 8.11 y 8.12): un punto por paso,
 * unidos por una raya que se pone verde en lo hecho. El actual en negrita, lo vencido en rojo
 * con ícono y palabra (nunca solo color). Server Component.
 */
export function LineaTiempo({ pasos, className, ...aria }: LineaTiempoProps) {
  return (
    <ol aria-label={aria['aria-label']} className={cx('flex flex-col', className)}>
      {pasos.map((p, i) => {
        const ultimo = i === pasos.length - 1
        return (
          <li key={p.id} className={cx('relative grid grid-cols-[16px_minmax(0,1fr)] gap-x-3', !ultimo && 'pb-4')}>
            {!ultimo && (
              <span aria-hidden className={cx('absolute left-[7.5px] top-5 bottom-0.5 w-px', p.estado === 'hecho' ? 'bg-[color-mix(in_oklch,var(--color-verde-texto)_45%,var(--color-borde))]' : 'bg-borde')} />
            )}
            <span className="grid h-5 place-items-center">
              {p.estado === 'hecho' ? (
                <span className="grid size-4 place-items-center rounded-full bg-verde-fondo text-verde-texto"><CheckIcon size={10} weight="bold" aria-label="Hecho" /></span>
              ) : p.estado === 'vencido' ? (
                <span className="grid size-4 place-items-center rounded-full bg-rojo-fondo text-rojo-texto"><WarningIcon size={10} weight="bold" aria-label="Vencido" /></span>
              ) : p.estado === 'actual' ? (
                <span aria-label="Actual" role="img" className="size-3 rounded-full border-2 border-tinta bg-superficie" />
              ) : (
                <span aria-label="Pendiente" role="img" className="size-2.5 rounded-full border border-borde-fuerte bg-superficie" />
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <b className={cx('text-[13px]', p.estado === 'actual' ? 'font-medium text-tinta' : p.estado === 'hecho' ? 'font-normal text-texto-2' : p.estado === 'vencido' ? 'font-medium text-rojo-texto' : 'font-normal text-texto-2')}>
                  {p.titulo}
                  {p.estado === 'vencido' && <span className="sr-only"> (vencido)</span>}
                </b>
                {p.cuando && <span className="text-xs text-texto-3 tabular-nums">{p.cuando}</span>}
              </span>
              {p.detalle && <span className="text-xs text-texto-2">{p.detalle}</span>}
              {p.accion && <span className="mt-1.5">{p.accion}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
