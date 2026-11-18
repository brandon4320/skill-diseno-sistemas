'use client'

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO } from './utilidades'

export type OpcionSegmentado<T extends string> = {
  valor: T
  texto: string
  /** Conteo gris al lado: "Vencidas 3". */
  conteo?: number
  icono?: Icon
}

export type SegmentadoProps<T extends string> = {
  opciones: readonly OpcionSegmentado<T>[]
  valor: T
  onCambio: (valor: T) => void
  /** Qué elige este selector ("Período", "Vista"): lo lee el lector de pantalla. */
  'aria-label': string
  tamano?: 'normal' | 'chico'
  /** Ocupa todo el ancho y reparte las opciones (útil en celular). */
  anchoCompleto?: boolean
  className?: string
}

/**
 * Selector segmentado para 2 a 4 vistas o períodos (Día/Semana/Mes).
 * Riel bg-suave con una pastilla que se desliza a la opción activa.
 * Teclado: flechas, Inicio y Fin; solo la opción activa entra en el Tab.
 */
export function Segmentado<T extends string>({
  opciones,
  valor,
  onCambio,
  tamano = 'normal',
  anchoCompleto = false,
  className,
  ...aria
}: SegmentadoProps<T>) {
  const riel = useRef<HTMLDivElement>(null)
  const botones = useRef<(HTMLButtonElement | null)[]>([])
  const [pastilla, setPastilla] = useState<{ x: number; w: number } | null>(null)
  const [animar, setAnimar] = useState(false)
  const activo = Math.max(0, opciones.findIndex((o) => o.valor === valor))

  // Mide la opción activa; vuelve a medir si cambia el tamaño (fuentes que cargan, ancho del riel).
  useLayoutEffect(() => {
    const medir = () => {
      const b = botones.current[activo]
      if (b) setPastilla({ x: b.offsetLeft, w: b.offsetWidth })
    }
    medir()
    const ro = new ResizeObserver(medir)
    if (riel.current) ro.observe(riel.current)
    return () => ro.disconnect()
  }, [activo, opciones])

  // La primera vez aparece en su lugar; recién después se desliza.
  useLayoutEffect(() => {
    if (pastilla && !animar) {
      const r = requestAnimationFrame(() => setAnimar(true))
      return () => cancelAnimationFrame(r)
    }
  }, [pastilla, animar])

  const mover = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = opciones.length
    const destino =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (activo + 1) % n
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (activo - 1 + n) % n
      : e.key === 'Home' ? 0
      : e.key === 'End' ? n - 1
      : -1
    if (destino < 0) return
    e.preventDefault()
    onCambio(opciones[destino].valor)
    botones.current[destino]?.focus()
  }

  const chico = tamano === 'chico'

  return (
    <div
      ref={riel}
      role="radiogroup"
      {...aria}
      onKeyDown={mover}
      className={cx(
        'relative isolate gap-0.5 rounded-control border border-borde bg-suave p-1',
        anchoCompleto ? 'flex w-full' : 'inline-flex',
        className,
      )}
    >
      {pastilla && (
        <span
          aria-hidden
          className={cx(
            'absolute inset-y-1 left-0 -z-10 rounded-chip bg-superficie shadow-min ring-1 ring-borde',
            '[[data-tema=oscuro]_&]:bg-tinta [[data-tema=oscuro]_&]:shadow-none',
            animar && 'transition-[translate,width] duration-300 ease-(--ease) motion-reduce:transition-none',
          )}
          style={{ width: pastilla.w, translate: `${pastilla.x}px 0` }}
        />
      )}
      {opciones.map((o, i) => {
        const on = i === activo
        const Icono = o.icono
        return (
          <button
            key={o.valor}
            ref={(el) => {
              botones.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onCambio(o.valor)}
            className={cx(
              'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-chip font-medium whitespace-nowrap',
              'transition-colors duration-150',
              chico ? 'h-6 px-3 text-xs' : 'h-7 px-3 text-[13px] pointer-coarse:h-10',
              anchoCompleto && 'flex-1',
              on
                ? 'text-tinta [[data-tema=oscuro]_&]:text-superficie'
                : 'text-texto-2 hover:text-tinta',
              // Hasta medir, la activa lleva su propio fondo (sin parpadeo en el primer pintado).
              on && !pastilla && 'bg-superficie shadow-min',
              FOCO,
            )}
          >
            {Icono && <Icono size={chico ? 13 : 15} weight={on ? 'fill' : 'regular'} aria-hidden />}
            {o.texto}
            {o.conteo != null && <span className="font-medium text-texto-3 tabular-nums">{o.conteo}</span>}
          </button>
        )
      })}
    </div>
  )
}
