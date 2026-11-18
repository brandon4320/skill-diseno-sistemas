'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Navegación superior para pocas secciones (01-navegacion · 17): con 5 secciones o menos, pastillas
 * de 40 px arriba, la activa invertida y deslizándose; el buscador es otra pastilla y los íconos van
 * en círculos. En celular, las pastillas se deslizan de costado.
 */
export type SeccionSuperior = { id: string; texto: string; href: string }

export type NavSuperiorProps = {
  marca: ReactNode
  secciones: readonly SeccionSuperior[]
  activa: string
  onBuscar?: () => void
  /** Botones redondos de la derecha (avisos, usuario). */
  acciones?: ReactNode
}

export function NavSuperior({ marca, secciones, activa, onBuscar, acciones }: NavSuperiorProps) {
  const riel = useRef<HTMLUListElement>(null)
  const [p, setP] = useState<{ x: number; w: number; animar: boolean } | null>(null)
  useLayoutEffect(() => {
    const medir = (animar: boolean) => {
      const a = riel.current?.querySelector<HTMLElement>('[aria-current=page]')
      setP(a ? { x: a.offsetLeft, w: a.offsetWidth, animar } : null)
    }
    medir(p !== null)
    const ro = new ResizeObserver(() => medir(false))
    if (riel.current) ro.observe(riel.current)
    return () => ro.disconnect()
  }, [activa]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <header className="flex items-center gap-3">
      <div className="shrink-0">{marca}</div>
      <nav aria-label="Secciones" className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] md:flex md:justify-center">
        <ul ref={riel} className="relative flex w-max gap-1 rounded-full bg-suave p-1">
          {p && (
            <li aria-hidden style={{ width: p.w, transform: `translateX(${p.x - 4}px)` }} className={cx('absolute top-1 left-1 h-10 rounded-full bg-tinta', p.animar && 'transition-[transform,width] duration-[240ms] ease-(--ease) motion-reduce:transition-none')} />
          )}
          {secciones.map(s => {
            const on = s.id === activa
            return (
              <li key={s.id} className="relative">
                <a href={s.href} aria-current={on ? 'page' : undefined} className={cx('inline-flex h-10 items-center rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-[240ms]', on ? 'text-superficie' : 'text-texto-2 hover:text-tinta', FOCO)}>
                  {s.texto}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex shrink-0 items-center gap-1.5">
        {onBuscar && (
          <button type="button" onClick={onBuscar} aria-label="Buscar" className={cx('inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-suave px-3 text-[13px] text-texto-2 hover:text-tinta md:px-4', FOCO)}>
            <MagnifyingGlassIcon className="size-4" aria-hidden /><span className="hidden md:inline">Buscar</span>
            <kbd className="hidden rounded-[5px] bg-superficie px-1.5 font-mono text-[11px] text-texto-3 lg:inline">⌘K</kbd>
          </button>
        )}
        {acciones}
      </div>
    </header>
  )
}

/** Botón redondo para la derecha de la barra (avisos, ayuda). */
export function BotonCirculo({ etiqueta, children, punto, onClick }: { etiqueta: string; children: ReactNode; punto?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={etiqueta + (punto ? ' (hay nuevos)' : '')} className={cx('relative grid size-10 cursor-pointer place-items-center rounded-full bg-suave text-texto-2 hover:text-tinta', FOCO)}>
      {children}
      {punto && <span className="absolute top-2 right-2 size-2 rounded-full bg-rojo-texto ring-2 ring-suave" aria-hidden />}
    </button>
  )
}
