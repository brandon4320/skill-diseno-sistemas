'use client'

import { CaretDownIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'

export type Parte = { id: string; nombre: string; valor: number; color?: string }

const DATOS = ['var(--color-dato-1)', 'var(--color-dato-2)', 'var(--color-dato-3)', 'var(--color-dato-4)', 'var(--color-dato-5)']
/* Lo que no está nombrado va en grises escalonados (patrón 7.3). */
const GRISES = [72, 54, 38, 26, 18].map(p => `color-mix(in oklch, var(--color-texto-3) ${p}%, var(--color-superficie))`)
const pct = (n: number) => `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)} %`

export type BarraComposicionProps = {
  /** Ordenadas de mayor a menor. */
  partes: Parte[]
  /** Cuántas llevan color y se nombran cerrada (2–3). */
  nombradas?: number
  /** Cómo se escribe el valor de cada parte en la leyenda. */
  formato?: (n: number) => string
  /** Encima de la barra: "12 días para el cierre · $ 127 M". */
  cabecera?: ReactNode
  /** Leyenda en filas con valor (por defecto) o en línea "● USD 25 %". */
  leyenda?: 'filas' | 'linea'
  className?: string
}

/**
 * Barra apilada con leyenda (patrones 7.2 y 7.3): 8 px, 3 px de aire entre partes, puntas redondas.
 * Solo lo nombrado lleva color; al expandir con el círculo de 36 px, todas toman su color en un
 * fundido de 180 ms sin mover el layout. Pasar por una fila de la leyenda resalta su parte.
 */
export function BarraComposicion({ partes, nombradas = 3, formato = String, cabecera, leyenda = 'filas', className }: BarraComposicionProps) {
  const [abierto, setAbierto] = useState(false)
  const [foco, setFoco] = useState<string | null>(null)
  const total = partes.reduce((a, p) => a + p.valor, 0) || 1
  const color = (p: Parte, i: number) => p.color ?? (abierto || i < nombradas ? DATOS[i] ?? GRISES[4] : GRISES[i - nombradas] ?? GRISES[4])
  const visibles = abierto ? partes : partes.slice(0, nombradas)
  const expandible = leyenda === 'filas' && partes.length > nombradas

  const barra = (
    <div aria-hidden className="flex h-2 gap-[3px]">
      {partes.map((p, i) => (
        <i
          key={p.id}
          className={cx('min-w-1 rounded-full transition-[opacity,background-color] duration-[180ms]', foco && foco !== p.id && 'opacity-25')}
          style={{ flexGrow: p.valor, background: color(p, i) }}
        />
      ))}
    </div>
  )

  if (leyenda === 'linea')
    return (
      <div className={cx('flex flex-col gap-2', className)}>
        {cabecera}
        {barra}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-texto-3">
          {partes.slice(0, nombradas).map((p, i) => (
            <li key={p.id} className="inline-flex items-center gap-1.5">
              <i aria-hidden className="size-[7px] rounded-full" style={{ background: color(p, i) }} />
              {p.nombre} <b className="font-semibold text-tinta tabular-nums">{pct((p.valor / total) * 100)}</b>
            </li>
          ))}
        </ul>
      </div>
    )

  return (
    <div className={cx('relative rounded-interno border border-borde bg-superficie', expandible && 'mb-[18px]', className)}>
      <div className="p-4">
        {cabecera && <div className="mb-3 flex items-center gap-2 text-[13px] text-texto-2">{cabecera}</div>}
        {barra}
      </div>
      <ul className={cx('border-t border-divisor px-4 pt-2', expandible ? 'pb-6' : 'pb-2')}>
        {visibles.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onPointerEnter={() => setFoco(p.id)}
              onPointerLeave={() => setFoco(null)}
              onFocus={() => setFoco(p.id)}
              onBlur={() => setFoco(null)}
              className={cx('-mx-1.5 flex min-h-9 w-[calc(100%+12px)] items-center gap-2 rounded-chip px-1.5 text-left text-[13px] hover:bg-hover max-md:min-h-11', FOCO)}
            >
              <i aria-hidden className="size-2 shrink-0 rounded-full transition-colors duration-[180ms]" style={{ background: color(p, i) }} />
              <span className="min-w-0 flex-1 truncate">{p.nombre}</span>
              <span className="w-11 text-right text-texto-3 tabular-nums">{pct((p.valor / total) * 100)}</span>
              <span className="w-[88px] text-right font-medium tabular-nums">{formato(p.valor)}</span>
            </button>
          </li>
        ))}
      </ul>
      {expandible && (
        <button
          type="button"
          onClick={() => setAbierto(a => !a)}
          aria-expanded={abierto}
          aria-label={abierto ? `Ver solo las ${nombradas} mayores` : 'Ver todas las partes'}
          className={cx(
            'absolute -bottom-[18px] left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-borde bg-superficie text-texto-2 shadow-min hover:text-tinta max-md:-bottom-[22px] max-md:size-11',
            FOCO,
          )}
        >
          <CaretDownIcon size={16} aria-hidden className={cx('transition-transform duration-[180ms]', abierto && 'rotate-180')} />
        </button>
      )}
    </div>
  )
}

/** Mini barras de 96×28 para una celda: grises y la última en tinta (la de hoy). */
export function MiniBarras({ valores, etiqueta, className }: { valores: number[]; etiqueta?: string; className?: string }) {
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  return (
    <span
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
      className={cx('inline-flex h-7 w-24 items-end gap-0.5', className)}
    >
      {valores.map((v, i) => (
        <i
          key={i}
          className={cx('flex-1 rounded-t-[2px] rounded-b-[1px]', i === valores.length - 1 ? 'bg-tinta' : 'bg-texto-3/35')}
          style={{ height: `${Math.max(8, ((v - min) / (max - min || 1)) * 100)}%` }}
        />
      ))}
    </span>
  )
}
