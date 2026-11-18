'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type TonoContador = 'neutro' | 'acento' | 'rojo' | 'invertido'

const TONO: Record<TonoContador, string> = {
  neutro: 'bg-suave text-texto-2',
  acento: 'bg-acento text-white',
  rojo: 'bg-rojo-texto text-white',
  invertido: 'bg-tinta text-superficie',
}

export type ContadorProps = {
  valor: number
  /**
   * neutro: un conteo (Contratos 48) · acento: lo no leído · rojo: solo lo que falló o venció ·
   * invertido: la cantidad de filtros puestos.
   */
  tono?: TonoContador
  /** Pasado este número dice "99+". */
  max?: number
  /** Con 0 no se muestra (por defecto). */
  ocultarEnCero?: boolean
  /** "3 sin leer": lo que escucha el lector de pantalla. Si falta, solo el número. */
  etiqueta?: string
  className?: string
}

/**
 * Contador (patrones 17.3 y 15.8): 18 px de alto, radio completo, cifra tabular.
 * Cuando el número cambia, late una vez (escala 1,3 con resorte, 260 ms; quieto con reduced-motion).
 */
export function Contador({ valor, tono = 'neutro', max = 99, ocultarEnCero = true, etiqueta, className }: ContadorProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const previo = useRef(valor)
  useEffect(() => {
    if (previo.current === valor) return
    previo.current = valor
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!quieto)
      ref.current?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], {
        duration: 260,
        easing: 'cubic-bezier(.34,1.56,.64,1)',
      })
  }, [valor])
  if (ocultarEnCero && valor === 0) return null
  return (
    <span
      ref={ref}
      aria-label={etiqueta}
      className={cx(
        'inline-grid h-[18px] min-w-[18px] place-items-center rounded-full px-[5px] text-[11px] leading-none font-semibold tabular-nums',
        TONO[tono],
        className,
      )}
    >
      {valor > max ? `${max}+` : valor}
    </span>
  )
}

/** Punto de novedad: 7–10 px del acento, cuando no importa cuántas. */
export function PuntoNovedad({ etiqueta = 'Hay novedades', className }: { etiqueta?: string; className?: string }) {
  return <span role="img" aria-label={etiqueta} className={cx('inline-block size-[7px] shrink-0 rounded-full bg-acento', className)} />
}

export type ConInsigniaProps = {
  children: ReactNode
  /** Número arriba a la derecha; con `punto` va solo el punto de 10 px. */
  valor?: number
  punto?: boolean
  tono?: TonoContador
  max?: number
  className?: string
}

/**
 * Insignia sobre un botón de ícono: arriba a la derecha, con anillo de 2 px de la superficie.
 * El botón de adentro lleva su aria-label con la cantidad ("Avisos, 3 sin leer").
 */
export function ConInsignia({ children, valor = 0, punto, tono = 'acento', max = 99, className }: ConInsigniaProps) {
  return (
    <span className={cx('relative inline-flex', className)}>
      {children}
      {punto ? (
        <span aria-hidden className="pointer-events-none absolute top-1.5 right-1.5 size-2.5 rounded-full bg-acento ring-2 ring-superficie" />
      ) : (
        valor > 0 && (
          <span aria-hidden className="pointer-events-none absolute -top-[5px] -right-[5px]">
            <Contador valor={valor} tono={tono} max={max} className="ring-2 ring-superficie" />
          </span>
        )
      )}
    </span>
  )
}
