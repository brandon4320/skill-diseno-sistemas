'use client'

import { FunnelSimpleIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { Contador } from './Contador'

export type FiltroActivo = {
  id: string
  /** "Estado" */
  campo: string
  /** "es", "no es", ">", "entre" */
  operador: string
  /** "Vencida" */
  valor: string
  icono?: Icon
}

export type FiltrosActivosProps = {
  filtros: FiltroActivo[]
  onQuitar: (id: string) => void
  onLimpiar: () => void
  /** Abre el panel o menú para agregar un filtro. */
  onAgregar: () => void
  /** "Mostrando 4 de 32 facturas": el resultado, debajo o al lado. */
  resultado?: string
  className?: string
}

/**
 * Filtros a la vista (patrones 2.4 y 2.6): el botón Filtrar dice cuántos hay, cada filtro es
 * campo · operador · valor · ×, y "Limpiar" aparece solo si hay alguno. Al quitar uno, el foco
 * vuelve al botón Filtrar (no se pierde en la nada).
 */
export function FiltrosActivos({ filtros, onQuitar, onLimpiar, onAgregar, resultado, className }: FiltrosActivosProps) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onAgregar}
          className={cx(
            'inline-flex h-7 items-center gap-1 rounded-chip border border-borde bg-superficie px-2.5 text-xs font-medium text-tinta shadow-min hover:bg-hover max-md:h-11',
            FOCO,
          )}
        >
          <FunnelSimpleIcon size={14} aria-hidden />
          Filtrar
          <Contador valor={filtros.length} tono="invertido" etiqueta={`${filtros.length} filtros puestos`} />
        </button>
        {filtros.length > 0 && <span aria-hidden className="mx-1 h-[22px] w-px bg-borde" />}
        {filtros.map(f => {
          const Icono = f.icono
          return (
            <span
              key={f.id}
              className="inline-flex h-7 items-center overflow-hidden rounded-chip border border-borde bg-superficie text-xs shadow-min max-md:h-[46px]"
            >
              <span className="inline-flex h-full items-center gap-1 border-r border-divisor px-2 text-texto-3">
                {Icono && <Icono size={13} aria-hidden />}
                {f.campo}
              </span>
              <span className="inline-flex h-full items-center border-r border-divisor px-1.5 text-texto-3">{f.operador}</span>
              <span className="inline-flex h-full items-center border-r border-divisor px-2 font-medium whitespace-nowrap text-tinta">{f.valor}</span>
              <button
                type="button"
                aria-label={`Quitar filtro ${f.campo}`}
                onClick={() => onQuitar(f.id)}
                className={cx('grid h-full w-7 place-items-center text-texto-3 hover:bg-hover hover:text-tinta max-md:w-11', FOCO)}
              >
                <XIcon size={12} aria-hidden />
              </button>
            </span>
          )
        })}
        {filtros.length > 0 && (
          <button
            type="button"
            onClick={onLimpiar}
            className={cx('h-7 rounded-chip px-2.5 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}
          >
            Limpiar
          </button>
        )}
      </div>
      {resultado && (
        <p aria-live="polite" className="text-[13px] text-texto-2 tabular-nums">
          {resultado}
        </p>
      )}
    </div>
  )
}
