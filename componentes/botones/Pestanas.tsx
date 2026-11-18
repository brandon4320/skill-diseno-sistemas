'use client'

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Pestañas con conteo (SKILL.md §5 Segmentado y pestañas): conteo gris al lado ("Archivos 9"),
 * el de la activa invertido y actualizado en el momento; la línea de 2 px viaja de una a otra en
 * 240 ms (sin animar en el primer pintado). Riel con scroll de costado si no entra.
 * Teclado WAI-ARIA tabs: ←/→, Inicio/Fin; activación automática.
 */
export type Pestana<T extends string> = { valor: T; texto: string; conteo?: number }

export type PestanasProps<T extends string> = {
  pestanas: readonly Pestana<T>[]
  valor: T
  onCambio: (v: T) => void
  rotulo: string
  /** Prefijo de ids para conectar con los paneles: `${idBase}-panel-${valor}`. */
  idBase: string
}

export function Pestanas<T extends string>({ pestanas, valor, onCambio, rotulo, idBase }: PestanasProps<T>) {
  const riel = useRef<HTMLDivElement>(null)
  const [linea, setLinea] = useState<{ x: number; w: number; animar: boolean } | null>(null)

  useLayoutEffect(() => {
    const medir = (animar: boolean) => {
      const b = riel.current?.querySelector<HTMLButtonElement>('[aria-selected=true]')
      if (b) setLinea({ x: b.offsetLeft, w: b.offsetWidth, animar })
    }
    medir(linea !== null)
    const ro = new ResizeObserver(() => medir(false))
    if (riel.current) ro.observe(riel.current)
    return () => ro.disconnect()
  }, [valor]) // eslint-disable-line react-hooks/exhaustive-deps

  const teclas = (e: KeyboardEvent) => {
    const i = pestanas.findIndex(p => p.valor === valor)
    const j = e.key === 'ArrowRight' ? (i + 1) % pestanas.length : e.key === 'ArrowLeft' ? (i - 1 + pestanas.length) % pestanas.length
      : e.key === 'Home' ? 0 : e.key === 'End' ? pestanas.length - 1 : -1
    if (j < 0) return
    e.preventDefault()
    onCambio(pestanas[j].valor)
    riel.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[j]?.focus()
  }

  return (
    <div ref={riel} role="tablist" aria-label={rotulo} onKeyDown={teclas} className="relative flex gap-4 overflow-x-auto border-b border-divisor [scrollbar-width:none]">
      {pestanas.map(p => {
        const on = p.valor === valor
        return (
          <button
            key={p.valor}
            role="tab"
            type="button"
            id={`${idBase}-tab-${p.valor}`}
            aria-selected={on}
            aria-controls={`${idBase}-panel-${p.valor}`}
            tabIndex={on ? 0 : -1}
            onClick={() => onCambio(p.valor)}
            className={cx('inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 text-[13px] font-medium whitespace-nowrap pointer-coarse:h-11', on ? 'text-tinta' : 'text-texto-2 hover:text-tinta', FOCO)}
          >
            {p.texto}
            {p.conteo !== undefined && (
              <span className={cx('inline-grid h-[18px] min-w-5 place-items-center rounded-full px-1.5 text-xs tabular-nums', on ? 'bg-tinta text-superficie' : 'bg-suave text-texto-3')}>
                {p.conteo}
              </span>
            )}
          </button>
        )
      })}
      {linea && (
        <span
          aria-hidden
          style={{ width: linea.w, transform: `translateX(${linea.x}px)` }}
          className={cx('absolute bottom-[-1px] left-0 h-0.5 rounded-full bg-tinta', linea.animar && 'transition-[transform,width] duration-[240ms] ease-(--ease) motion-reduce:transition-none')}
        />
      )}
    </div>
  )
}
