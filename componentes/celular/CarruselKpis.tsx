'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Carrusel de KPIs (SKILL.md §6e): los KPIs del tablero pasan a tarjetas al 84 % con encastre;
 * se ve el borde de la siguiente, el paginador dice dónde estás y cada punto lleva a su tarjeta.
 */
export type KpiCarrusel = { id: string; rotulo: string; valor: ReactNode; contexto?: ReactNode }

export function CarruselKpis({ kpis, etiqueta = 'Indicadores' }: { kpis: readonly KpiCarrusel[]; etiqueta?: string }) {
  const pista = useRef<HTMLDivElement>(null)
  const [actual, setActual] = useState(0)

  useEffect(() => {
    const el = pista.current
    if (!el) return
    const obs = new IntersectionObserver(
      entradas => entradas.forEach(e => { if (e.isIntersecting) setActual(Number((e.target as HTMLElement).dataset.i)) }),
      { root: el, threshold: 0.6 },
    )
    Array.from(el.children).forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [kpis.length])

  const ir = (i: number) => {
    const hijo = pista.current?.children[i] as HTMLElement | undefined
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    hijo?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <section aria-roledescription="carrusel" aria-label={etiqueta}>
      <div ref={pista} className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {kpis.map((k, i) => (
          <article
            key={k.id}
            data-i={i}
            aria-roledescription="tarjeta"
            aria-label={`${i + 1} de ${kpis.length}: ${k.rotulo}`}
            className="w-[84%] shrink-0 snap-start rounded-tarjeta border border-borde bg-superficie p-4 shadow-min"
          >
            <p className="text-xs font-medium text-texto-3">{k.rotulo}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-tinta tabular-nums">{k.valor}</p>
            {k.contexto && <p className="mt-1 text-sm text-texto-2">{k.contexto}</p>}
          </article>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1" role="group" aria-label="Elegir tarjeta">
        {kpis.map((k, i) => (
          <button
            key={k.id}
            type="button"
            aria-label={k.rotulo}
            aria-current={i === actual || undefined}
            onClick={() => ir(i)}
            className={cx('grid h-6 min-w-6 cursor-pointer place-items-center rounded-full', FOCO)}
          >
            <span aria-hidden className={cx('block h-1.5 rounded-full transition-[width,background-color] duration-200', i === actual ? 'w-4 bg-tinta' : 'w-1.5 bg-borde-fuerte')} />
          </button>
        ))}
      </div>
    </section>
  )
}
