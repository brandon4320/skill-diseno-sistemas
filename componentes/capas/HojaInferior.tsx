'use client'
/**
 * Hoja inferior (celular): el detalle sube desde abajo sin perder la lista.
 *
 * - Dos alturas: "medio" (≈ 55 %) y "completo" (≈ 92 %). Se arrastra del agarre; al soltar
 *   va a la altura más cercana, y si se baja de la mitad del "medio", se cierra.
 * - El agarre es un botón de 44 px: con Enter alterna las alturas.
 * - Velo detrás (toca y cierra), Esc cierra, foco atrapado, el foco vuelve a la fila.
 * - prefers-reduced-motion: sin desplazamiento, solo aparece.
 *
 *   <HojaInferior abierta={!!id} onCerrar={() => setId(null)} titulo="FAC-01102" pie={<Boton>Cobrar</Boton>}>…</HojaInferior>
 */
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from '@phosphor-icons/react'
import { cn, EASE, FOCO, useEsc, useFocoAtrapado } from './compartido'

export type AlturaHoja = 'medio' | 'completo'

export type HojaInferiorProps = {
  abierta: boolean
  onCerrar: () => void
  titulo: ReactNode
  subtitulo?: ReactNode
  children: ReactNode
  /** Acción principal fija abajo. */
  pie?: ReactNode
  alturaInicial?: AlturaHoja
}

const ALTO: Record<AlturaHoja, number> = { medio: 0.55, completo: 0.92 }

export function HojaInferior({ abierta, onCerrar, titulo, subtitulo, children, pie, alturaInicial = 'medio' }: HojaInferiorProps) {
  const [altura, setAltura] = useState<AlturaHoja>(alturaInicial)
  const [arrastre, setArrastre] = useState<number | null>(null)
  const inicio = useRef<{ y: number; h: number } | null>(null)
  const caja = useRef<HTMLDivElement>(null)
  const idTitulo = useId()
  useEsc(abierta, onCerrar)
  useFocoAtrapado(abierta, caja)
  useEffect(() => {
    if (abierta) setAltura(alturaInicial)
  }, [abierta, alturaInicial])

  if (!abierta || typeof document === 'undefined') return null

  const vh = typeof window === 'undefined' ? 800 : window.innerHeight
  const alto = arrastre ?? ALTO[altura] * vh

  const bajar = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    inicio.current = { y: e.clientY, h: ALTO[altura] * vh }
  }
  const mover = (e: PointerEvent<HTMLButtonElement>) => {
    if (!inicio.current) return
    setArrastre(Math.max(80, Math.min(ALTO.completo * vh, inicio.current.h + inicio.current.y - e.clientY)))
  }
  const soltar = () => {
    if (!inicio.current) return
    const h = arrastre ?? inicio.current.h
    inicio.current = null
    setArrastre(null)
    if (h < (ALTO.medio * vh) / 2) return onCerrar()
    setAltura(Math.abs(h - ALTO.medio * vh) < Math.abs(h - ALTO.completo * vh) ? 'medio' : 'completo')
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <style href="ds-hoja-inf" precedence="ds">{`@keyframes ds-sube{from{transform:translateY(100%)}}@keyframes ds-velo{from{opacity:0}}`}</style>
      <div aria-hidden onClick={onCerrar} className="absolute inset-0 animate-[ds-velo_240ms_both] bg-[color-mix(in_oklch,var(--color-tinta)_32%,transparent)] motion-reduce:animate-none" />
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        style={{ height: alto }}
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col rounded-t-tarjeta border-t border-borde bg-superficie shadow-flotante',
          'animate-[ds-sube_320ms_both] pb-[env(safe-area-inset-bottom)] motion-reduce:animate-none',
          arrastre === null && 'transition-[height] duration-300',
          EASE,
        )}
      >
        <button
          type="button"
          aria-label={altura === 'medio' ? 'Agrandar hoja' : 'Achicar hoja'}
          onClick={() => setAltura((a) => (a === 'medio' ? 'completo' : 'medio'))}
          onPointerDown={bajar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          className={cn('grid h-11 w-full flex-none cursor-grab touch-none place-items-center', FOCO)}
        >
          <i aria-hidden className="h-[5px] w-9 rounded-full bg-borde-fuerte" />
        </button>
        <header className="flex items-start gap-3 border-b border-divisor px-5 pb-3">
          <div className="min-w-0 flex-1">
            <h2 id={idTitulo} className="truncate font-display text-lg font-medium tracking-[-0.01em] text-tinta">{titulo}</h2>
            {subtitulo && <p className="truncate text-[13px] text-texto-2">{subtitulo}</p>}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className={cn('-mt-1 -mr-2 grid size-11 place-items-center rounded-control text-texto-2 hover:bg-hover', FOCO)}>
            <XIcon size={18} aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 tabular-nums">{children}</div>
        {pie && <footer className="flex flex-none gap-2 border-t border-divisor px-5 py-3 [&>*]:flex-1">{pie}</footer>}
      </div>
    </div>,
    document.body,
  )
}
