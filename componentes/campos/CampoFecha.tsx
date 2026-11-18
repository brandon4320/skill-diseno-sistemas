'use client'

import { useId, useState, type ReactNode } from 'react'
import { CalendarBlank } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { EnvoltorioCampo, INPUT, cajaCampo, describedBy, type Mensaje } from './_campo'
import { clave, fechaLarga, fechaNumerica, habiles, interpretarFecha, relativa, type Feriados } from './fechas'

export type AtajoFecha = { texto: string; escribir: string }
export const ATAJOS_FECHA: AtajoFecha[] = [
  { texto: 'Hoy', escribir: 'hoy' },
  { texto: '+15', escribir: '+15' },
  { texto: '+30', escribir: '+30' },
  { texto: 'Fin de mes', escribir: 'fin de mes' },
]

export type CampoFechaProps = {
  rotulo: ReactNode
  valor: Date | null
  onCambio: (d: Date | null) => void
  /** Para "hoy", "+30", "vie". Por defecto, ahora. */
  hoy?: Date
  feriados?: Feriados
  /** Chips debajo para no escribir. */
  atajos?: AtajoFecha[] | false
  /** No permitir antes de esta fecha (por ejemplo, la emisión). */
  desde?: Date
  opcional?: boolean
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

/**
 * Fecha que se escribe como se dice ("+30", "vie", "15/12", "fin de mes") y se confirma en palabras
 * debajo ("viernes 18 dic · en 30 días"). Avisa si cae en fin de semana o feriado.
 */
export function CampoFecha({ rotulo, valor, onCambio, hoy = new Date(), feriados = {}, atajos = ATAJOS_FECHA, desde, opcional, mensaje, id: idPropio, className }: CampoFechaProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const [texto, setTexto] = useState<string | null>(null)
  const [invalida, setInvalida] = useState(false)
  const leer = (s: string) => {
    const r = interpretarFecha(s, hoy)
    setInvalida(r === 'invalida')
    if (r !== 'invalida') onCambio(r)
  }

  let msj: Mensaje | null = mensaje ?? null
  if (!msj && invalida) msj = { tipo: 'error', texto: 'No entiendo esa fecha. Probá 15/12, +30 o vie.' }
  if (!msj && valor && desde && valor < desde) msj = { tipo: 'error', texto: `Es anterior al ${fechaNumerica(desde)}.` }
  if (!msj && valor && (valor.getDay() % 6 === 0 || feriados[clave(valor)])) {
    msj = { tipo: 'aviso', texto: `${fechaLarga(valor, hoy)} · cae ${feriados[clave(valor)] ? `en feriado (${feriados[clave(valor)]})` : 'en fin de semana'}` }
  }
  const confirmacion = valor && !invalida ? `${fechaLarga(valor, hoy)} · ${relativa(valor, hoy)}${valor > hoy ? ` · ${habiles(hoy, valor, feriados)} hábiles` : ''}` : null

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={confirmacion} mensaje={msj} className={cx('w-64 max-sm:w-full', className)}>
      <div data-caja className={cajaCampo(msj?.tipo ?? 'neutro')}>
        <CalendarBlank size={16} aria-hidden className="shrink-0 text-texto-3" />
        <input
          id={id}
          autoComplete="off"
          placeholder="dd/mm, +30, vie"
          value={texto ?? (valor ? fechaNumerica(valor) : '')}
          onChange={(e) => { setTexto(e.target.value); setInvalida(false) }}
          onBlur={() => { if (texto != null) leer(texto); setTexto(null) }}
          onKeyDown={(e) => { if (e.key === 'Enter' && texto != null) { e.preventDefault(); leer(texto); setTexto(null) } }}
          aria-invalid={msj?.tipo === 'error' || undefined}
          aria-describedby={describedBy(id, msj, confirmacion)}
          className={cx(INPUT, 'font-mono tabular-nums')}
        />
      </div>
      {atajos && (
        <div className="flex flex-wrap gap-1.5">
          {atajos.map((a) => (
            <button key={a.texto} type="button" onClick={() => { setTexto(null); leer(a.escribir) }} className={cx('h-7 rounded-chip border border-borde px-2.5 text-xs text-texto-2 hover:bg-hover max-sm:h-11', FOCO)}>
              {a.texto}
            </button>
          ))}
        </div>
      )}
    </EnvoltorioCampo>
  )
}
