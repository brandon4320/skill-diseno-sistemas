'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Firma (SKILL.md §5 Celular, campo): recuadro de 200 con línea base punteada, «×» y la ayuda
 * adentro; el trazo engrosa al ir lento. Deshacer quita el último trazo. Al firmar queda quién y
 * cuándo (`firmante`, `hora`). `alCambiar` recibe el PNG en data URL o null si quedó vacía.
 */
type Punto = { x: number; y: number; t: number }

export type FirmaProps = {
  alCambiar: (png: string | null) => void
  firmante?: string
  hora?: string
  ayuda?: string
}

export function Firma({ alCambiar, firmante, hora, ayuda = 'Firmá con el dedo' }: FirmaProps) {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const trazos = useRef<Punto[][]>([])
  const [cantidad, setCantidad] = useState(0)

  const dibujar = () => {
    const c = lienzo.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.strokeStyle = getComputedStyle(c).color
    ctx.lineCap = 'round'
    const k = c.width / c.clientWidth
    for (const t of trazos.current) {
      for (let i = 1; i < t.length; i++) {
        const a = t[i - 1], b = t[i]
        const v = Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t)
        ctx.lineWidth = Math.max(1.2, 3.4 - v * 1.6) * k
        ctx.beginPath(); ctx.moveTo(a.x * k, a.y * k); ctx.lineTo(b.x * k, b.y * k); ctx.stroke()
      }
    }
  }

  useEffect(() => {
    const c = lienzo.current
    if (!c) return
    c.width = c.clientWidth * devicePixelRatio
    c.height = c.clientHeight * devicePixelRatio
    dibujar()
  }, [])

  const punto = (e: PointerEvent<HTMLCanvasElement>): Punto => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp }
  }
  const avisar = () => {
    setCantidad(trazos.current.length)
    alCambiar(trazos.current.length ? lienzo.current?.toDataURL('image/png') ?? null : null)
  }

  return (
    <div className="px-4">
      <div className="relative h-[200px] rounded-tarjeta border border-borde bg-superficie">
        <canvas
          ref={lienzo}
          role="img"
          aria-label={cantidad ? 'Firma cargada' : 'Recuadro de firma vacío'}
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); trazos.current.push([punto(e)]) }}
          onPointerMove={e => { if (e.buttons) { trazos.current.at(-1)?.push(punto(e)); dibujar() } }}
          onPointerUp={avisar}
          className="absolute inset-0 size-full touch-none text-tinta"
        />
        <span aria-hidden className="pointer-events-none absolute inset-x-6 bottom-12 flex items-end gap-2 border-b border-dashed border-borde-fuerte pb-1 text-texto-3">
          <span className="text-lg leading-none">×</span>
          {!cantidad && <span className="text-sm">{ayuda}</span>}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-texto-3">
          {cantidad && firmante ? <>Firmó <b className="font-medium text-texto-2">{firmante}</b>{hora && <> · {hora}</>}</> : 'Sin firmar'}
        </p>
        <button
          type="button"
          disabled={!cantidad}
          onClick={() => { trazos.current.pop(); dibujar(); avisar() }}
          className={cx('flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium text-tinta disabled:cursor-default disabled:text-deshabilitado', FOCO)}
        >
          <ArrowCounterClockwise size={16} aria-hidden /> Deshacer
        </button>
      </div>
    </div>
  )
}
