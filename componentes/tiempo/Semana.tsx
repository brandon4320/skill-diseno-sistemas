'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { BloqueEvento } from './Evento'
import { columnas, DIAS_CORTOS, diaSemana, fechaLarga, hm, numeroDia, type Ahora, type Dia, type EventoTiempo, type Minutos } from './tiempo'

export type VistaSemanaProps = {
  /** Días visibles en orden (7 para semana, 5 laborables, 1 para la vista día). */
  dias: Dia[]
  eventos: EventoTiempo[]
  /** Del server. Pinta la línea de ahora y apaga lo que ya pasó. */
  ahora?: Ahora
  /** Primera y última hora de la grilla (8 y 20 por defecto). */
  desde?: number
  hasta?: number
  /** Alto de una hora en px (48 por defecto). */
  altoHora?: number
  seleccionado?: string
  onAbrir?: (e: EventoTiempo) => void
  /** Crear en la celda (patrón 8.3): clic o Enter en un hueco de media hora. */
  onCrear?: (dia: Dia, inicio: Minutos) => void
  /** Etiqueta accesible de la grilla ("Semana del 16 al 22 de noviembre"). */
  titulo: string
  className?: string
}

/**
 * Semana con la línea de ahora (patrones 8.1, 8.3 y 8.4): columna de horas, franja de
 * "todo el día" arriba, eventos que se pisan lado a lado y una línea roja con la hora.
 * Arranca con la línea de ahora a la vista. Los fines de semana van en bandeja.
 */
