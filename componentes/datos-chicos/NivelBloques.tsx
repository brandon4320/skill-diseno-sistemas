'use client'

import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { cx, FOCO } from '../base/utilidades'

export type NivelBloquesProps = {
  valor: number
  total: number
  onCambio: (n: number) => void
  /** "Nivel de combustible" */
  etiqueta: string
  /** Color según el nivel: por defecto rojo ≤ 2, ámbar ≤ 4, acento el resto. */
  color?: (n: number) => string
  className?: string
}

const COLOR = (n: number) => (n <= 2 ? 'var(--color-rojo-texto)' : n <= 4 ? 'var(--color-ambar-texto)' : 'var(--color-acento)')

/**
 * Bloques que se eligen (patrón 7.1): un bloque por unidad, 4 px de aire, radio 3.
 * Es un role="slider": se toca, se arrastra o se maneja con flechas, Inicio y Fin.
 * En celular la franja mide 44 px de alto aunque los bloques sigan siendo de 10.
 */
export function NivelBloques({ valor, total, onCambio, etiqueta, color = COLOR, className }: NivelBloquesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const desdeX = (x: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    onCambio(Math.max(1, Math.min(total, Math.ceil(((x - r.left) / r.width) * total))))
  }
  const abajo = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    desdeX(e.clientX)
  }
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) desdeX(e.clientX)
  }
  const tecla = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, Home: -total, End: total } as Record<string, number>)[e.key]
    if (!d) return
    e.preventDefault()
    onCambio(Math.max(1, Math.min(total, valor + d)))
  }
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={etiqueta}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={valor}
      aria-valuetext={`${valor} de ${total}`}
      onPointerDown={abajo}
      onPointerMove={mover}
      onKeyDown={tecla}
      className={cx('flex min-h-7 cursor-pointer touch-none items-center gap-1 rounded-chip max-md:min-h-11', FOCO, className)}
    >
      {Array.from({ length: total }, (_, i) => (
        <i
          key={i}
          className="h-2.5 flex-1 rounded-[3px] transition-colors duration-[180ms]"
          style={{ background: i < valor ? color(valor) : 'var(--color-suave)' }}
        />
      ))}
    </div>
  )
}

/**
 * Meta del día en la barra superior (patrón 7.20): anillo de 22 px + "4 de 20 llamadas hoy".
 * Al llegar, el anillo pasa a verde. Server-friendly (sin estado).
 */
export function MetaDelDia({ hechas, meta, que, className }: { hechas: number; meta: number; que: string; className?: string }) {
  const tam = 22
  const g = 3
  const r = (tam - g) / 2
  const L = 2 * Math.PI * r
  const f = Math.min(1, hechas / meta)
  return (
    <span className={cx('inline-flex h-9 items-center gap-2 rounded-full border border-borde bg-superficie pr-3 pl-1.5 text-[13px] tabular-nums', className)}>
      <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} aria-hidden>
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--color-suave)" strokeWidth={g} />
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke={hechas >= meta ? 'var(--color-verde-texto)' : 'var(--color-acento)'}
          strokeWidth={g}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - f)}
          transform={`rotate(-90 ${tam / 2} ${tam / 2})`}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span>
        <b className="font-medium">{hechas}</b> <span className="text-texto-3">de {meta} {que}</span>
      </span>
    </span>
  )
}
