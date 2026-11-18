'use client'

import { type KeyboardEvent } from 'react'
import { PlusIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Vistas guardadas (01-navegacion · 15): las vistas de una entidad y sus filtros en una sola fila de
 * pestañas con ícono y conteo, y "+ Vista" punteado al final; nunca una ruta por vista.
 * Si la vista activa cambió, avisa y ofrece guardar o descartar.
 */
export type Vista = { id: string; texto: string; icono: Icon; conteo?: number }

export type VistasGuardadasProps = {
  vistas: readonly Vista[]
  activa: string
  onCambio: (id: string) => void
  onNueva?: () => void
  /** La vista activa tiene filtros u orden sin guardar. */
  modificada?: boolean
  onGuardar?: () => void
  onDescartar?: () => void
  idBase: string
}

export function VistasGuardadas({ vistas, activa, onCambio, onNueva, modificada, onGuardar, onDescartar, idBase }: VistasGuardadasProps) {
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = vistas.findIndex(v => v.id === activa)
    const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: vistas.length - 1 }[e.key]
    if (j === undefined) return
    e.preventDefault()
    const k = (j + vistas.length) % vistas.length
    onCambio(vistas[k].id)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')[k]?.focus()
  }
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-divisor">
      <div role="tablist" aria-label="Vistas" onKeyDown={teclas} className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
        {vistas.map(v => {
          const on = v.id === activa
          const I = v.icono
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              id={`${idBase}-tab-${v.id}`}
              aria-selected={on}
              aria-controls={`${idBase}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => onCambio(v.id)}
              className={cx('relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 px-2 text-[13px] font-medium whitespace-nowrap pointer-coarse:h-11', on ? 'text-tinta after:absolute after:inset-x-1 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-tinta' : 'text-texto-2 hover:text-tinta', FOCO)}
            >
              <I weight={on ? 'fill' : 'regular'} className="size-4" aria-hidden />
              {v.texto}
              {v.conteo !== undefined && <span className={cx('font-mono text-[11px] tabular-nums', on ? 'text-texto-2' : 'text-texto-3')}>{v.conteo}</span>}
              {on && modificada && <span className="size-1.5 rounded-full bg-ambar-texto" aria-label="sin guardar" />}
            </button>
          )
        })}
        {onNueva && (
          <button type="button" onClick={onNueva} className={cx('ml-1 inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-control border border-dashed border-borde-fuerte px-2 text-xs text-texto-2 hover:text-tinta', FOCO)}>
            <PlusIcon className="size-3.5" aria-hidden />Vista
          </button>
        )}
      </div>
      {modificada && (
        <div role="status" className="ml-auto flex items-center gap-2 pb-2 text-xs text-texto-2 sm:pb-0">
          Cambiaste esta vista
          {onDescartar && <button type="button" onClick={onDescartar} className={cx('cursor-pointer rounded-control px-2 py-1 hover:bg-hover hover:text-tinta', FOCO)}>Descartar</button>}
          {onGuardar && <button type="button" onClick={onGuardar} className={cx('cursor-pointer rounded-control border border-borde bg-superficie px-2 py-1 font-medium text-tinta shadow-min hover:shadow-hover', FOCO)}>Guardar vista</button>}
        </div>
      )}
    </div>
  )
}
