'use client'
/**
 * Encabezado de columna: ícono de tipo + título, orden en ciclo (asc → desc → sin orden;
 * Mayús + clic suma criterio), ⇅ tenue solo al pasar, flecha en círculo cuando está activo,
 * y menú ⌄ (también con clic derecho): orden con ✓, filtrar, mover y "Ocultar" en rojo al final.
 * La columna fija solo ordena y filtra. Lo imposible por posición se ve apagado.
 *
 *   <th aria-sort={ariaSort(orden, 'vence')}>
 *     <EncabezadoColumna id="vence" titulo="Vence" icono={CalendarBlankIcon} orden={orden}
 *       onOrden={setOrden} onFiltrar={…} onMover={…} onOcultar={…} />
 *   </th>
 */
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import {
  ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowsDownUpIcon, CaretDownIcon,
  CheckIcon, EyeSlashIcon, FunnelSimpleIcon, LockSimpleIcon, type Icon,
} from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { ciclarOrden, type Direccion, type Orden } from './calculos'

/** Valor de aria-sort para el <th> que envuelve al encabezado. */
export function ariaSort(orden: readonly Orden[], id: string): 'ascending' | 'descending' | 'none' {
  const o = orden.find((x) => x.id === id)
  return o ? (o.dir === 'asc' ? 'ascending' : 'descending') : 'none'
}

export type EncabezadoColumnaProps = {
  id: string
  titulo: string
  /** Un único mapa tipo → ícono para todo el sistema (calendario para fechas, persona para responsables). */
  icono?: Icon
  /** Montos y números: el título se alinea a la derecha. */
  derecha?: boolean
  orden: readonly Orden[]
  onOrden?: (orden: Orden[]) => void
  /** Columna identificadora pegada: candado, solo ordena y filtra. */
  fija?: boolean
  onFiltrar?: () => void
  /** Sin `puedeIzquierda`/`puedeDerecha` el ítem queda apagado, no desaparece. */
  onMover?: (lado: 'izquierda' | 'derecha') => void
  puedeIzquierda?: boolean
  puedeDerecha?: boolean
  onOcultar?: () => void
}

