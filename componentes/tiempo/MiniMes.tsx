'use client'

import { useState, type KeyboardEvent } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { DIAS_CORTOS, diaSemana, fechaLarga, grillaMes, mesDe, MESES, anioDe, numeroDia, primeroDelMes, sumarDias, sumarMeses, type Dia } from './tiempo'

export type MiniMesProps = {
  /** Día elegido. */
  valor?: Dia
  onElegir: (d: Dia) => void
  /** Del server. */
  hoy: Dia
  /** Mes que se ve al abrir (por defecto el del valor o el de hoy). */
  mesInicial?: Dia
  /** Cuántos eventos tiene cada día: dibuja hasta 3 puntos debajo del número. */
  ocupacion?: Record<Dia, number>
  /** Días que no se pueden elegir (feriados, pasado, fuera de rango). */
  deshabilitado?: (d: Dia) => boolean
  className?: string
}

/**
 * Mini mes (patrón 8.7): grilla de 7 × 6 con teclado (flechas, Inicio/Fin, RePág/AvPág),
 * hoy en tinta, elegido con anillo de acento y puntos de ocupación. 44 px por toque en celular.
 */
export function MiniMes({ valor, onElegir, hoy, mesInicial, ocupacion, deshabilitado, className }: MiniMesProps) {
  const [mes, setMes] = useState<Dia>(primeroDelMes(mesInicial ?? valor ?? hoy))
  const [foco, setFoco] = useState<Dia>(valor ?? hoy)
  const celdas = grillaMes(mes)
  const mover = (d: Dia) => {
    setFoco(d)
    if (mesDe(d) !== mesDe(mes) || anioDe(d) !== anioDe(mes)) setMes(primeroDelMes(d))
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-mini-dia="${d}"]`)?.focus())
  }
  const tecla = (ev: KeyboardEvent<HTMLButtonElement>, d: Dia) => {
    const m: Record<string, () => Dia> = {
      ArrowLeft: () => sumarDias(d, -1),
      ArrowRight: () => sumarDias(d, 1),
      ArrowUp: () => sumarDias(d, -7),
      ArrowDown: () => sumarDias(d, 7),
      PageUp: () => sumarMeses(d, -1).slice(0, 8) + String(Math.min(numeroDia(d), 28)).padStart(2, '0'),
      PageDown: () => sumarMeses(d, 1).slice(0, 8) + String(Math.min(numeroDia(d), 28)).padStart(2, '0'),
      Home: () => sumarDias(d, -((diaSemana(d) + 6) % 7)),
      End: () => sumarDias(d, 6 - ((diaSemana(d) + 6) % 7)),
    }
    const f = m[ev.key]
    if (!f) return
    ev.preventDefault()
    mover(f())
  }
  return (
    <div className={cx('w-full max-w-[300px]', className)}>
      <div className="mb-2 flex items-center gap-1">
        <b className="mr-auto text-sm font-medium capitalize text-tinta">
          {MESES[mesDe(mes)]} <span className="font-normal text-texto-3 tabular-nums">{anioDe(mes)}</span>
        </b>
        <button type="button" aria-label="Mes anterior" onClick={() => setMes(sumarMeses(mes, -1))} className={cx('grid size-8 place-items-center rounded-chip text-texto-2 hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}>
          <CaretLeftIcon size={16} />
        </button>
        <button type="button" aria-label="Mes siguiente" onClick={() => setMes(sumarMeses(mes, 1))} className={cx('grid size-8 place-items-center rounded-chip text-texto-2 hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}>
          <CaretRightIcon size={16} />
        </button>
      </div>
      <div role="grid" aria-label={`${MESES[mesDe(mes)]} ${anioDe(mes)}`} className="grid grid-cols-7 gap-y-0.5">
        <div role="row" className="contents">
          {[1, 2, 3, 4, 5, 6, 0].map(i => (
            <span key={i} role="columnheader" className="grid h-6 place-items-center text-[11px] font-medium text-texto-3 capitalize">{DIAS_CORTOS[i]?.slice(0, 2)}</span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, f) => (
          <div role="row" key={f} className="contents">
            {celdas.slice(f * 7, f * 7 + 7).map(d => {
              const otro = mesDe(d) !== mesDe(mes)
              const esHoy = d === hoy
              const sel = d === valor
              const off = deshabilitado?.(d) ?? false
              const n = Math.min(3, ocupacion?.[d] ?? 0)
              return (
                <button
                  key={d}
                  type="button"
                  role="gridcell"
                  data-mini-dia={d}
                  tabIndex={d === foco ? 0 : -1}
                  aria-selected={sel}
                  aria-disabled={off || undefined}
                  aria-current={esHoy ? 'date' : undefined}
                  aria-label={`${fechaLarga(d)}${esHoy ? ', hoy' : ''}${ocupacion ? `, ${ocupacion[d] ?? 0} eventos` : ''}`}
                  onKeyDown={ev => tecla(ev, d)}
                  onClick={() => !off && onElegir(d)}
                  className={cx('group relative flex h-9 flex-col items-center justify-center rounded-[10px] text-xs font-medium tabular-nums max-md:h-11', FOCO, otro ? 'font-normal text-texto-3' : 'text-tinta', off && 'cursor-not-allowed line-through text-texto-3')}
                >
                  <span
                    className={cx(
                      'grid size-[26px] place-items-center rounded-full transition-colors duration-150 max-md:size-8',
                      esHoy ? 'bg-tinta text-superficie' : !off && 'group-hover:bg-suave',
                      sel && (esHoy ? 'shadow-[0_0_0_2px_var(--color-superficie),0_0_0_3.5px_var(--color-acento)]' : 'text-acento shadow-[0_0_0_1.5px_var(--color-acento)]'),
                    )}
                  >
                    {numeroDia(d)}
                  </span>
                  {n > 0 && (
                    <span aria-hidden className="absolute bottom-px flex gap-0.5">
                      {Array.from({ length: n }, (_, i) => <i key={i} className="size-[3px] rounded-full bg-texto-3" />)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
