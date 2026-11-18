'use client'

import { useState, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type PorcionPuntos = { id: string; nombre: string; valor: number; color: string; detalle?: ReactNode }

export type AnilloPuntosProps = {
  porciones: PorcionPuntos[]
  /** Cifra del centro: "$ 184,2 M". */
  total: ReactNode
  /** Debajo del total: "facturado en 2026". */
  subtitulo?: ReactNode
  /** Cantidad de puntos del aro. */
  puntos?: number
  /** Texto para lectores de pantalla. */
  etiqueta: string
  formato?: (n: number) => string
  className?: string
}

/** Reparte n puntos por proporción con el método del resto mayor (siempre suman n). */
function repartir(valores: number[], n: number): number[] {
  const suma = valores.reduce((a, b) => a + b, 0) || 1
  const exactos = valores.map((v) => (v / suma) * n)
  const base = exactos.map(Math.floor)
  let faltan = n - base.reduce((a, b) => a + b, 0)
  exactos
    .map((e, i) => ({ i, r: e - Math.floor(e) }))
    .sort((a, b) => b.r - a.r)
    .forEach(({ i }) => {
      if (faltan > 0) {
        base[i]++
        faltan--
      }
    })
  return base
}

/**
 * Anillo de puntos (patrón 7.11): en lugar de dona, 40 puntos repartidos por proporción,
 * el total al centro y la leyenda en filas-tarjeta. Pasar o enfocar una fila apaga el resto.
 */
export function AnilloPuntos({ porciones, total, subtitulo, puntos = 40, etiqueta, formato = String, className }: AnilloPuntosProps) {
  const [activo, setActivo] = useState<string | null>(null)
  const cuantos = repartir(
    porciones.map((p) => p.valor),
    puntos,
  )
  const suma = porciones.reduce((a, p) => a + p.valor, 0) || 1
  const asignados = porciones.flatMap((p, i) => Array.from({ length: cuantos[i] }, () => p))
  const R = 92

  return (
    <div className={cx('flex flex-wrap items-center gap-6', className)}>
      <div className="relative size-[220px] shrink-0">
        <svg viewBox="0 0 220 220" role="img" aria-label={etiqueta} className="size-full">
          {asignados.map((p, i) => {
            const a = (i / puntos) * Math.PI * 2 - Math.PI / 2
            const apagado = activo !== null && activo !== p.id
            return (
              <circle
                key={i}
                cx={110 + R * Math.cos(a)}
                cy={110 + R * Math.sin(a)}
                r={6.5}
                fill={p.color}
                className="transition-opacity duration-200 ease-(--ease)"
                opacity={apagado ? 0.18 : 1}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <b className="font-display text-[22px] font-medium tracking-[-.02em] text-tinta tabular-nums">{total}</b>
          {subtitulo && <span className="text-xs text-texto-3">{subtitulo}</span>}
        </div>
      </div>
      <ul className="flex min-w-[220px] flex-1 flex-col gap-1.5">
        {porciones.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onMouseEnter={() => setActivo(p.id)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(p.id)}
              onBlur={() => setActivo(null)}
              aria-pressed={activo === p.id}
              className={cx(
                'flex w-full items-center gap-3 rounded-control border border-borde bg-superficie px-3 py-2 text-left text-[13px] transition-opacity duration-200',
                activo !== null && activo !== p.id && 'opacity-50',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45',
              )}
            >
              <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
              <span className="min-w-0 flex-1 truncate text-texto-2">{p.nombre}</span>
              <span className="font-mono text-xs text-texto-3 tabular-nums">{Math.round((p.valor / suma) * 100)} %</span>
              <span className="font-medium text-tinta tabular-nums">{p.detalle ?? formato(p.valor)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
