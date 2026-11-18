'use client'

import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Barra inferior del celular (SKILL.md §5): cápsula flotante de 64 px a 16 de los bordes con
 * 4 destinos como máximo. El activo va en pastilla de acento suave con ícono fill y palabra; el
 * resto solo ícono (la palabra queda para lectores de pantalla). Insignia con el número de
 * pendientes. La pastilla viaja en 240 ms.
 */
export type DestinoBarra = {
  id: string
  texto: string
  icono: Icon
  /** Pendientes: se muestra la insignia y se suma al nombre accesible. */
  insignia?: number
  /** Qué cuenta la insignia, para el lector: "vencidos". */
  queCuenta?: string
}

export type BarraInferiorProps = {
  destinos: readonly DestinoBarra[]
  activo: string
  alElegir: (id: string) => void
  etiqueta?: string
}

export function BarraInferior({ destinos, activo, alElegir, etiqueta = 'Secciones' }: BarraInferiorProps) {
  const lista = destinos.slice(0, 4)
  return (
    <nav
      aria-label={etiqueta}
      className="fixed inset-x-4 bottom-4 z-30 mb-[env(safe-area-inset-bottom)] flex h-16 items-center justify-around gap-1 rounded-full border border-borde bg-superficie px-2 shadow-flotante"
    >
      {lista.map(d => {
        const es = d.id === activo
        const nombre = d.insignia ? `${d.texto}, ${d.insignia} ${d.queCuenta ?? 'pendientes'}` : d.texto
        return (
          <button
            key={d.id}
            type="button"
            aria-current={es ? 'page' : undefined}
            aria-label={nombre}
            onClick={() => alElegir(d.id)}
            className={cx(
              'relative flex h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm font-medium',
              'transition-[background-color,color,padding] duration-[240ms] ease-(--ease) motion-reduce:transition-none',
              es ? 'bg-acento-suave px-4 text-acento' : 'text-texto-3 hover:text-tinta',
              FOCO,
            )}
          >
            <d.icono size={22} weight={es ? 'fill' : 'regular'} aria-hidden />
            {es && <span aria-hidden>{d.texto}</span>}
            {d.insignia ? (
              <span aria-hidden className="absolute top-1 right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rojo-texto px-1 font-mono text-[11px] leading-none font-medium text-superficie tabular-nums">
                {d.insignia > 99 ? '99+' : d.insignia}
              </span>
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}
