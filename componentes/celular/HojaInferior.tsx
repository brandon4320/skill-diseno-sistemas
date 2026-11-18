'use client'

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../base/utilidades'

/**
 * Hoja inferior (SKILL.md §4 Hojas, §6e): la hoja lateral del escritorio sube desde abajo con
 * agarre. Dos alturas (media y completa), sigue al dedo, se cierra arrastrando hacia abajo, con
 * Esc o tocando el fondo; el pie con la acción queda fijo. Usa <dialog> nativo (foco atrapado y
 * devuelto al cerrar).
 */
export type HojaInferiorProps = {
  abierta: boolean
  alCerrar: () => void
  titulo: string
  children: ReactNode
  /** Acción fija abajo (la píldora o la barra de botones). */
  pie?: ReactNode
  /** Empieza en media altura; arrastrar hacia arriba la lleva a completa. */
  inicial?: 'media' | 'completa'
}

export function HojaInferior({ abierta, alCerrar, titulo, children, pie, inicial = 'media' }: HojaInferiorProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()
  const [altura, setAltura] = useState<'media' | 'completa'>(inicial)
  const [dy, setDy] = useState(0)
  const inicio = useRef<number | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierta && !d.open) { setAltura(inicial); d.showModal() }
    if (!abierta && d.open) d.close()
  }, [abierta, inicial])

  const bajar = (e: PointerEvent<HTMLDivElement>) => { inicio.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId) }
  const mover = (e: PointerEvent<HTMLDivElement>) => { if (inicio.current !== null) setDy(e.clientY - inicio.current) }
  const soltar = () => {
    inicio.current = null
    if (dy > 120) { setDy(0); return alCerrar() }
    if (dy < -60) setAltura('completa')
    else if (dy > 60 && altura === 'completa') setAltura('media')
    setDy(0)
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={alCerrar}
      onCancel={e => { e.preventDefault(); alCerrar() }}
      onClick={e => { if (e.target === e.currentTarget) alCerrar() }}
      className="m-0 mt-auto h-auto max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-tinta/30 backdrop:backdrop-blur-[2px]"
    >
      <div
        style={{ transform: dy ? `translateY(${Math.max(dy, -80)}px)` : undefined }}
        className={cx(
          'flex flex-col rounded-t-[24px] bg-superficie shadow-flotante',
          altura === 'completa' ? 'h-[calc(100dvh-24px)]' : 'h-[55dvh]',
          dy === 0 && 'transition-[height,transform] duration-[280ms] ease-(--ease) motion-reduce:transition-none',
        )}
      >
        <div
          onPointerDown={bajar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          className="flex cursor-grab touch-none flex-col items-center px-4 pt-2 pb-3"
        >
          <span aria-hidden className="h-1 w-9 rounded-full bg-borde-fuerte" />
          <h2 id={idTitulo} className="mt-3 self-start font-display text-lg font-semibold text-tinta">{titulo}</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">{children}</div>
        {pie && <div className="border-t border-divisor px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)]">{pie}</div>}
      </div>
    </dialog>
  )
}
