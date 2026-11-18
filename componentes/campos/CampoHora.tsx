'use client'

import { useId, useState, type ReactNode } from 'react'
import { Clock } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { EnvoltorioCampo, INPUT, cajaCampo, describedBy, type Mensaje } from './_campo'
import { horaTexto, interpretarHora } from './fechas'

export type CampoHoraProps = {
  rotulo: ReactNode
  /** Minutos desde las 00:00. */
  valor: number | null
  onCambio: (min: number | null) => void
  /** Para mostrar la duración ("2 h 30 min") contra la hora de inicio. */
  desde?: number | null
  /** Redondeo al salir, en minutos (15 = cuartos de hora). */
  redondeo?: number
  opcional?: boolean
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

const duracion = (m: number) => (m % 60 ? `${Math.floor(m / 60) ? `${Math.floor(m / 60)} h ` : ''}${m % 60} min` : `${m / 60} h`)

/** Hora que se escribe corta ("930", "14", "1415") y se completa al salir; muestra la duración contra el inicio. */
export function CampoHora({ rotulo, valor, onCambio, desde, redondeo = 1, opcional, mensaje, id: idPropio, className }: CampoHoraProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const [texto, setTexto] = useState<string | null>(null)
  const [mal, setMal] = useState(false)
  const leer = () => {
    if (texto == null) return
    if (!texto.trim()) { onCambio(null); setMal(false) }
    else {
      const m = interpretarHora(texto)
      setMal(m == null)
      if (m != null) onCambio(Math.round(m / redondeo) * redondeo)
    }
    setTexto(null)
  }
  let msj: Mensaje | null = mensaje ?? (mal ? { tipo: 'error', texto: 'No es una hora. Probá 930 o 14:15.' } : null)
  if (!msj && valor != null && desde != null && valor <= desde) msj = { tipo: 'error', texto: `Tiene que ser después de las ${horaTexto(desde)}.` }
  const ayuda = !msj && valor != null && desde != null ? duracion(valor - desde) : null

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={msj} className={cx('w-36', className)}>
      <div data-caja className={cajaCampo(msj?.tipo ?? 'neutro')}>
        <Clock size={16} aria-hidden className="shrink-0 text-texto-3" />
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder="hh:mm"
          value={texto ?? (valor != null ? horaTexto(valor) : '')}
          onChange={(e) => { setTexto(e.target.value); setMal(false) }}
          onBlur={leer}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); leer() } }}
          aria-invalid={msj?.tipo === 'error' || undefined}
          aria-describedby={describedBy(id, msj, ayuda)}
          className={cx(INPUT, 'font-mono tabular-nums')}
        />
      </div>
    </EnvoltorioCampo>
  )
}
