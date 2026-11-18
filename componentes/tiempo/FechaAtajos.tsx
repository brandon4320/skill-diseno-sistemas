'use client'

import { useId, useState } from 'react'
import { CalendarBlankIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { MiniMes } from './MiniMes'
import { diaSemana, fechaCorta, fechaHablada, sumarDias, type Dia } from './tiempo'

export type AtajoFecha = { rotulo: string; dia: Dia }

/** Atajos por defecto: Hoy, Mañana, el próximo lunes y en una semana. */
export const atajosFecha = (hoy: Dia): AtajoFecha[] => {
  const lunes = sumarDias(hoy, ((8 - diaSemana(hoy)) % 7) || 7)
  return [
    { rotulo: 'Hoy', dia: hoy },
    { rotulo: 'Mañana', dia: sumarDias(hoy, 1) },
    { rotulo: 'Próximo lunes', dia: lunes },
    { rotulo: 'En una semana', dia: sumarDias(hoy, 7) },
  ]
}

export type FechaConAtajosProps = {
  rotulo: string
  valor?: Dia
  onCambiar: (d: Dia) => void
  /** Del server. */
  hoy: Dia
  atajos?: AtajoFecha[]
  ocupacion?: Record<Dia, number>
  deshabilitado?: (d: Dia) => boolean
  className?: string
}

/**
 * Fecha con atajos (patrón 8.8): el campo muestra la fecha hablada ("Mañana · jue 19 nov") y
 * abre un panel con los atajos de un toque arriba y el mini mes debajo. Escape cierra.
 */
export function FechaConAtajos({ rotulo, valor, onCambiar, hoy, atajos = atajosFecha(hoy), ocupacion, deshabilitado, className }: FechaConAtajosProps) {
  const [abierto, setAbierto] = useState(false)
  const id = useId()
  const elegir = (d: Dia) => {
    onCambiar(d)
    setAbierto(false)
  }
  return (
    <div className={cx('relative flex flex-col gap-1.5', className)} onKeyDown={e => e.key === 'Escape' && setAbierto(false)}>
      <label htmlFor={id} className="text-xs font-medium text-texto-2">{rotulo}</label>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={() => setAbierto(a => !a)}
        className={cx('flex h-[38px] items-center gap-2 rounded-control border border-borde-fuerte bg-superficie px-3 text-left text-sm text-tinta max-md:h-11', FOCO)}
      >
        <CalendarBlankIcon size={16} className="text-texto-3" aria-hidden />
        {valor ? (
          <span className="tabular-nums">
            {fechaHablada(valor, hoy)}
            {fechaHablada(valor, hoy) !== fechaCorta(valor) && <span className="text-texto-3"> · {fechaCorta(valor)}</span>}
          </span>
        ) : (
          <span className="text-texto-3">Elegir fecha</span>
        )}
      </button>
      {abierto && (
        <div role="dialog" aria-label={rotulo} className="absolute left-0 top-full z-20 mt-1.5 flex w-[320px] max-w-[calc(100vw-32px)] flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-4 shadow-flotante">
          <div className="flex flex-wrap gap-1.5">
            {atajos.map(a => (
              <button
                key={a.rotulo}
                type="button"
                onClick={() => elegir(a.dia)}
                aria-pressed={a.dia === valor}
                className={cx('inline-flex h-7 items-center gap-1.5 rounded-chip border px-2 text-xs font-medium max-md:h-11', FOCO, a.dia === valor ? 'border-acento bg-acento-suave text-acento' : 'border-borde text-tinta hover:bg-suave')}
              >
                {a.rotulo}
                <span className="font-normal text-texto-3 tabular-nums">{fechaCorta(a.dia).split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
          <MiniMes valor={valor} onElegir={elegir} hoy={hoy} ocupacion={ocupacion} deshabilitado={deshabilitado} className="max-w-none" />
        </div>
      )}
    </div>
  )
}