export function EncabezadoColumna({
  id, titulo, icono: Icono, derecha, orden, onOrden, fija, onFiltrar, onMover,
  puedeIzquierda = true, puedeDerecha = true, onOcultar,
}: EncabezadoColumnaProps) {
  const [menu, setMenu] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const idMenu = useId()
  const k = orden.findIndex((o) => o.id === id)
  const dir: Direccion | null = k >= 0 ? orden[k].dir : null
  const tieneMenu = Boolean(onOrden || onFiltrar || (!fija && (onMover || onOcultar)))

  useEffect(() => {
    if (!menu) return
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setMenu(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', fuera); document.removeEventListener('keydown', esc) }
  }, [menu])

  const elegir = (d: Direccion | null) => {
    if (!onOrden) return
    onOrden(d ? [{ id, dir: d }] : orden.filter((o) => o.id !== id))
    setMenu(false)
  }
  const derechoClic = (e: MouseEvent) => { if (tieneMenu) { e.preventDefault(); setMenu(true) } }

  const Flecha = dir === 'asc' ? ArrowUpIcon : ArrowDownIcon
  const contenido = (
    <>
      {Icono && <Icono size={14} aria-hidden className="shrink-0 text-texto-3" />}
      <span className="min-w-0 truncate">{titulo}</span>
      {fija && <LockSimpleIcon size={12} aria-hidden className="shrink-0 text-texto-3" />}
      {onOrden && (
        <span
          aria-hidden
          className={cx(
            'grid size-[18px] shrink-0 place-items-center rounded-full transition-opacity duration-150',
            dir ? 'border border-borde-fuerte text-tinta opacity-100' : 'text-texto-3 opacity-0 group-hover/enc:opacity-100 group-focus-visible/enc:opacity-100',
          )}
        >
          {dir ? <Flecha size={10} weight="bold" /> : <ArrowsDownUpIcon size={12} />}
        </span>
      )}
      {onOrden && orden.length > 1 && k >= 0 && <span className="text-[11px] text-texto-3 tabular-nums">{k + 1}</span>}
    </>
  )

  const item = 'flex w-full items-center gap-2 rounded-chip px-2.5 py-1.5 text-left text-[13px] text-tinta hover:bg-hover disabled:pointer-events-none disabled:text-texto-3 max-md:min-h-11'

  return (
    <div ref={caja} className={cx('relative flex h-9 items-center gap-1 text-xs font-medium text-texto-2 max-md:h-11', derecha && 'flex-row-reverse')} onContextMenu={derechoClic}>
      {onOrden ? (
        <button
          type="button"
          onClick={(e) => onOrden(ciclarOrden(orden, id, e.shiftKey))}
          title="Ordenar (Mayús + clic suma un criterio)"
          className={cx('group/enc inline-flex h-7 min-w-0 items-center gap-1.5 rounded-chip', derecha && 'flex-row-reverse', dir && 'text-tinta', 'max-md:min-h-11 max-md:min-w-11', FOCO)}
        >
          {contenido}
        </button>
      ) : (
        <span className={cx('inline-flex min-w-0 items-center gap-1.5', derecha && 'flex-row-reverse')}>{contenido}</span>
      )}
      {tieneMenu && (
        <button
          type="button"
          aria-label={`Opciones de ${titulo}`}
          aria-haspopup="menu"
          aria-expanded={menu}
          aria-controls={idMenu}
          onClick={() => setMenu((m) => !m)}
          className={cx('grid size-[22px] shrink-0 place-items-center rounded-[7px] text-texto-3 opacity-0 transition-opacity hover:bg-suave hover:text-tinta focus-visible:opacity-100 aria-expanded:opacity-100 [@media(hover:none)]:opacity-100 [th:hover_&]:opacity-100 max-md:size-11', FOCO)}
        >
          <CaretDownIcon size={12} aria-hidden />
        </button>
      )}
      {menu && (
        <div id={idMenu} role="menu" className={cx('absolute top-full z-30 mt-1 w-56 rounded-control border border-borde bg-superficie p-1.5 font-normal shadow-flotante', derecha ? 'right-0' : 'left-0')}>
          {onOrden && (
            <>
              <button type="button" role="menuitemradio" aria-checked={dir === 'asc'} className={item} onClick={() => elegir('asc')}>
                <ArrowUpIcon size={14} aria-hidden className="text-texto-3" /> <span className="flex-1">Ascendente</span>
                {dir === 'asc' && <CheckIcon size={14} weight="bold" aria-hidden />}
              </button>
              <button type="button" role="menuitemradio" aria-checked={dir === 'desc'} className={item} onClick={() => elegir('desc')}>
                <ArrowDownIcon size={14} aria-hidden className="text-texto-3" /> <span className="flex-1">Descendente</span>
                {dir === 'desc' && <CheckIcon size={14} weight="bold" aria-hidden />}
              </button>
            </>
          )}
          {onFiltrar && (
            <button type="button" role="menuitem" className={item} onClick={() => { onFiltrar(); setMenu(false) }}>
              <FunnelSimpleIcon size={14} aria-hidden className="text-texto-3" /> Filtrar esta columna
            </button>
          )}
          {!fija && onMover && (
            <>
              <div role="separator" className="my-1 h-px bg-divisor" />
              <button type="button" role="menuitem" className={item} disabled={!puedeIzquierda} onClick={() => { onMover('izquierda'); setMenu(false) }}>
                <ArrowLeftIcon size={14} aria-hidden className="text-texto-3" /> Mover a la izquierda
              </button>
              <button type="button" role="menuitem" className={item} disabled={!puedeDerecha} onClick={() => { onMover('derecha'); setMenu(false) }}>
                <ArrowRightIcon size={14} aria-hidden className="text-texto-3" /> Mover a la derecha
              </button>
            </>
          )}
          {!fija && onOcultar && (
            <>
              <div role="separator" className="my-1 h-px bg-divisor" />
              <button type="button" role="menuitem" className={cx(item, 'text-rojo-texto')} onClick={() => { onOcultar(); setMenu(false) }}>
                <EyeSlashIcon size={14} aria-hidden /> Ocultar columna
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
