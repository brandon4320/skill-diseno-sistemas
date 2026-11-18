'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ClockIcon, MapPinIcon, TimerIcon, VideoCameraIcon } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { duracion, hm, iniciales, relativo, type Ahora, type EventoTiempo, type Minutos } from './tiempo'

export type ChipHoraProps = {
  inicio: Minutos
  fin?: Minutos
  /** Pinta la duración al lado ("1 h 30 min"). */
  conDuracion?: boolean
  className?: string
}

/** Chip de hora y duración (patrón 8.14): "14:00 – 15:30 · 1 h 30 min", mono y tabular. */
export function ChipHora({ inicio, fin, conDuracion = true, className }: ChipHoraProps) {
  return (
    <span className={cx('inline-flex h-7 items-center gap-1.5 rounded-chip border border-borde bg-superficie px-2 text-xs text-tinta', className)}>
      <ClockIcon size={14} className="text-texto-3" aria-hidden />
      <span className="font-mono tabular-nums">{hm(inicio)}{fin != null && <> – {hm(fin)}</>}</span>
      {fin != null && conDuracion && <span className="text-texto-3">· {duracion(fin - inicio)}</span>}
    </span>
  )
}

/** Minutos que avanza el reloj desde que se montó (cada 30 s). Arranca en el `ahora` del server. */
function useMinutos(base: Minutos) {
  const [m, setM] = useState(base)
  useEffect(() => {
    const t0 = Date.now()
    setM(base)
    const id = setInterval(() => setM(base + (Date.now() - t0) / 60000), 30000)
    return () => clearInterval(id)
  }, [base])
  return m
}

export type CuentaRegresivaProps = {
  /** Minuto objetivo del día. */
  hasta: Minutos
  /** Minuto actual del server. */
  ahora: Minutos
  /** A partir de cuántos minutos se pone ámbar (15). */
  aviso?: number
  rotulo?: ReactNode
  className?: string
}

/**
 * Cuenta regresiva (patrón 8.15): gris si falta, ámbar en los últimos `aviso` minutos y rojo
 * cuando ya empezó. Avanza sola, anuncia con aria-live solo al cambiar de tramo.
 */
export function CuentaRegresiva({ hasta, ahora, aviso = 15, rotulo, className }: CuentaRegresivaProps) {
  const m = useMinutos(ahora)
  const falta = hasta - m
  const tramo = falta <= 0 ? 'rojo' : falta <= aviso ? 'ambar' : 'gris'
  return (
    <span
      aria-live="polite"
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-chip px-2 text-xs font-medium tabular-nums',
        tramo === 'rojo' ? 'bg-rojo-fondo text-rojo-texto' : tramo === 'ambar' ? 'bg-ambar-fondo text-ambar-texto' : 'bg-suave text-texto-2',
        className,
      )}
    >
      <TimerIcon size={14} aria-hidden />
      {rotulo && <span className="font-normal">{rotulo}</span>}
      {falta <= 0 ? `empezó ${relativo(falta)}` : relativo(Math.ceil(falta))}
    </span>
  )
}

export type ProximaReunionProps = {
  evento: EventoTiempo
  ahora: Ahora
  /** Enlace de la videollamada: si está, el botón principal es "Unirme". */
  enlace?: string
  /** Botón secundario ("Ver ficha", "Reprogramar"). */
  secundaria?: ReactNode
  className?: string
}

/**
 * Próxima reunión (patrón 8.16): tarjeta con el título, la cuenta regresiva, hora, lugar y
 * quiénes van; una sola acción principal. Se habilita "Unirme" 10 minutos antes.
 */
export function ProximaReunion({ evento: e, ahora, enlace, secundaria, className }: ProximaReunionProps) {
  const m = useMinutos(ahora.min)
  const hoy = e.dia === ahora.dia
  const abierta = hoy && e.inicio - m <= 10 && m < e.fin
  return (
    <article className={cx('flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-5 shadow-min', className)} aria-label={`Próxima reunión: ${e.titulo}`}>
      <div className="flex items-start gap-3">
        <h3 className="mr-auto min-w-0 text-base font-medium text-tinta">{e.titulo}</h3>
        {hoy && <CuentaRegresiva hasta={e.inicio} ahora={ahora.min} />}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-texto-2">
        <span className="inline-flex items-center gap-1.5 tabular-nums"><ClockIcon size={14} aria-hidden />{hm(e.inicio)} – {hm(e.fin)}</span>
        {e.lugar && <span className="inline-flex min-w-0 items-center gap-1.5"><MapPinIcon size={14} aria-hidden /><span className="truncate">{e.lugar}</span></span>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {e.personas?.length ? (
          <span className="mr-auto flex" aria-label={`Van ${e.personas.join(', ')}`}>
            {e.personas.slice(0, 4).map(p => (
              <span key={p} aria-hidden className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-superficie bg-suave text-[11px] font-medium text-texto-2 first:ml-0">{iniciales(p)}</span>
            ))}
          </span>
        ) : <span className="mr-auto" />}
        {secundaria}
        {enlace && (
          <a
            href={abierta ? enlace : undefined}
            aria-disabled={!abierta || undefined}
            target="_blank"
            rel="noreferrer"
            className={cx(
              'inline-flex h-[38px] items-center gap-2 rounded-control px-4 text-[13px] font-medium max-md:h-11',
              abierta ? 'bg-tinta text-superficie shadow-principal hover:bg-tinta/90' : 'cursor-not-allowed bg-suave text-texto-3',
            )}
          >
            <VideoCameraIcon size={16} aria-hidden />
            {abierta ? 'Unirme' : `Unirme ${relativo(e.inicio - 10 - m)}`}
          </a>
        )}
      </div>
    </article>
  )
}
