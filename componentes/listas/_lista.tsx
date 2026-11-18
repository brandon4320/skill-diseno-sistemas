'use client'
/**
 * Piezas compartidas de listas/: plural, cabecera de grupo (banda plegable con conteo y "+"),
 * contenedor con desvanecido que sigue el scroll y el hook FLIP para filtrar sin parpadeo.
 */
import { useLayoutEffect, useRef, useState, type ReactNode, type UIEvent } from 'react'
import { CaretRightIcon, PlusIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/** plural(1, 'tarea') → "1 tarea"; plural(3, 'tarea') → "3 tareas"; plural(2, 'acción', 'acciones'). */
export function plural(n: number, uno: string, varios = uno + 's'): string {
  return `${n.toLocaleString('es-AR')} ${n === 1 ? uno : varios}`
}

export const EASE = 'ease-(--ease)'

/* ── Cabecera de grupo ──────────────────────────────────────────────────── */

export type CabeceraGrupoProps = {
  titulo: ReactNode
  conteo?: number
  /** A la derecha: el total del grupo ("$ 1,2 M"). */
  total?: ReactNode
  /** Si está, la banda pliega y despliega. */
  abierto?: boolean
  onAlternar?: () => void
  /** "+" que crea en este grupo. */
  onCrear?: () => void
  textoCrear?: string
  /** Queda pegada arriba al hacer scroll dentro del contenedor. */
  pegada?: boolean
  /** Solo la fecha (Vencidas) puede ir en rojo; la banda no. */
  className?: string
}

/** Banda de 40 px: Vencidas · 3 / Hoy · 5. */
export function CabeceraGrupo({ titulo, conteo, total, abierto, onAlternar, onCrear, textoCrear = 'Crear en este grupo', pegada, className }: CabeceraGrupoProps) {
  const plegable = onAlternar !== undefined
  const contenido = (
    <>
      {plegable && (
        <CaretRightIcon size={12} weight="bold" aria-hidden className={cx('text-texto-3 transition-transform duration-200', EASE, abierto && 'rotate-90')} />
      )}
      <span className="text-[13px] font-medium text-tinta">{titulo}</span>
      {conteo !== undefined && <span className="text-xs text-texto-3 tabular-nums">{conteo}</span>}
    </>
  )
  return (
    <div className={cx('group/banda flex h-10 items-center gap-2 border-b border-divisor bg-panel px-4', pegada && 'sticky top-0 z-10', className)}>
      {plegable ? (
        <button type="button" aria-expanded={abierto} onClick={onAlternar} className={cx('-ml-1 flex h-8 items-center gap-2 rounded-chip px-1', FOCO)}>
          {contenido}
        </button>
      ) : (
        <div className="flex items-center gap-2">{contenido}</div>
      )}
      <span className="flex-1" />
      {total !== undefined && <span className="text-xs text-texto-2 tabular-nums">{total}</span>}
      {onCrear && (
        <button
          type="button"
          aria-label={textoCrear}
          onClick={onCrear}
          className={cx('grid size-8 place-items-center rounded-control text-texto-3 transition-colors hover:bg-hover hover:text-tinta md:size-7', FOCO)}
        >
          <PlusIcon size={14} weight="bold" />
        </button>
      )}
    </div>
  )
}

/* ── Desvanecido al pie ─────────────────────────────────────────────────── */

export type DesvanecidoProps = {
  children: ReactNode
  /** Alto máximo de la caja con scroll (px o clase). */
  alto?: number
  className?: string
  /** Rótulo accesible de la región con scroll. */
  rotulo?: string
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}

/**
 * Caja con scroll que termina en una máscara de 32 px en lugar de un corte seco.
 * Arriba aparece cuando ya bajaste; abajo se va cuando llegás al final.
 */
export function Desvanecido({ children, alto = 320, className, rotulo, onScroll }: DesvanecidoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [bordes, setBordes] = useState({ arriba: false, abajo: false })

  function medir() {
    const el = ref.current
    if (!el) return
    setBordes({ arriba: el.scrollTop > 2, abajo: el.scrollTop + el.clientHeight < el.scrollHeight - 2 })
  }
  useLayoutEffect(() => {
    medir()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const mascara = `linear-gradient(to bottom, ${bordes.arriba ? 'transparent' : '#000'} 0, #000 32px, #000 calc(100% - 32px), ${bordes.abajo ? 'transparent' : '#000'} 100%)`
  return (
    <div
      ref={ref}
      role="region"
      aria-label={rotulo}
      tabIndex={0}
      onScroll={(e) => {
        medir()
        onScroll?.(e)
      }}
      style={{ maxHeight: alto, maskImage: mascara, WebkitMaskImage: mascara }}
      className={cx('overflow-y-auto overscroll-contain', FOCO, className)}
    >
      {children}
    </div>
  )
}

/* ── FLIP: filtrar u ordenar sin parpadeo ───────────────────────────────── */

/**
 * Devuelve un ref para el contenedor. Cada hijo con `data-flip="<id>"` viaja a su lugar
 * nuevo en 260 ms cuando cambia `clave` (filtro u orden). Con movimiento reducido, cambio directo.
 */
export function useFlip<T extends HTMLElement>(clave: unknown) {
  const ref = useRef<T>(null)
  const antes = useRef(new Map<string, DOMRect>())
  useLayoutEffect(() => {
    const caja = ref.current
    if (!caja) return
    const hijos = [...caja.querySelectorAll<HTMLElement>('[data-flip]')]
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    for (const el of hijos) {
      const id = el.dataset.flip ?? ''
      const viejo = antes.current.get(id)
      const nuevo = el.getBoundingClientRect()
      if (reducido) continue
      if (viejo) {
        const dy = viejo.top - nuevo.top
        if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' })
      } else {
        el.animate([{ opacity: 0, transform: 'scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.23,1,.32,1)' })
      }
    }
    antes.current = new Map(hijos.map((el) => [el.dataset.flip ?? '', el.getBoundingClientRect()]))
  }, [clave])
  return ref
}
