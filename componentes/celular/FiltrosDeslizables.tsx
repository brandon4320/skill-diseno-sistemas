'use client'

import { Faders } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Filtros que se deslizan (SKILL.md §2 Filtros, §6e): chips con conteo en una fila que se desplaza
 * de costado con fundido en el borde; el activo invertido. Lo fino va en «Filtros» con su número,
 * que abre una hoja (HojaInferior).
 */
export type ChipFiltro = { id: string; texto: string; cantidad?: number }

export type FiltrosDeslizablesProps = {
  chips: readonly ChipFiltro[]
  activo: string
  alElegir: (id: string) => void
  /** Cuántos filtros finos hay puestos (se muestra en el botón). */
  finos?: number
  alAbrirFiltros?: () => void
}

export function FiltrosDeslizables({ chips, activo, alElegir, finos = 0, alAbrirFiltros }: FiltrosDeslizablesProps) {
  return (
    <div className="flex items-center gap-2 pl-4">
      {alAbrirFiltros && (
        <button
          type="button"
          onClick={alAbrirFiltros}
          aria-haspopup="dialog"
          aria-label={finos ? `Filtros, ${finos} puestos` : 'Filtros'}
          className={cx('flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-borde bg-superficie px-3 text-sm font-medium text-tinta', FOCO)}
        >
          <Faders size={16} aria-hidden />
          <span aria-hidden>Filtros</span>
          {finos > 0 && <span aria-hidden className="grid h-5 min-w-5 place-items-center rounded-full bg-acento px-1 font-mono text-[11px] text-superficie">{finos}</span>}
        </button>
      )}
      <div
        role="radiogroup"
        aria-label="Vista"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto pr-4 [scrollbar-width:none] [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)]"
      >
        {chips.map(c => {
          const es = c.id === activo
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={es}
              onClick={() => alElegir(c.id)}
              className={cx(
                'flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150',
                es ? 'border-tinta bg-tinta text-superficie' : 'border-borde bg-superficie text-texto-2 hover:text-tinta',
                FOCO,
              )}
            >
              {c.texto}
              {c.cantidad !== undefined && <span className={cx('font-mono text-xs tabular-nums', es ? 'opacity-70' : 'text-texto-3')}>{c.cantidad}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
