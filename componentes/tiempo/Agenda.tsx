'use client'

import type { CSSProperties } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { COLOR_TIPO, describirEvento, duracion, fechaHablada, hm, iniciales, momentoDe, relativo, type Ahora, type EventoTiempo } from './tiempo'

export type AgendaListaProps = {
  eventos: EventoTiempo[]
  ahora: Ahora
  onAbrir?: (e: EventoTiempo) => void
  /** Pinta la línea de ahora entre el último que pasó y el próximo. */
  lineaAhora?: boolean
  className?: string
}

/**
 * Agenda en lista (patrón 8.9): agrupada por día ("Hoy", "Mañana", "jue 20 nov"), hora en mono,
 * raya del tipo, título y lugar, y a la derecha lo que importa ahora: "quedan 20 min",
 * "en 15 min", la duración o "Sin confirmar". La lista es la vista natural del celular.
 */
export function AgendaLista({ eventos, ahora, onAbrir, lineaAhora = true, className }: AgendaListaProps) {
  const orden = [...eventos].sort((a, b) => a.dia.localeCompare(b.dia) || Number(!!b.todoElDia) - Number(!!a.todoElDia) || a.inicio - b.inicio)
  const dias = [...new Set(orden.map(e => e.dia))]
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      {dias.map(d => {
        const del = orden.filter(e => e.dia === d)
        const corte = d === ahora.dia ? del.findIndex(e => !e.todoElDia && momentoDe(e, ahora) !== 'pasado') : -1
        return (
          <section key={d} aria-label={fechaHablada(d, ahora.dia)}>
            <h3 className="sticky top-0 z-[1] bg-superficie px-4 pb-1.5 pt-4 text-xs font-medium text-texto-2">{fechaHablada(d, ahora.dia)}</h3>
            <ul>
              {del.map((e, i) => (
                <li key={e.id}>
                  {lineaAhora && i === corte && (
                    <div role="img" aria-label={`Ahora, ${hm(ahora.min)}`} className="relative mx-4 h-0">
                      <span className="absolute inset-x-0 h-0.5 -translate-y-1/2 bg-rojo-texto" />
                      <span className="absolute -left-1 size-2.5 -translate-y-1/2 rounded-full bg-rojo-texto" />
                    </div>
                  )}
                  <FilaAgenda evento={e} ahora={ahora} onAbrir={onAbrir} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function FilaAgenda({ evento: e, ahora, onAbrir }: { evento: EventoTiempo; ahora: Ahora; onAbrir?: (e: EventoTiempo) => void }) {
  const m = momentoDe(e, ahora)
  const der =
    m === 'encurso' ? (
      <span className="inline-flex h-6 items-center gap-1.5 rounded-chip bg-azul-fondo px-2 text-xs font-medium text-azul-texto">
        <span className="size-1.5 rounded-full bg-azul-texto" />quedan {relativo(e.fin - ahora.min).replace('en ', '')}
      </span>
    ) : m === 'futuro' && e.dia === ahora.dia && e.inicio - ahora.min <= 60 ? (
      <span className="inline-flex h-6 items-center rounded-chip bg-ambar-fondo px-2 text-xs font-medium text-ambar-texto">{relativo(e.inicio - ahora.min)}</span>
    ) : e.estado === 'tentativo' ? (
      <span className="inline-flex h-6 items-center rounded-chip border border-borde px-2 text-xs text-texto-2">Sin confirmar</span>
    ) : !e.todoElDia ? (
      <span className="text-xs text-texto-3 tabular-nums">{duracion(e.fin - e.inicio)}</span>
    ) : null
  const clases = cx(
    'grid min-h-[60px] w-full grid-cols-[56px_3px_minmax(0,1fr)_auto] items-center gap-x-3 border-t border-divisor px-4 py-2 text-left',
    onAbrir && cx('cursor-pointer hover:bg-hover', FOCO),
    m === 'pasado' && '[&_b]:font-normal [&_b]:text-texto-2',
  )
  const cuerpo = (
    <>
      <span className="flex flex-col font-mono text-xs leading-[1.35] text-tinta tabular-nums">
        {e.todoElDia ? <>Todo<small className="text-[11px] text-texto-3">el día</small></> : <>{hm(e.inicio)}<small className="text-[11px] text-texto-3">{hm(e.fin)}</small></>}
      </span>
      <span aria-hidden className="self-stretch rounded-[3px] bg-(--t)" style={{ '--t': m === 'pasado' ? 'var(--color-borde-fuerte)' : COLOR_TIPO[e.tipo] } as CSSProperties} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <b className={cx('truncate text-sm font-medium text-tinta', e.estado === 'cancelado' && 'line-through')}>{e.titulo}</b>
        {e.lugar && <span className="truncate text-xs text-texto-3">{e.lugar}</span>}
      </span>
      <span className="flex items-center gap-2 max-sm:hidden">
        {der}
        {e.personas?.length ? (
          <span className="flex">
            {e.personas.slice(0, 3).map(p => (
              <span key={p} title={p} className="-ml-1.5 grid size-6 place-items-center rounded-full border-2 border-superficie bg-suave text-[11px] font-medium text-texto-2 first:ml-0">{iniciales(p)}</span>
            ))}
          </span>
        ) : null}
      </span>
    </>
  )
  return onAbrir ? (
    <button type="button" className={clases} onClick={() => onAbrir(e)} aria-label={describirEvento(e, ahora)}>{cuerpo}</button>
  ) : (
    <div className={clases}>{cuerpo}</div>
  )
}
