'use client'
/**
 * Tarjeta al pasar: la ficha corta de una persona, cliente o factura sin salir de donde estás
 * (menciones, nombres en tablas, avatares).
 *
 * - Abre a los 500 ms de posarse y con el foco del teclado; cierra a los 200 ms de salir,
 *   así se puede entrar a la tarjeta y usar sus botones.
 * - Nunca guarda lo único importante: es atajo, no el único camino.
 * - Se ubica abajo y, si no entra, arriba. 300 px de ancho, radio de tarjeta, sombra flotante.
 *
 *   <TarjetaAlPasar contenido={<FichaPersona …/>}>
 *     <span tabIndex={0}>@Martina Quiroga</span>
 *   </TarjetaAlPasar>
 */
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn, EASE } from './compartido'

type PropsDisparador = {
  'aria-describedby'?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
  onBlur?: () => void
  ref?: (el: HTMLElement | null) => void
}

export type TarjetaAlPasarProps = {
  /** Un solo elemento enfocable (span con tabIndex, botón o enlace). */
  children: ReactElement<PropsDisparador>
  contenido: ReactNode
  /** ms antes de abrir. Por defecto 500. */
  demora?: number
  ancho?: number
}

export function TarjetaAlPasar({ children, contenido, demora = 500, ancho = 300 }: TarjetaAlPasarProps) {
  const [abierta, setAbierta] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number; arriba: boolean } | null>(null)
  const disp = useRef<HTMLElement | null>(null)
  const caja = useRef<HTMLDivElement>(null)
  const reloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const id = useId()

  const abrir = (ms: number) => {
    clearTimeout(reloj.current)
    reloj.current = setTimeout(() => setAbierta(true), ms)
  }
  const cerrar = () => {
    clearTimeout(reloj.current)
    reloj.current = setTimeout(() => setAbierta(false), 200)
  }
  useEffect(() => () => clearTimeout(reloj.current), [])
  useEffect(() => {
    if (!abierta) return
    const f = (e: KeyboardEvent) => e.key === 'Escape' && setAbierta(false)
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [abierta])

  useLayoutEffect(() => {
    if (!abierta || !disp.current) return
    const r = disp.current.getBoundingClientRect()
    const h = caja.current?.offsetHeight ?? 180
    const arriba = r.bottom + 8 + h > window.innerHeight && r.top - 8 - h > 0
    const x = Math.max(16, Math.min(r.left, window.innerWidth - ancho - 16))
    setPos({ x, y: arriba ? r.top - 8 - h : r.bottom + 8, arriba })
  }, [abierta, ancho])

  const disparador = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      disp.current = el
    },
    'aria-describedby': abierta ? id : undefined,
    onMouseEnter: () => abrir(demora),
    onMouseLeave: cerrar,
    onFocus: () => abrir(0),
    onBlur: cerrar,
  })

  return (
    <>
      {disparador}
      {abierta &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={caja}
            id={id}
            role="tooltip"
            onMouseEnter={() => clearTimeout(reloj.current)}
            onMouseLeave={cerrar}
            style={{ left: pos?.x ?? -9999, top: pos?.y ?? -9999, width: ancho }}
            className={cn(
              'fixed z-50 rounded-tarjeta border border-borde bg-superficie p-4 text-[13px] text-tinta shadow-flotante tabular-nums',
              'animate-[ds-tarjeta_180ms_both] motion-reduce:animate-none',
              EASE,
            )}
          >
            <style href="ds-tarjeta" precedence="ds">{`@keyframes ds-tarjeta{from{opacity:0;transform:translateY(${pos?.arriba ? 4 : -4}px) scale(.98)}}`}</style>
            {contenido}
          </div>,
          document.body,
        )}
    </>
  )
}
