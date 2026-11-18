'use client'
/**
 * Celda del pie con "⌄ Calcular": gris, aparece al pasar y elige suma, promedio, mínimo,
 * máximo, conteo o vacías. Si hay filtro, pasale los valores filtrados.
 *
 *   <tfoot><tr>
 *     <td>{filas.length} facturas</td>
 *     <td className="text-right"><PieCalcular valores={filas.map(f => f.monto)} inicial="suma" moneda="ARS" /></td>
 *   </tr></tfoot>
 */
import { useEffect, useId, useRef, useState } from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { calcular, formatoMonto, NOMBRE_CALCULO, type Calculo } from './calculos'

export type PieCalcularProps = {
  valores: readonly (number | null | undefined)[]
  inicial?: Calculo
  /** Con moneda, suma/promedio/mín/máx salen como monto; conteo y vacías siempre como número. */
  moneda?: 'ARS' | 'USD'
  onCambiar?: (c: Calculo) => void
}

export function PieCalcular({ valores, inicial, moneda, onCambiar }: PieCalcularProps) {
  const [tipo, setTipo] = useState<Calculo | undefined>(inicial)
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const idMenu = useId()

  useEffect(() => {
    if (!abierto) return
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierto(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', fuera); document.removeEventListener('keydown', esc) }
  }, [abierto])

  const r = tipo ? calcular(valores, tipo) : null
  const esCuenta = tipo === 'conteo' || tipo === 'vacias'
  const m = formatoMonto(r, moneda)

  return (
    <div ref={caja} className="relative inline-flex justify-end">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((a) => !a)}
        className={cx(
          'group inline-flex h-7 items-center gap-1.5 rounded-chip px-1.5 text-xs tabular-nums hover:bg-hover max-md:min-h-11',
          !tipo && 'text-texto-3 opacity-0 focus-visible:opacity-100 aria-expanded:opacity-100 [@media(hover:none)]:opacity-100 [tfoot:hover_&]:opacity-100',
          FOCO,
        )}
      >
        {tipo ? (
          <>
            <span className="text-texto-3">{NOMBRE_CALCULO[tipo]}</span>
            <span className="text-[13px] font-semibold text-tinta">
              {esCuenta || !moneda ? (r === null ? '—' : new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(r)) : (
                <><span className="mr-1 text-[11px] font-normal text-texto-3">{m.simbolo}</span>{m.cifra}</>
              )}
            </span>
          </>
        ) : (
          <><CaretDownIcon size={12} aria-hidden /> Calcular</>
        )}
      </button>
      {abierto && (
        <div id={idMenu} role="menu" className="absolute right-0 bottom-full z-30 mb-1 w-44 rounded-control border border-borde bg-superficie p-1.5 shadow-flotante">
          {(Object.keys(NOMBRE_CALCULO) as Calculo[]).map((c) => (
            <button
              key={c}
              type="button"
              role="menuitemradio"
              aria-checked={c === tipo}
              onClick={() => { setTipo(c); onCambiar?.(c); setAbierto(false) }}
              className={cx('flex w-full items-center rounded-chip px-2.5 py-1.5 text-left text-[13px] text-tinta hover:bg-hover max-md:min-h-11', FOCO)}
            >
              <span className="flex-1">{NOMBRE_CALCULO[c]}</span>
              {c === tipo && <CheckIcon size={14} weight="bold" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
