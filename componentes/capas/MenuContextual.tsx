'use client'
/**
 * Menú contextual: clic derecho (o mantener apretado en celular, o Shift+F10 / tecla Menú)
 * sobre una fila, tarjeta o archivo abre las acciones de ESA cosa.
 *
 * - Grupos separados por divisor; lo destructivo va último y en rojo.
 * - Cada ítem: ícono, texto y atajo a la derecha. Lo apagado dice por qué (title).
 * - ↑ ↓ Inicio Fin mueven, Enter ejecuta, Esc cierra y devuelve el foco. Nunca sale de la pantalla.
 * - Repite acciones que también están en un botón visible: es atajo, no el único camino.
 *
 *   <MenuContextual etiqueta="Acciones de FAC-01102" grupos={[[{ texto: 'Abrir', icono: ArrowSquareOutIcon, hacer }],
 *     [{ texto: 'Anular', icono: XCircleIcon, peligro: true, hacer: anular }]]}>
 *     <tr tabIndex={0}>…</tr>
 *   </MenuContextual>
 */
import { cloneElement, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Icon } from '@phosphor-icons/react'
import { cn, FOCO } from './compartido'

export type ItemContextual = {
  texto: string
  icono?: Icon
  atajo?: string
  peligro?: boolean
  /** Si viene, el ítem queda apagado y este texto dice por qué. */
  apagado?: string
  hacer: () => void
}

type PropsDisparador = {
  onContextMenu?: (e: MouseEvent<HTMLElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void
  onPointerUp?: (e: PointerEvent<HTMLElement>) => void
  onPointerLeave?: (e: PointerEvent<HTMLElement>) => void
}

export type MenuContextualProps = {
  children: ReactElement<PropsDisparador>
  grupos: ItemContextual[][]
  /** aria-label del menú: "Acciones de FAC-01102". */
  etiqueta: string
}

export function MenuContextual({ children, grupos, etiqueta }: MenuContextualProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const caja = useRef<HTMLDivElement>(null)
  const origen = useRef<HTMLElement | null>(null)
  const presion = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const items = grupos.flat()

  const abrir = (x: number, y: number, el: HTMLElement) => {
    origen.current = el
    setPos({ x, y })
  }
  const cerrar = () => {
    setPos(null)
    origen.current?.focus()
  }

  useLayoutEffect(() => {
    const el = caja.current
    if (!pos || !el) return
    const r = el.getBoundingClientRect()
    const x = Math.min(pos.x, window.innerWidth - r.width - 8)
    const y = Math.min(pos.y, window.innerHeight - r.height - 8)
    if (x !== pos.x || y !== pos.y) setPos({ x: Math.max(8, x), y: Math.max(8, y) })
    el.querySelector<HTMLElement>('[role=menuitem]:not([aria-disabled=true])')?.focus()
  }, [pos])

  useEffect(() => {
    if (!pos) return
    const fuera = (e: globalThis.PointerEvent) => !caja.current?.contains(e.target as Node) && setPos(null)
    const scroll = () => setPos(null)
    document.addEventListener('pointerdown', fuera)
    window.addEventListener('scroll', scroll, true)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      window.removeEventListener('scroll', scroll, true)
    }
  }, [pos])

  const disparador = cloneElement(children, {
    onContextMenu: (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      abrir(e.clientX, e.clientY, e.currentTarget)
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      children.props.onKeyDown?.(e)
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
        e.preventDefault()
        const r = e.currentTarget.getBoundingClientRect()
        abrir(r.left + 24, r.bottom - 4, e.currentTarget)
      }
    },
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      children.props.onPointerDown?.(e)
      if (e.pointerType !== 'touch') return
      const { clientX, clientY } = e
      const el = e.currentTarget
      presion.current = setTimeout(() => abrir(clientX, clientY, el), 500)
    },
    onPointerUp: () => clearTimeout(presion.current),
    onPointerLeave: () => clearTimeout(presion.current),
  })

  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    const todos = [...(caja.current?.querySelectorAll<HTMLElement>('[role=menuitem]:not([aria-disabled=true])') ?? [])]
    const i = todos.indexOf(document.activeElement as HTMLElement)
    const ir = (n: number) => todos[(n + todos.length) % todos.length]?.focus()
    if (e.key === 'ArrowDown') ir(i + 1)
    else if (e.key === 'ArrowUp') ir(i - 1)
    else if (e.key === 'Home') ir(0)
    else if (e.key === 'End') ir(todos.length - 1)
    else if (e.key === 'Escape' || e.key === 'Tab') cerrar()
    else return
    e.preventDefault()
  }

  return (
    <>
      {disparador}
      {pos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={caja}
            role="menu"
            aria-label={etiqueta}
            onKeyDown={teclas}
            style={{ left: pos.x, top: pos.y }}
            className="fixed z-50 min-w-[220px] animate-[ds-ctx_140ms_both] rounded-control border border-borde bg-superficie p-1 shadow-flotante motion-reduce:animate-none"
          >
            <style href="ds-ctx" precedence="ds">{`@keyframes ds-ctx{from{opacity:0;transform:scale(.97)}}`}</style>
            {grupos.map((g, gi) => (
              <div key={gi} role="group" className={cn(gi > 0 && 'mt-1 border-t border-divisor pt-1')}>
                {g.map((it) => {
                  const I = it.icono
                  return (
                    <div
                      key={it.texto}
                      role="menuitem"
                      tabIndex={-1}
                      aria-disabled={it.apagado ? true : undefined}
                      title={it.apagado}
                      onClick={() => {
                        if (it.apagado) return
                        setPos(null)
                        it.hacer()
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !it.apagado) {
                          e.preventDefault()
                          setPos(null)
                          it.hacer()
                        }
                      }}
                      className={cn(
                        'flex h-8 items-center gap-2.5 rounded-chip px-2.5 text-[13px] outline-none max-md:h-11',
                        it.apagado ? 'text-texto-3' : it.peligro ? 'text-rojo-texto hover:bg-rojo-fondo focus:bg-rojo-fondo' : 'text-tinta hover:bg-hover focus:bg-hover',
                        FOCO,
                      )}
                    >
                      {I && <I size={15} aria-hidden className={it.peligro ? undefined : 'text-texto-2'} />}
                      <span className="flex-1">{it.texto}</span>
                      {it.atajo && <kbd className="font-mono text-[11px] text-texto-3 max-md:hidden">{it.atajo}</kbd>}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>,
          document.body,
        )}
      {items.length === 0 && null}
    </>
  )
}
