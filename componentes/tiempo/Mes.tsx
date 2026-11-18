'use client'

import type { CSSProperties } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { COLOR_TIPO, DIAS_CORTOS, describirEvento, diaSemana, fechaLarga, grillaMes, hm, mesDe, momentoDe, numeroDia, type Ahora, type Dia, type EventoTiempo } from './tiempo'

export type VistaMesProps = {
  /** Cualquier día del mes a mostrar. */
  mes: Dia
  eventos: EventoTiempo[]
  ahora?: Ahora
  /** Píldoras por celda antes del "+N más" (3 por defecto). */
  maximo?: number
  onAbrir?: (e: EventoTiempo) => void
  /** "+N más" y el número del día abren el día. */
  onVerDia?: (d: Dia) => void
  className?: string
}

/**
 * Mes con píldoras (patrón 8.6): cada evento es una píldora con punto del tipo y hora,
 * los de todo el día van rellenos. Lo que no entra se resume en "+N más", nunca se corta.
 */
export function VistaMes({ mes, eventos, ahora, maximo = 3, onAbrir, onVerDia, className }: VistaMesProps) {
  const celdas = grillaMes(mes)
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <div className="grid grid-cols-7 border-b border-borde">
        {[1, 2, 3, 4, 5, 6, 0].map(i => (
          <span key={i} className="px-2 py-2 text-[11px] font-medium text-texto-3 capitalize">{DIAS_CORTOS[i]}</span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {celdas.map((d, i) => {
          const delDia = eventos.filter(e => e.dia === d).sort((a, b) => Number(!!b.todoElDia) - Number(!!a.todoElDia) || a.inicio - b.inicio)
          const visibles = delDia.slice(0, delDia.length > maximo ? maximo - 1 : maximo)
          const resto = delDia.length - visibles.length
          const otro = mesDe(d) !== mesDe(mes)
          const hoy = d === ahora?.dia
          const finde = diaSemana(d) === 0 || diaSemana(d) === 6
          return (
            <div key={d} className={cx('flex min-h-[112px] min-w-0 flex-col gap-0.5 p-1', i % 7 !== 0 && 'border-l border-borde', i >= 7 && 'border-t border-borde', (finde || otro) && 'bg-suave/60')}>
              <button
                type="button"
                onClick={() => onVerDia?.(d)}
                aria-label={`Ver el ${fechaLarga(d)}`}
                aria-current={hoy ? 'date' : undefined}
                className={cx('mb-0.5 grid size-6 place-items-center self-start rounded-full text-xs font-medium tabular-nums', FOCO, hoy ? 'bg-tinta text-superficie' : otro ? 'font-normal text-texto-3' : 'text-tinta hover:bg-suave')}
              >
                {numeroDia(d)}
              </button>
              {visibles.map(e => <Pildora key={e.id} evento={e} ahora={ahora} onAbrir={onAbrir} />)}
              {resto > 0 && (
                <button type="button" onClick={() => onVerDia?.(d)} className={cx('h-5 self-start rounded-[6px] px-1.5 text-[11px] font-medium text-texto-2 hover:bg-suave hover:text-tinta', FOCO)}>
                  +{resto} más
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Pildora({ evento: e, ahora, onAbrir }: { evento: EventoTiempo; ahora?: Ahora; onAbrir?: (e: EventoTiempo) => void }) {
  const pasado = momentoDe(e, ahora) === 'pasado'
  const estilo = { '--t': COLOR_TIPO[e.tipo] } as CSSProperties
  const clases = cx(
    'flex h-5 w-full min-w-0 items-center gap-1 rounded-[6px] px-1.5 text-left text-[11px]',
    e.todoElDia ? 'bg-[color-mix(in_oklch,var(--t)_14%,var(--color-superficie))] font-medium text-[color-mix(in_oklch,var(--t)_64%,var(--color-tinta))]' : 'text-tinta hover:bg-suave',
    pasado && 'text-texto-3',
    e.estado === 'cancelado' && 'line-through',
    onAbrir && FOCO,
  )
  const cuerpo = (
    <>
      {!e.todoElDia && <span aria-hidden className="size-1.5 flex-none rounded-full bg-(--t)" />}
      {!e.todoElDia && <span className="flex-none text-texto-3 tabular-nums">{hm(e.inicio)}</span>}
      <span className="truncate">{e.titulo}</span>
    </>
  )
  return onAbrir ? (
    <button type="button" className={clases} style={estilo} onClick={() => onAbrir(e)} aria-label={describirEvento(e, ahora)}>
      {cuerpo}
    </button>
  ) : (
    <div className={clases} style={estilo}>{cuerpo}</div>
  )
}
