'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Ficha con segmentado (SKILL.md §6e): la ficha de tres columnas pasa a una columna con
 * segmentado fijo arriba (Actividad / Resumen / Datos) que abre en la primera; nunca las tres
 * apiladas. Al cambiar, el foco va al título de la sección nueva.
 */
export type SeccionFicha = { id: string; texto: string; contenido: ReactNode }

export function FichaSegmentada({ secciones, inicial }: { secciones: readonly SeccionFicha[]; inicial?: string }) {
  const [activa, setActiva] = useState(inicial ?? secciones[0]?.id)
  const titulo = useRef<HTMLHeadingElement>(null)
  const primera = useRef(true)

  useEffect(() => {
    if (primera.current) { primera.current = false; return }
    titulo.current?.focus()
  }, [activa])

  const s = secciones.find(x => x.id === activa) ?? secciones[0]
  if (!s) return null

  return (
    <div>
      <div className="sticky top-0 z-10 bg-fondo/90 px-4 py-2 backdrop-blur">
        <div role="tablist" aria-label="Secciones de la ficha" className="grid auto-cols-fr grid-flow-col rounded-full bg-suave p-1">
          {secciones.map(x => (
            <button
              key={x.id}
              id={`tab-${x.id}`}
              type="button"
              role="tab"
              aria-selected={x.id === s.id}
              aria-controls={`panel-${x.id}`}
              onClick={() => setActiva(x.id)}
              className={cx(
                'h-9 cursor-pointer rounded-full text-sm font-medium transition-[background-color,color,box-shadow] duration-200',
                x.id === s.id ? 'bg-superficie text-tinta shadow-min' : 'text-texto-2',
                FOCO,
              )}
            >
              {x.texto}
            </button>
          ))}
        </div>
      </div>
      <section id={`panel-${s.id}`} role="tabpanel" aria-labelledby={`tab-${s.id}`} className="px-4 pt-2">
        <h2 ref={titulo} tabIndex={-1} className="mb-3 font-display text-lg font-semibold text-tinta outline-none">{s.texto}</h2>
        {s.contenido}
      </section>
    </div>
  )
}
