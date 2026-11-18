'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { COLOR_TIPO, describirEvento, hm, momentoDe, type Ahora, type EventoTiempo } from './tiempo'

export type BloqueEventoProps = {
  evento: EventoTiempo
  ahora?: Ahora
  /** Alto en px que ocupa: decide si entra la segunda línea (hora) y la tercera (lugar). */
  alto?: number
  seleccionado?: boolean
  /** Sin onAbrir es un dibujo estático (div, sin cursor de mano). */
  onAbrir?: (e: EventoTiempo) => void
  className?: string
  style?: CSSProperties
  extra?: ReactNode
}

/**
 * Evento con tinte y borde (patrón 8.2): fondo del tipo al 12 %, borde izquierdo de 3 px,
 * título en el tono oscuro del tipo. Pasado = gris en bandeja; tentativo = rayado;
 * cancelado = tachado; en curso = anillo fino. Nunca relleno saturado con texto blanco.
 */
export function BloqueEvento({ evento: e, ahora, alto = 48, seleccionado, onAbrir, className, style, extra }: BloqueEventoProps) {
  const m = momentoDe(e, ahora)
  const corto = alto < 34
  const conLugar = alto >= 64 && !!e.lugar
  const pasado = m === 'pasado' && e.estado !== 'cancelado'
  const clases = cx(
    'relative flex h-full w-full min-w-0 overflow-hidden rounded-[8px] border-0 border-l-[3px] border-solid px-1.5 text-left text-xs leading-[1.3] transition-[background,box-shadow] duration-150',
    corto ? 'flex-row items-center gap-1.5 py-0' : 'flex-col gap-0.5 py-1',
    pasado || e.estado === 'cancelado'
      ? 'bg-suave text-texto-2'
      : e.estado === 'tentativo'
        ? 'bg-[repeating-linear-gradient(135deg,color-mix(in_oklch,var(--t)_13%,var(--color-superficie))_0_6px,var(--color-superficie)_6px_12px)] text-[color-mix(in_oklch,var(--t)_64%,var(--color-tinta))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--t)_35%,transparent)]'
        : 'bg-[color-mix(in_oklch,var(--t)_12%,var(--color-superficie))] text-[color-mix(in_oklch,var(--t)_64%,var(--color-tinta))]',
    onAbrir && !pasado && e.estado !== 'tentativo' && 'cursor-pointer hover:bg-[color-mix(in_oklch,var(--t)_18%,var(--color-superficie))]',
    onAbrir && (pasado || e.estado === 'cancelado') && 'cursor-pointer hover:bg-hover',
    m === 'encurso' && 'shadow-[0_0_0_1px_color-mix(in_oklch,var(--t)_45%,transparent)]',
    seleccionado && 'z-[4] shadow-[0_0_0_2px_var(--color-superficie),0_0_0_4px_color-mix(in_oklch,var(--t)_70%,transparent)]',
    onAbrir && FOCO,
    className,
  )
  const estilo = {
    '--t': COLOR_TIPO[e.tipo],
    borderLeftColor: pasado || e.estado === 'cancelado' ? 'color-mix(in oklch, var(--t) 40%, var(--color-borde-fuerte))' : 'var(--t)',
    ...style,
  } as CSSProperties
  const cuerpo = (
    <>
      <span className={cx('truncate font-medium', corto && 'max-w-[70%] flex-none', e.estado === 'cancelado' && 'line-through')}>{e.titulo}</span>
      {!e.todoElDia && (
        <span className="truncate text-[11px] tabular-nums [color:color-mix(in_oklch,var(--t)_28%,var(--color-texto-2))]">
          {hm(e.inicio)} – {hm(e.fin)}
        </span>
      )}
      {conLugar && <span className="truncate text-[11px] text-texto-2">{e.lugar}</span>}
      {extra}
    </>
  )
  if (!onAbrir) return <div className={clases} style={estilo}>{cuerpo}</div>
  return (
    <button type="button" className={clases} style={estilo} aria-label={describirEvento(e, ahora)} aria-pressed={seleccionado} onClick={() => onAbrir(e)}>
      {cuerpo}
    </button>
  )
}
