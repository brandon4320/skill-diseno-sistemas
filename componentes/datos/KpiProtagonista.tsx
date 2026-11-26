import type { ElementType, ReactNode } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr'
import { Curva } from './Curva'

type Props = {
  rotulo: string
  /** Ícono Phosphor (19 px). Va en un cuadro translúcido. */
  icono?: ReactNode
  /** Normalmente <Cuenta hasta={184200} />. */
  valor: ReactNode
  unidad?: string
  sufijo?: string
  /** <Variacion variante="sobreColor" .../> arriba a la derecha. */
  variacion?: ReactNode
  /** Una línea bajo la cifra: "vs. US$ 164.000 en octubre". */
  contexto?: ReactNode
  /** Serie de la curva blanca del pie. Sin serie, la tarjeta igual se sostiene con la trama. */
  serie?: (number | null | undefined)[]
  /** Índice del punto marcado. Por defecto el antepenúltimo: lejos del borde, que corta el punto. */
  punto?: number | 'ultimo'
  /** Globo sobre el punto: "Hoy", "US$ 184 mil". */
  globo?: ReactNode
  /** Color base. Por defecto el acento del sistema; para una entidad, `colorDe(id)`. */
  color?: string
  href?: string
  enlace?: ElementType
  className?: string
}

/**
 * La tarjeta protagonista (08 "Total Expenses", 09 "halfway there"): una sola por pantalla.
 * Degradé del acento con un brillo arriba a la derecha, trama de puntos que se desvanece,
 * cifra grande en blanco y la curva blanca con su punto apoyada en el borde de abajo.
 */
export function KpiProtagonista({
  rotulo,
  icono,
  valor,
  unidad,
  sufijo,
  variacion,
  contexto,
  serie,
  punto,
  globo,
  color = 'var(--color-acento)',
  href,
  enlace: Enlace = 'a',
  className = '',
}: Props) {
  const fondo = {
    background: [
      `radial-gradient(120% 140% at 100% 0%, color-mix(in oklch, ${color} 55%, white) 0%, transparent 55%)`,
      `linear-gradient(150deg, color-mix(in oklch, ${color} 82%, black), ${color} 60%, color-mix(in oklch, ${color} 92%, black))`,
    ].join(','),
    boxShadow: `0 18px 36px -18px color-mix(in oklch, ${color} 60%, transparent), inset 0 1px 0 rgb(255 255 255 / .18)`,
  }

  const contenido = (
    <>
      {/* trama de puntos, se apaga hacia abajo a la izquierda */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/.11)_1px,transparent_1.2px)] [background-size:14px_14px] [mask-image:linear-gradient(200deg,#000,transparent_60%)]"
      />
      {/* ícono y rótulo en la misma fila (SKILL.md §4i): la protagonista no pasa de ~190 px */}
      <div className="relative flex min-h-8 items-center gap-2">
        {icono && (
          <span className="grid size-8 shrink-0 place-items-center rounded-[10px] border border-white/20 bg-white/15 [&>svg]:size-4">
            {icono}
          </span>
        )}
        <span className="min-w-0 truncate text-[13px] font-medium text-white/80">{rotulo}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5">
          {variacion}
          {href && (
            <ArrowUpRightIcon
              size={16}
              aria-hidden
              className="opacity-60 transition-[opacity,translate] duration-200 group-hover/heroe:translate-x-px group-hover/heroe:-translate-y-px group-hover/heroe:opacity-100"
            />
          )}
        </span>
      </div>
      <div className="font-display relative mt-2 flex items-baseline text-[32px] leading-[1.1] font-medium tracking-[-.03em] tabular-nums">
        {unidad && <span className="mr-1 text-xl font-normal tracking-normal text-white/60">{unidad}</span>}
        {valor}
        {sufijo && <span className="ml-0.5 text-xl font-normal tracking-normal text-white/60">{sufijo}</span>}
      </div>
      {contexto && <div className="relative mt-0.5 truncate text-xs text-white/65">{contexto}</div>}
      {serie && serie.length > 0 && (
        <div className="absolute inset-x-0 bottom-0">
          <Curva valores={serie} sobreColor alto={56} punto={punto ?? Math.max(0, serie.length - 3)} globo={globo} guia />
        </div>
      )}
    </>
  )

  const clase = `group/heroe relative isolate flex min-w-0 flex-col overflow-hidden rounded-tarjeta p-5 text-white ${serie?.length ? 'pb-16' : ''} ${className}`

  return href ? (
    <Enlace
      href={href}
      className={`${clase} transition-[translate] duration-300 ease-(--ease) outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-acento/40 focus-visible:ring-offset-2 motion-reduce:transition-none`}
      style={fondo}
    >
      {contenido}
    </Enlace>
  ) : (
    <section className={clase} style={fondo}>
      {contenido}
    </section>
  )
}
