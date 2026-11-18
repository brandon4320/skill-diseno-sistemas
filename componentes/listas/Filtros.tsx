'use client'
/**
 * Filtros de lista: PestanasEstado (punto + nombre + conteo, también en 0: filtran y explican los colores)
 * y ListaFiltrable (las filas viajan a su lugar en 260 ms al filtrar u ordenar).
 * Galería viva: ejemplos/biblioteca/07-listas.html#pestanas-de-estado-como-leyenda
 */
import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx, FOCO, TONOS, type Tono } from '../base/utilidades'
import { EASE, useFlip } from './_lista'

export type PestanaEstado = {
  id: string
  texto: string
  conteo: number
  /** Punto del estado: la pestaña hace de leyenda de los colores de la lista. */
  tono?: Tono
}

export type PestanasEstadoProps = {
  pestanas: PestanaEstado[]
  activa: string
  onCambio: (id: string) => void
  /** Rótulo del grupo para lectores de pantalla. */
  rotulo: string
  className?: string
}

/** El conteo va siempre, también en 0. El vacío que abre el 0 lo pone el padre (nombrando el filtro). */
export function PestanasEstado({ pestanas, activa, onCambio, rotulo, className }: PestanasEstadoProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  function teclas(e: KeyboardEvent, i: number) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const j = (i + d + pestanas.length) % pestanas.length
    refs.current[j]?.focus()
    onCambio(pestanas[j].id)
  }
  return (
    <div role="tablist" aria-label={rotulo} className={cx('flex gap-1 overflow-x-auto border-b border-divisor [scrollbar-width:none]', className)}>
      {pestanas.map((p, i) => {
        const sel = p.id === activa
        return (
          <button
            key={p.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={sel}
            tabIndex={sel ? 0 : -1}
            onClick={() => onCambio(p.id)}
            onKeyDown={(e) => teclas(e, i)}
            className={cx(
              'relative inline-flex h-10 shrink-0 items-center gap-2 px-3 text-[13px] whitespace-nowrap transition-colors',
              EASE,
              sel ? 'font-medium text-tinta' : 'text-texto-2 hover:text-tinta',
              FOCO,
            )}
          >
            {p.tono && <span aria-hidden className={cx('size-2 rounded-full', TONOS[p.tono].punto)} />}
            {p.texto}
            <span className={cx('rounded-chip px-1.5 text-xs tabular-nums', sel ? 'bg-suave text-tinta' : 'text-texto-3', p.conteo === 0 && 'opacity-70')}>{p.conteo}</span>
            {sel && <span aria-hidden className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-tinta" />}
          </button>
        )
      })}
    </div>
  )
}

export type ListaFiltrableProps<T> = {
  items: T[]
  clave: (item: T) => string
  fila: (item: T) => ReactNode
  /** Cambia cuando cambia el filtro o el orden: dispara la animación. */
  claveFiltro: unknown
  /** Lo que se ve cuando no queda nada: nombrá el filtro ("No hay contratos terminados"). */
  vacio?: ReactNode
  className?: string
}

/** Filtrar u ordenar sin parpadeo: las que quedan suben a su lugar; con movimiento reducido, cambio directo. */
export function ListaFiltrable<T>({ items, clave, fila, claveFiltro, vacio, className }: ListaFiltrableProps<T>) {
  const ref = useFlip<HTMLUListElement>(claveFiltro)
  if (items.length === 0 && vacio) return <div className={className}>{vacio}</div>
  return (
    <ul ref={ref} className={cx('divide-y divide-divisor', className)} aria-live="polite">
      {items.map((it) => (
        <li key={clave(it)} data-flip={clave(it)}>
          {fila(it)}
        </li>
      ))}
    </ul>
  )
}
