'use client'

import { CheckIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { duracion, fechaHablada, huecos, hm, type Dia, type EventoTiempo, type Minutos } from './tiempo'

export type HuecoElegido = { dia: Dia; inicio: Minutos; fin: Minutos }

export type ReprogramarHuecosProps = {
  /** Días donde buscar (por ejemplo los próximos 3 hábiles). */
  dias: Dia[]
  /** Lo ya agendado de todos los que tienen que ir. */
  ocupado: EventoTiempo[]
  /** Duración del evento a mover. */
  duracionMin: Minutos
  /** Horario laboral (9 a 18 por defecto). */
  desde?: number
  hasta?: number
  /** Del server. */
  hoy: Dia
  valor?: HuecoElegido
  onElegir: (h: HuecoElegido) => void
  className?: string
}

/**
 * Reprogramar con huecos libres (patrón 8.18): en vez de una grilla vacía, la lista de horarios
 * en que todos pueden, de a media hora, agrupados por día. Un toque elige; nada se mueve
 * hasta que el usuario confirma afuera de esta pieza.
 */
export function ReprogramarHuecos({ dias, ocupado, duracionMin, desde = 9, hasta = 18, hoy, valor, onElegir, className }: ReprogramarHuecosProps) {
  return (
    <div className={cx('flex flex-col gap-4', className)}>
      {dias.map(d => {
        const libres = huecos(ocupado.filter(e => e.dia === d && !e.todoElDia), desde * 60, hasta * 60, duracionMin)
        const opciones = libres.flatMap(h => {
          const r: Minutos[] = []
          for (let m = Math.ceil(h.inicio / 30) * 30; m + duracionMin <= h.fin; m += 30) r.push(m)
          return r
        })
        return (
          <section key={d} aria-label={fechaHablada(d, hoy)} className="flex flex-col gap-1.5">
            <h4 className="flex items-baseline gap-2 text-xs font-medium text-texto-2">
              {fechaHablada(d, hoy)}
              <span className="font-normal text-texto-3">{opciones.length ? `${opciones.length} horarios` : 'Sin lugar'}</span>
            </h4>
            {opciones.length > 0 && (
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Horarios libres, ${fechaHablada(d, hoy)}`}>
                {opciones.map(m => {
                  const sel = valor?.dia === d && valor.inicio === m
                  return (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      aria-label={`${fechaHablada(d, hoy)}, ${hm(m)} a ${hm(m + duracionMin)}`}
                      onClick={() => onElegir({ dia: d, inicio: m, fin: m + duracionMin })}
                      className={cx(
                        'inline-flex h-8 items-center gap-1.5 rounded-chip border px-2.5 font-mono text-xs tabular-nums transition-colors duration-150 max-md:h-11',
                        FOCO,
                        sel ? 'border-tinta bg-tinta text-superficie' : 'border-borde bg-superficie text-tinta hover:bg-suave',
                      )}
                    >
                      {sel && <CheckIcon size={12} weight="bold" aria-hidden />}
                      {hm(m)}
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
      <p className="text-xs text-texto-3">Duración {duracion(duracionMin)} · horario {hm(desde * 60)} a {hm(hasta * 60)}</p>
    </div>
  )
}
