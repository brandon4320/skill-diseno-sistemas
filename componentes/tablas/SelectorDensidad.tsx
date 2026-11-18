'use client'
/**
 * Selector de densidad: Compacta 28 · Normal 36 · Cómoda 44. Cada opción con título y bajada,
 * ✓ en la elegida, y la tabla cambia en vivo detrás. Guardalo por persona y por tabla.
 *
 *   const [d, setD] = useState<Densidad>('normal')
 *   <SelectorDensidad valor={d} onCambiar={setD} />
 *   <tr style={{ height: ALTO_FILA[d] }}>…
 */
import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon, RowsIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import type { Densidad } from './calculos'

const OPCIONES: { id: Densidad; titulo: string; bajada: string }[] = [
  { id: 'compacta', titulo: 'Compacta', bajada: 'Filas de 28 px, para revisar mucho de un vistazo' },
  { id: 'normal', titulo: 'Normal', bajada: 'Filas de 36 px, el punto medio' },
  { id: 'comoda', titulo: 'Cómoda', bajada: 'Filas de 44 px, para leer con calma' },
]

export type SelectorDensidadProps = {
  valor: Densidad
  onCambiar: (d: Densidad) => void
  className?: string
}

export function SelectorDensidad({ valor, onCambiar, className }: SelectorDensidadProps) {
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

  const actual = OPCIONES.find((o) => o.id === valor) ?? OPCIONES[1]

  return (
    <div ref={caja} className={cx('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((a) => !a)}
        className={cx('inline-flex h-8 items-center gap-2 rounded-chip border border-borde bg-superficie px-3 text-[13px] font-medium text-texto-2 hover:text-tinta max-md:h-11', FOCO)}
      >
        <RowsIcon size={16} aria-hidden />
        {actual.titulo}
      </button>
      {abierto && (
        <div id={idMenu} role="menu" className="absolute right-0 z-20 mt-2 w-72 rounded-control border border-borde bg-superficie p-1.5 shadow-flotante">
          {OPCIONES.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitemradio"
              aria-checked={o.id === valor}
              onClick={() => { onCambiar(o.id); setAbierto(false) }}
              className={cx('flex w-full items-start gap-3 rounded-chip px-3 py-2 text-left hover:bg-hover max-md:min-h-11', FOCO)}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-tinta">{o.titulo}</span>
                <span className="block text-xs text-texto-3">{o.bajada}</span>
              </span>
              {o.id === valor && <CheckIcon size={16} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-tinta" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
