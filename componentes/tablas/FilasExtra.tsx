'use client'
/**
 * Filas especiales de la tabla:
 * - <BandaGrupo>: nombre, cantidad y subtotal; se pliega con su chevron.
 * - <FilaDetalle>: el chevron gira 90° y el detalle se abre debajo, sin navegar.
 * - gravedadFila(): ámbar al 8 % / rojo al 12 % / pausada en gris. Solo registros técnicos.
 */
import { useId, useState, type ReactNode } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { formatoMonto } from './calculos'

export type BandaGrupoProps = {
  nombre: ReactNode
  cantidad: number
  subtotal?: number
  moneda?: 'ARS' | 'USD'
  abierta: boolean
  onAlternar: () => void
  /** Cantidad de columnas de la tabla. */
  columnas: number
}

export function BandaGrupo({ nombre, cantidad, subtotal, moneda, abierta, onAlternar, columnas }: BandaGrupoProps) {
  const m = formatoMonto(subtotal, moneda)
  return (
    <tr className="bg-suave">
      <td colSpan={columnas} className="h-9 px-2 max-md:h-11">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-expanded={abierta}
            onClick={onAlternar}
            className={cx('inline-flex h-7 min-w-0 items-center gap-1.5 rounded-chip px-1 text-[13px] font-semibold text-tinta hover:bg-hover max-md:min-h-11', FOCO)}
          >
            <CaretRightIcon size={12} weight="bold" aria-hidden className={cx('shrink-0 text-texto-3 transition-transform duration-200 ease-(--ease)', abierta && 'rotate-90')} />
            <span className="truncate">{nombre}</span>
            <span className="text-xs font-normal text-texto-3 tabular-nums">{cantidad}</span>
          </button>
          {subtotal !== undefined && (
            <span className="ml-auto pr-2 text-[13px] font-semibold text-tinta tabular-nums">
              <span className="mr-1 text-[11px] font-normal text-texto-3">{m.simbolo}</span>{m.cifra}
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}

export type FilaDetalleProps = {
  /** Celdas de la fila, sin la primera (la del chevron la pone el componente). */
  celdas: ReactNode
  detalle: ReactNode
  columnas: number
  etiqueta: string
  inicialAbierta?: boolean
  className?: string
}

export function FilaDetalle({ celdas, detalle, columnas, etiqueta, inicialAbierta = false, className }: FilaDetalleProps) {
  const [abierta, setAbierta] = useState(inicialAbierta)
  const id = useId()
  return (
    <>
      <tr className={cx('border-b border-divisor', abierta && 'bg-hover', className)}>
        <td className="w-9 pl-1">
          <button
            type="button"
            aria-expanded={abierta}
            aria-controls={id}
            aria-label={`${abierta ? 'Cerrar' : 'Ver'} detalle de ${etiqueta}`}
            onClick={() => setAbierta((a) => !a)}
            className={cx('grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}
          >
            <CaretRightIcon size={12} weight="bold" aria-hidden className={cx('transition-transform duration-200 ease-(--ease)', abierta && 'rotate-90')} />
          </button>
        </td>
        {celdas}
      </tr>
      <tr id={id} hidden={!abierta} className="border-b border-divisor bg-panel">
        <td colSpan={columnas} className="p-0">
          <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-(--ease) motion-reduce:transition-none">
            <div className="overflow-hidden px-4 py-4 pl-12 max-md:pl-4">{detalle}</div>
          </div>
        </td>
      </tr>
    </>
  )
}

export type Gravedad = 'normal' | 'aviso' | 'error' | 'pausada'

/** Clases para el <tr> de un registro técnico. Nunca se pinta una fila por un estado normal. */
export function gravedadFila(g: Gravedad): string {
  switch (g) {
    case 'aviso': return 'bg-ambar-texto/8 text-ambar-texto'
    case 'error': return 'bg-rojo-texto/12 text-rojo-texto'
    case 'pausada': return 'text-texto-3 [&_img]:grayscale'
    default: return ''
  }
}
