'use client'

import { useId, useState, type ReactNode } from 'react'
import { ArrowRight, CalendarBlank } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { MensajeCampo, cajaCampo, type Mensaje } from './_campo'
import { diaDe, diferenciaDias, fechaCorta, fechaNumerica, finDeMes, habiles, interpretarFecha, masDias, type Feriados } from './fechas'

export type Rango = { desde: Date | null; hasta: Date | null }
export type AtajoRango = { texto: string; rango: (hoy: Date) => Rango }

export const ATAJOS_RANGO: AtajoRango[] = [
  { texto: 'Este mes', rango: (h) => ({ desde: new Date(h.getFullYear(), h.getMonth(), 1), hasta: finDeMes(h) }) },
  { texto: 'Mes pasado', rango: (h) => ({ desde: new Date(h.getFullYear(), h.getMonth() - 1, 1), hasta: new Date(h.getFullYear(), h.getMonth(), 0) }) },
  { texto: 'Últimos 30 días', rango: (h) => ({ desde: masDias(h, -29), hasta: diaDe(h) }) },
  { texto: 'Este año', rango: (h) => ({ desde: new Date(h.getFullYear(), 0, 1), hasta: new Date(h.getFullYear(), 11, 31) }) },
]

export type RangoFechasProps = {
  rotulo: ReactNode
  valor: Rango
  onCambio: (r: Rango) => void
  hoy?: Date
  feriados?: Feriados
  atajos?: AtajoRango[] | false
  id?: string
  className?: string
}

function Extremo({ id, etiqueta, valor, hoy, onLeer }: { id: string; etiqueta: string; valor: Date | null; hoy: Date; onLeer: (r: Date | null | 'invalida') => void }) {
  const [texto, setTexto] = useState<string | null>(null)
  const fin = () => { if (texto != null) onLeer(interpretarFecha(texto, hoy)); setTexto(null) }
  return (
    <input
      id={id}
      aria-label={etiqueta}
      autoComplete="off"
      placeholder="dd/mm/aaaa"
      value={texto ?? (valor ? fechaNumerica(valor) : '')}
      onChange={(e) => setTexto(e.target.value)}
      onBlur={fin}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); fin() } }}
      className="h-full w-0 min-w-0 flex-1 bg-transparent font-mono text-sm tabular-nums text-tinta outline-none placeholder:text-texto-3 max-sm:text-base"
    />
  )
}

/** Dos fechas en una caja, atajos de período y el resumen en palabras ("1 dic → 31 dic · 31 días, 21 hábiles"). */
export function RangoFechas({ rotulo, valor, onCambio, hoy = new Date(), feriados = {}, atajos = ATAJOS_RANGO, id: idPropio, className }: RangoFechasProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const [error, setError] = useState<Mensaje | null>(null)
  const al = (lado: 'desde' | 'hasta') => (r: Date | null | 'invalida') => {
    if (r === 'invalida') { setError({ tipo: 'error', texto: 'No entiendo esa fecha. Probá 15/12 o +30.' }); return }
    setError(null)
    const nuevo = { ...valor, [lado]: r }
    if (nuevo.desde && nuevo.hasta && nuevo.hasta < nuevo.desde) onCambio({ desde: nuevo.hasta, hasta: nuevo.desde })
    else onCambio(nuevo)
  }
  const { desde, hasta } = valor
  const resumen = desde && hasta ? `${fechaCorta(desde, hoy)} → ${fechaCorta(hasta, hoy)} · ${diferenciaDias(hasta, desde) + 1} días, ${habiles(desde, hasta, feriados)} hábiles` : null

  return (
    <div role="group" aria-labelledby={`${id}-rotulo`} className={cx('flex w-[26rem] max-w-full flex-col gap-1.5', className)}>
      <span id={`${id}-rotulo`} className="text-[13px] font-medium text-texto-2">{rotulo}</span>
      <div data-caja className={cajaCampo(error ? 'error' : 'neutro')}>
        <CalendarBlank size={16} aria-hidden className="shrink-0 text-texto-3" />
        <Extremo id={`${id}-desde`} etiqueta="Desde" valor={desde} hoy={hoy} onLeer={al('desde')} />
        <ArrowRight size={14} aria-hidden className="shrink-0 text-texto-3" />
        <Extremo id={`${id}-hasta`} etiqueta="Hasta" valor={hasta} hoy={hoy} onLeer={al('hasta')} />
      </div>
      {error ? <MensajeCampo id={`${id}-mensaje`} mensaje={error} /> : resumen && <p aria-live="polite" className="text-xs text-texto-3">{resumen}</p>}
      {atajos && (
        <div className="flex flex-wrap gap-1.5">
          {atajos.map((a) => (
            <button key={a.texto} type="button" onClick={() => { setError(null); onCambio(a.rango(hoy)) }} className={cx('h-7 rounded-chip border border-borde px-2.5 text-xs text-texto-2 hover:bg-hover max-sm:h-11', FOCO)}>
              {a.texto}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