export function VistaSemana({ dias, eventos, ahora, desde = 8, hasta = 20, altoHora = 48, seleccionado, onAbrir, onCrear, titulo, className }: VistaSemanaProps) {
  const scroll = useRef<HTMLDivElement>(null)
  const horas = Array.from({ length: hasta - desde }, (_, i) => desde + i)
  const alto = (hasta - desde) * altoHora
  const y = (m: Minutos) => ((m - desde * 60) / 60) * altoHora
  const todo = eventos.filter(e => e.todoElDia && dias.includes(e.dia))

  useEffect(() => {
    const s = scroll.current
    if (!s || !ahora || !dias.includes(ahora.dia)) return
    s.scrollTop = Math.max(0, y(ahora.min) - s.clientHeight / 3)
    // solo al montar: después manda el usuario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section aria-label={titulo} className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <div className="grid border-b border-borde" style={{ gridTemplateColumns: `56px repeat(${dias.length}, minmax(0,1fr))` }}>
        <span />
        {dias.map(d => {
          const hoy = d === ahora?.dia
          const finde = diaSemana(d) === 0 || diaSemana(d) === 6
          return (
            <div key={d} className={cx('flex h-11 items-center gap-1.5 border-l border-borde px-2 text-xs', finde && 'bg-suave')}>
              <span className="text-texto-3 capitalize">{DIAS_CORTOS[diaSemana(d)]}</span>
              <span className={cx('grid size-7 place-items-center rounded-full text-[13px] font-medium tabular-nums', hoy ? 'bg-tinta text-superficie' : 'text-tinta')} aria-current={hoy ? 'date' : undefined}>
                {numeroDia(d)}
              </span>
            </div>
          )
        })}
      </div>
      {todo.length > 0 && (
        <div className="grid border-b border-borde" style={{ gridTemplateColumns: `56px repeat(${dias.length}, minmax(0,1fr))` }}>
          <span className="self-center pr-2 text-right text-[11px] text-texto-3">Todo el día</span>
          {dias.map(d => (
            <div key={d} className="flex min-w-0 flex-col gap-0.5 border-l border-borde p-1">
              {todo.filter(e => e.dia === d).map(e => (
                <div key={e.id} className="h-6"><BloqueEvento evento={e} ahora={ahora} alto={24} onAbrir={onAbrir} seleccionado={e.id === seleccionado} /></div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div ref={scroll} className="max-h-[560px] overflow-y-auto">
        <div className="relative grid" style={{ gridTemplateColumns: `56px repeat(${dias.length}, minmax(0,1fr))`, height: alto }}>
          <div className="relative">
            {horas.map(h => (
              <span key={h} className="absolute right-2 -translate-y-1/2 font-mono text-[11px] text-texto-3 tabular-nums" style={{ top: (h - desde) * altoHora }}>
                {h > desde ? hm(h * 60) : ''}
              </span>
            ))}
          </div>
          {dias.map(d => (
            <ColumnaDia key={d} dia={d} eventos={eventos.filter(e => e.dia === d && !e.todoElDia)} ahora={ahora} desde={desde} hasta={hasta} altoHora={altoHora} seleccionado={seleccionado} onAbrir={onAbrir} onCrear={onCrear} />
          ))}
        </div>
      </div>
    </section>
  )
}

type ColumnaProps = Pick<VistaSemanaProps, 'eventos' | 'ahora' | 'seleccionado' | 'onAbrir' | 'onCrear'> & { dia: Dia; desde: number; hasta: number; altoHora: number }

function ColumnaDia({ dia, eventos, ahora, desde, hasta, altoHora, seleccionado, onAbrir, onCrear }: ColumnaProps) {
  const [foco, setFoco] = useState<number | null>(null)
  const y = (m: Minutos) => ((m - desde * 60) / 60) * altoHora
  const finde = diaSemana(dia) === 0 || diaSemana(dia) === 6
  const medias = Array.from({ length: (hasta - desde) * 2 }, (_, i) => desde * 60 + i * 30)
  const tecla = (ev: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const sig = ev.key === 'ArrowDown' ? i + 1 : ev.key === 'ArrowUp' ? i - 1 : null
    if (sig == null) return
    ev.preventDefault()
    const b = ev.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[data-celda]')[sig]
    b?.focus()
  }
  return (
    <div className={cx('relative border-l border-borde', finde && 'bg-suave/60')}>
      {Array.from({ length: hasta - desde }, (_, i) => (
        <span key={i} aria-hidden className="absolute inset-x-0 border-t border-divisor" style={{ top: i * altoHora }} />
      ))}
      {onCrear &&
        medias.map((m, i) => (
          <button
            key={m}
            type="button"
            data-celda
            tabIndex={foco === i || (foco == null && i === 0) ? 0 : -1}
            onFocus={() => setFoco(i)}
            onKeyDown={ev => tecla(ev, i)}
            onClick={() => onCrear(dia, m)}
            aria-label={`Crear evento el ${fechaLarga(dia)} a las ${hm(m)}`}
            className={cx('absolute inset-x-0 cursor-cell rounded-[6px] hover:bg-acento-suave/60 focus-visible:bg-acento-suave', FOCO)}
            style={{ top: y(m), height: altoHora / 2 }}
          />
        ))}
      {columnas(eventos).map(e => (
        <div
          key={e.id}
          className="absolute z-[2] p-px"
          style={{ top: y(e.inicio), height: Math.max(18, y(e.fin) - y(e.inicio)), left: `calc(${(e.col * 100) / e.cols}% + 1px)`, width: `calc(${100 / e.cols}% - 3px)` } as CSSProperties}
        >
          <BloqueEvento evento={e} ahora={ahora} alto={y(e.fin) - y(e.inicio)} onAbrir={onAbrir} seleccionado={e.id === seleccionado} />
        </div>
      ))}
      {ahora?.dia === dia && ahora.min >= desde * 60 && ahora.min <= hasta * 60 && <LineaAhora top={y(ahora.min)} hora={hm(ahora.min)} />}
    </div>
  )
}

/** Línea de ahora (patrón 8.4): roja, con punto y la hora; no tapa los clics. */
export function LineaAhora({ top, hora }: { top: number; hora: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 z-[3]" style={{ top }} role="img" aria-label={`Ahora, ${hora}`}>
      <span className="absolute inset-x-0 h-0.5 -translate-y-1/2 bg-rojo-texto" />
      <span className="absolute -left-1 size-2.5 -translate-y-1/2 rounded-full bg-rojo-texto" />
    </div>
  )
}
