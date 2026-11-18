'use client'

import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO, TONOS, type Tono } from '../base/utilidades'

/**
 * Fila deslizable (SKILL.md §4 y §6f): deslizar a la izquierda revela acciones con fondo de color
 * que nombran lo que hacen. La fila sigue al dedo sin curva y al soltar encastra en 240 ms.
 * Deslizar hasta el fondo (más de 60 % del ancho) ejecuta la primera acción; quien la use tiene
 * que ofrecer Deshacer (toast). Con teclado, las acciones también están como botones al enfocar.
 */
export type AccionDeslizable = { id: string; texto: string; icono: Icon; tono: Tono; hacer: () => void }

export type FilaDeslizableProps = { children: ReactNode; acciones: readonly AccionDeslizable[]; etiqueta: string }

const ANCHO_ACCION = 76

export function FilaDeslizable({ children, acciones, etiqueta }: FilaDeslizableProps) {
  const lista = acciones.slice(0, 3)
  const abierto = -ANCHO_ACCION * lista.length
  const [x, setX] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)
  const inicio = useRef<{ px: number; x: number; ancho: number } | null>(null)

  const bajar = (e: PointerEvent<HTMLDivElement>) => {
    inicio.current = { px: e.clientX, x, ancho: e.currentTarget.offsetWidth }
    e.currentTarget.setPointerCapture(e.pointerId)
    setArrastrando(true)
  }
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (!inicio.current) return
    setX(Math.min(0, inicio.current.x + e.clientX - inicio.current.px))
  }
  const soltar = () => {
    const i = inicio.current
    inicio.current = null
    setArrastrando(false)
    if (!i) return
    if (lista[0] && -x > i.ancho * 0.6) { setX(0); lista[0].hacer(); return }
    setX(-x > -abierto / 2 ? abierto : 0)
  }

  return (
    <div className="relative overflow-hidden rounded-control" role="group" aria-label={etiqueta}>
      <div className="absolute inset-y-0 right-0 flex" aria-hidden={x === 0}>
        {lista.map(a => {
          const t = TONOS[a.tono]
          return (
            <button
              key={a.id}
              type="button"
              tabIndex={x === 0 ? -1 : 0}
              onClick={() => { setX(0); a.hacer() }}
              style={{ width: ANCHO_ACCION }}
              className={cx('flex cursor-pointer flex-col items-center justify-center gap-1 text-xs font-medium', t.fondo, t.texto, FOCO)}
            >
              <a.icono size={20} aria-hidden />
              {a.texto}
            </button>
          )
        })}
      </div>
      <div
        onPointerDown={bajar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') setX(abierto)
          if (e.key === 'ArrowRight' || e.key === 'Escape') setX(0)
        }}
        tabIndex={0}
        aria-description="Flecha izquierda muestra las acciones"
        style={{ transform: `translateX(${x}px)` }}
        className={cx(
          'relative touch-pan-y bg-superficie select-none',
          !arrastrando && 'transition-transform duration-[240ms] ease-(--ease) motion-reduce:transition-none',
          FOCO,
        )}
      >
        {children}
      </div>
    </div>
  )
}
