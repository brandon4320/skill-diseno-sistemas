'use client'

import { useState, type FormEvent } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Paginación (01-navegacion · 18): "1–25 de 312" a la izquierda; páginas con elipsis, la actual
 * invertida, ‹ › apagados solo en los extremos, cuántas por página e "Ir a". En celular, "‹ 3 de 13 ›".
 * Mientras llega la página nueva, dejá lo anterior a la vista (cargando = true lo marca, no lo borra).
 */
export type PaginacionProps = {
  pagina: number
  total: number
  porPagina: number
  onPagina: (n: number) => void
  opcionesPorPagina?: readonly number[]
  onPorPagina?: (n: number) => void
  cargando?: boolean
}

const fmt = new Intl.NumberFormat('es-AR')

export function paginasConElipsis(actual: number, ultima: number): (number | '…')[] {
  if (ultima <= 7) return Array.from({ length: ultima }, (_, i) => i + 1)
  const r: (number | '…')[] = [1]
  const desde = Math.max(2, Math.min(actual - 1, ultima - 4)), hasta = Math.min(ultima - 1, Math.max(actual + 1, 5))
  if (desde > 2) r.push('…')
  for (let i = desde; i <= hasta; i++) r.push(i)
  if (hasta < ultima - 1) r.push('…')
  r.push(ultima)
  return r
}

export function Paginacion({ pagina, total, porPagina, onPagina, opcionesPorPagina = [25, 50, 100], onPorPagina, cargando }: PaginacionProps) {
  const ultima = Math.max(1, Math.ceil(total / porPagina))
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1, hasta = Math.min(total, pagina * porPagina)
  const [ir, setIr] = useState('')
  const flecha = 'grid size-8 cursor-pointer place-items-center rounded-control text-texto-2 hover:bg-hover hover:text-tinta disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent pointer-coarse:size-11'
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(ir)
    if (Number.isInteger(n) && n >= 1 && n <= ultima) { onPagina(n); setIr('') }
  }
  return (
    <nav aria-label="Paginación" aria-busy={cargando || undefined} className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-texto-2">
      <p className="font-mono text-xs tabular-nums">{fmt.format(desde)}–{fmt.format(hasta)} de {fmt.format(total)}</p>
      <div className="flex items-center gap-1">
        <button type="button" className={cx(flecha, FOCO)} disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)} aria-label="Página anterior"><CaretLeftIcon className="size-4" /></button>
        <span className="px-2 font-mono text-xs tabular-nums sm:hidden" aria-live="polite">{pagina} de {ultima}</span>
        <ul className="hidden items-center gap-1 sm:flex">
          {paginasConElipsis(pagina, ultima).map((n, i) => (
            <li key={i}>
              {n === '…' ? (
                <span className="grid size-8 place-items-center text-texto-3" aria-hidden>…</span>
              ) : (
                <button type="button" onClick={() => onPagina(n)} aria-current={n === pagina ? 'page' : undefined} aria-label={`Página ${n}`} className={cx('grid h-8 min-w-8 cursor-pointer place-items-center rounded-control px-1.5 font-mono text-xs tabular-nums', n === pagina ? 'bg-tinta text-superficie' : 'hover:bg-hover hover:text-tinta', FOCO)}>
                  {n}
                </button>
              )}
            </li>
          ))}
        </ul>
        <button type="button" className={cx(flecha, FOCO)} disabled={pagina >= ultima} onClick={() => onPagina(pagina + 1)} aria-label="Página siguiente"><CaretRightIcon className="size-4" /></button>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        {onPorPagina && (
          <label className="flex items-center gap-1.5 text-xs">
            Por página
            <select value={porPagina} onChange={e => onPorPagina(Number(e.target.value))} className={cx('h-8 cursor-pointer rounded-control border border-borde bg-superficie px-2 font-mono text-xs text-tinta', FOCO)}>
              {opcionesPorPagina.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        )}
        <form onSubmit={enviar} className="flex items-center gap-1.5 text-xs">
          <label htmlFor="pag-ir">Ir a</label>
          <input id="pag-ir" inputMode="numeric" value={ir} onChange={e => setIr(e.target.value.replace(/\D/g, ''))} className={cx('h-8 w-12 rounded-control border border-borde bg-superficie px-2 text-center font-mono text-xs text-tinta', FOCO)} />
        </form>
      </div>
    </nav>
  )
}
