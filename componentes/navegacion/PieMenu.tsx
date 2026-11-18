'use client'

import { useState } from 'react'
import { CaretRightIcon, XIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Pie del menú (01-navegacion · 08 y 09).
 * - TarjetaPlan: plan con una cifra real, se puede cerrar (queda una línea). Cerca del tope, ámbar con lo que falta.
 * - PuestaEnMarcha: "3 de 4" con segmentos verdes junto al usuario; desaparece sola al completarse.
 */
export type TarjetaPlanProps = {
  plan: string
  usado: number
  tope: number
  /** "facturas este mes". */
  unidad: string
  onMejorar?: () => void
  /** A partir de qué fracción pasa a ámbar (0,8 por defecto). */
  aviso?: number
}

export function TarjetaPlan({ plan, usado, tope, unidad, onMejorar, aviso = 0.8 }: TarjetaPlanProps) {
  const [cerrada, setCerrada] = useState(false)
  const pct = Math.min(1, usado / tope)
  const cerca = pct >= aviso
  const resto = Math.max(0, tope - usado)
  if (cerrada)
    return (
      <button type="button" onClick={() => setCerrada(false)} className={cx('flex w-full cursor-pointer items-center justify-between rounded-control px-2 py-1.5 text-xs text-texto-2 hover:bg-hover', FOCO)}>
        <span>Plan {plan} · <span className={cx('font-mono tabular-nums', cerca && 'text-ambar-texto')}>{usado}/{tope}</span></span>
        <CaretRightIcon className="size-3.5" aria-hidden />
      </button>
    )
  return (
    <section aria-label={`Plan ${plan}`} className="relative rounded-tarjeta border border-borde bg-superficie p-3 shadow-min">
      <button type="button" onClick={() => setCerrada(true)} aria-label="Cerrar tarjeta del plan" className={cx('absolute top-2 right-2 grid size-6 cursor-pointer place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta', FOCO)}>
        <XIcon className="size-3.5" />
      </button>
      <p className="text-[11px] font-medium text-texto-3">Plan {plan}</p>
      <p className="mt-1 font-display text-xl font-semibold text-tinta tabular-nums">{usado}<span className="text-sm font-normal text-texto-3"> / {tope}</span></p>
      <p className={cx('text-xs', cerca ? 'text-ambar-texto' : 'text-texto-2')}>{cerca ? `Quedan ${resto} ${unidad}` : unidad}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-suave" role="progressbar" aria-valuemin={0} aria-valuemax={tope} aria-valuenow={usado} aria-label={`${usado} de ${tope} ${unidad}`}>
        <div style={{ width: `${pct * 100}%` }} className={cx('h-full rounded-full', cerca ? 'bg-ambar-texto' : 'bg-tinta')} />
      </div>
      {onMejorar && <button type="button" onClick={onMejorar} className={cx('mt-2.5 cursor-pointer text-xs font-medium text-tinta underline-offset-2 hover:underline', FOCO)}>Ver planes</button>}
    </section>
  )
}

export type PasoInicio = { id: string; texto: string; hecho: boolean; onIr?: () => void }

export function PuestaEnMarcha({ pasos }: { pasos: readonly PasoInicio[] }) {
  const [abierta, setAbierta] = useState(false)
  const hechos = pasos.filter(p => p.hecho).length
  if (hechos === pasos.length) return null
  return (
    <div className="relative">
      <button type="button" aria-expanded={abierta} onClick={() => setAbierta(v => !v)} className={cx('flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2 py-1.5 text-xs text-texto-2 hover:bg-hover', FOCO)}>
        <span className="font-medium text-tinta">Puesta en marcha</span>
        <span className="ml-auto font-mono tabular-nums">{hechos} de {pasos.length}</span>
        <span className="flex gap-0.5" aria-hidden>
          {pasos.map(p => <i key={p.id} className={cx('h-1.5 w-2.5 rounded-full', p.hecho ? 'bg-verde-texto' : 'bg-suave')} />)}
        </span>
      </button>
      {abierta && (
        <ul className="absolute bottom-full left-0 z-30 mb-1.5 w-64 rounded-tarjeta border border-borde bg-superficie p-1.5 shadow-flotante">
          {pasos.map(p => (
            <li key={p.id}>
              <button type="button" disabled={p.hecho} onClick={p.onIr} className={cx('flex w-full cursor-pointer items-center gap-2 rounded-control px-2 py-1.5 text-left text-[13px] hover:bg-hover disabled:cursor-default disabled:text-texto-3 disabled:line-through disabled:hover:bg-transparent', FOCO)}>
                <span className={cx('size-2 shrink-0 rounded-full', p.hecho ? 'bg-verde-texto' : 'border border-borde-fuerte')} aria-hidden />
                {p.texto}
                <span className="sr-only">{p.hecho ? ' (hecho)' : ' (pendiente)'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
