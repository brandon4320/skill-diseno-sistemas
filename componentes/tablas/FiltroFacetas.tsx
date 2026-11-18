'use client'
/**
 * Filtro por facetas: buscador que nombra los campos, grupos con rótulo en mayúscula,
 * facetas de 28 px que se invierten al elegirse (con el mismo punto o avatar que la celda),
 * y pie fijo "Mostrando X de Y · Limpiar". Se filtra en vivo, sin "Aplicar".
 */
import { useId, type ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type OpcionFaceta = { id: string; texto: string; cantidad?: number; marcador?: ReactNode }
export type GrupoFacetas = { id: string; rotulo: string; opciones: OpcionFaceta[] }
/** Elegidas por grupo: { estado: Set(['vencida']), cliente: Set([...]) }. */
export type EleccionFacetas = Record<string, ReadonlySet<string>>

export type FiltroFacetasProps = {
  grupos: GrupoFacetas[]
  elegidas: EleccionFacetas
  onCambiar: (e: EleccionFacetas) => void
  busqueda: string
  onBuscar: (q: string) => void
  /** Ej.: "Proyecto, cliente o responsable". Nombra los campos donde busca. */
  placeholder: string
  mostrando: number
  total: number
  className?: string
}

export function FiltroFacetas({ grupos, elegidas, onCambiar, busqueda, onBuscar, placeholder, mostrando, total, className }: FiltroFacetasProps) {
  const idBusca = useId()
  const hayAlgo = busqueda.trim() !== '' || Object.values(elegidas).some((s) => s.size > 0)

  const alternar = (g: string, o: string) => {
    const s = new Set(elegidas[g] ?? [])
    if (s.has(o)) s.delete(o)
    else s.add(o)
    onCambiar({ ...elegidas, [g]: s })
  }

  return (
    <aside className={cx('flex w-full flex-col overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-min lg:w-[280px]', className)} aria-label="Filtros">
      <div className="px-3 pt-3 pb-1">
        <label htmlFor={idBusca} className="flex h-9 items-center gap-2 rounded-control border border-borde-fuerte bg-superficie px-3 text-texto-3 focus-within:border-tinta max-md:h-11">
          <MagnifyingGlassIcon size={16} aria-hidden />
          <input
            id={idBusca}
            type="search"
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-tinta outline-none placeholder:text-texto-3"
          />
        </label>
      </div>
      <div className="flex flex-col gap-5 px-3 pt-2 pb-4">
        {grupos.map((g) => (
          <fieldset key={g.id} className="flex flex-col gap-2">
            <legend className="mb-2 text-[11px] font-medium tracking-[.06em] text-texto-3 uppercase">{g.rotulo}</legend>
            <div className="flex flex-wrap gap-1.5">
              {g.opciones.map((o) => {
                const on = elegidas[g.id]?.has(o.id) ?? false
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => alternar(g.id, o.id)}
                    className={cx(
                      'inline-flex h-7 items-center gap-1.5 rounded-chip border px-2 text-xs font-medium whitespace-nowrap tabular-nums transition-colors max-md:min-h-11',
                      on ? 'border-tinta bg-tinta text-superficie' : 'border-borde bg-superficie text-texto-2 hover:border-borde-fuerte hover:text-tinta',
                      FOCO,
                    )}
                  >
                    {o.marcador}
                    {o.texto}
                    {o.cantidad !== undefined && <span className={cx('font-normal', on ? 'opacity-70' : 'text-texto-3')}>{o.cantidad}</span>}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-divisor bg-suave py-2 pr-2 pl-4 text-xs text-texto-3" aria-live="polite">
        <span>
          Mostrando <b className="font-medium text-tinta tabular-nums">{mostrando}</b> de <span className="tabular-nums">{total}</span>
        </span>
        {hayAlgo && (
          <button
            type="button"
            onClick={() => { onBuscar(''); onCambiar(Object.fromEntries(grupos.map((g) => [g.id, new Set<string>()]))) }}
            className={cx('ml-auto h-7 rounded-chip px-2 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:min-h-11', FOCO)}
          >
            Limpiar
          </button>
        )}
      </div>
    </aside>
  )
}
