'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { CaretUpDownIcon, CheckIcon, PlusIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Selector de empresa (01-navegacion · 03): la empresa activa siempre arriba con su CUIT truncado
 * al medio; ⇅ abre la lista. Una a la vez con radio o varias a la vez con casillas (cada una con su
 * color). Esc cierra y devuelve el foco; ↑↓ recorren.
 */
export type Empresa = { id: string; nombre: string; cuit: string; color: string; icono: Icon }

export type SelectorEmpresaProps = {
  empresas: readonly Empresa[]
  /** Ids visibles. Uno = una empresa activa; dos o más = vista combinada. */
  seleccion: readonly string[]
  onCambio: (ids: string[]) => void
  /** Permite tildar varias a la vez. */
  varias?: boolean
  onAgregar?: () => void
}

export const cuitCorto = (c: string) => `CUIT ${c.slice(0, 5)}…${c.slice(-2)}`

function Logo({ e, chico }: { e: Empresa; chico?: boolean }) {
  const I = e.icono
  return (
    <span style={{ background: e.color }} className={cx('grid shrink-0 place-items-center rounded-chip text-white ring-2 ring-superficie', chico ? 'size-5' : 'size-7')}>
      <I weight="fill" className={chico ? 'size-3' : 'size-4'} />
    </span>
  )
}

export function SelectorEmpresa({ empresas, seleccion, onCambio, varias = false, onAgregar }: SelectorEmpresaProps) {
  const [abierto, setAbierto] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const activas = empresas.filter(e => seleccion.includes(e.id))
  const nombre = activas.length > 1 ? `${activas.length} empresas` : activas[0]?.nombre ?? 'Elegí empresa'
  const detalle = activas.length > 1 ? activas.map(e => e.nombre).join(' + ') : activas[0] ? cuitCorto(activas[0].cuit) : ''

  useEffect(() => {
    if (!abierto) return
    panel.current?.querySelector<HTMLElement>('[aria-checked=true],[role^=menuitem]')?.focus()
    const fuera = (e: PointerEvent) => { if (!panel.current?.contains(e.target as Node) && !boton.current?.contains(e.target as Node)) setAbierto(false) }
    document.addEventListener('pointerdown', fuera)
    return () => document.removeEventListener('pointerdown', fuera)
  }, [abierto])

  const cerrar = () => { setAbierto(false); boton.current?.focus() }
  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const its = [...(panel.current?.querySelectorAll<HTMLElement>('[role^=menuitem]') ?? [])]
    const i = its.indexOf(document.activeElement as HTMLElement)
    its[(i + (e.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length]?.focus()
  }
  const alternar = (eid: string) => {
    const s = new Set(seleccion)
    if (s.has(eid)) { if (s.size > 1) s.delete(eid) } else s.add(eid)
    onCambio([...s])
  }

  return (
    <div className="relative">
      <button
        ref={boton}
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={`Empresa: ${nombre}. Cambiar`}
        onClick={() => setAbierto(v => !v)}
        className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-control p-1.5 text-left hover:bg-hover', FOCO)}
      >
        <span className="flex -space-x-2">{activas.slice(0, 3).map(e => <Logo key={e.id} e={e} />)}</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-semibold text-tinta">{nombre}</b>
          <small className="block truncate font-mono text-[11px] text-texto-3" title={activas.length === 1 ? `CUIT ${activas[0].cuit}` : undefined}>{detalle}</small>
        </span>
        <CaretUpDownIcon className="size-4 text-texto-3" aria-hidden />
      </button>
      {abierto && (
        <div ref={panel} id={id} role="menu" aria-label="Empresas" onKeyDown={teclas} className="absolute top-full left-0 z-40 mt-1.5 w-72 rounded-tarjeta border border-borde bg-superficie p-1.5 shadow-flotante">
          {empresas.map(e => {
            const on = seleccion.includes(e.id) && (varias || seleccion.length === 1)
            return (
              <button
                key={e.id}
                type="button"
                role={varias ? 'menuitemcheckbox' : 'menuitemradio'}
                aria-checked={on}
                onClick={() => (varias ? alternar(e.id) : (onCambio([e.id]), cerrar()))}
                className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2 py-1.5 text-left hover:bg-hover', FOCO)}
              >
                {varias && (
                  <span className={cx('grid size-4 place-items-center rounded-[5px] border', on ? 'border-tinta bg-tinta text-superficie' : 'border-borde-fuerte')} aria-hidden>
                    {on && <CheckIcon weight="bold" className="size-3" />}
                  </span>
                )}
                <Logo e={e} chico />
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[13px] font-medium text-tinta">{e.nombre}</b>
                  <small className="block font-mono text-[11px] text-texto-3">{cuitCorto(e.cuit)}</small>
                </span>
                {!varias && on && <CheckIcon weight="bold" className="size-4 text-tinta" aria-hidden />}
              </button>
            )
          })}
          {onAgregar && (
            <>
              <div className="my-1 h-px bg-divisor" />
              <button type="button" role="menuitem" onClick={() => { cerrar(); onAgregar() }} className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2 py-1.5 text-[13px] text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
                <PlusIcon className="size-4" aria-hidden />Agregar empresa
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
