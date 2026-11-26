'use client'
/**
 * TarjetaProceso: una automatización vista como receta. Arriba, el mini flujo de pasos sobre
 * una bandeja punteada (el paso que falló en rojo, todo gris si está pausada); abajo, nombre,
 * qué la dispara y una rayita de corridas de los últimos 14 días.
 */
import { Fragment } from 'react'
import { Pastilla } from '../base/Pastilla'
import { cx } from '../base/utilidades'
import type { Tono } from '../base/utilidades'
import { CajaTarjeta } from './compartido'

export type EstadoProceso = 'activo' | 'pausado' | 'error' | 'borrador'
export type PasoProceso = { id: string; nombre: string; color: string; fallo?: boolean }

export type TarjetaProcesoProps = {
  nombre: string
  disparador: string
  estado: EstadoProceso
  pasos: readonly PasoProceso[]
  /** Corridas por día, la última es hoy. */
  serie?: readonly number[]
  resumen?: string
  onAbrir?: () => void
}

const ESTADO: Record<EstadoProceso, { tono: Tono; texto: string }> = {
  activo: { tono: 'verde', texto: 'Activo' },
  pausado: { tono: 'gris', texto: 'Pausado' },
  error: { tono: 'rojo', texto: 'Con error' },
  borrador: { tono: 'ambar', texto: 'Borrador' },
}

function Rayita({ serie, apagada }: { serie: readonly number[]; apagada: boolean }) {
  const max = Math.max(1, ...serie)
  const pts = serie.map((v, i) => `${(i / Math.max(1, serie.length - 1)) * 80},${22 - (v / max) * 20}`).join(' ')
  return (
    <svg viewBox="0 0 80 24" className={cx('h-6 w-20 flex-none overflow-visible', apagada && 'opacity-40')} aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--color-acento)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function TarjetaProceso({ nombre, disparador, estado, pasos, serie, resumen, onAbrir }: TarjetaProcesoProps) {
  const pausado = estado === 'pausado'
  const e = ESTADO[estado]
  return (
    <CajaTarjeta clickeable={!!onAbrir} className="relative gap-0 overflow-hidden p-0" aria-label={`${nombre}, ${e.texto}`}>
      <div
        className="relative m-2 flex h-[104px] items-center justify-center gap-2 overflow-hidden rounded-interno bg-panel px-5"
        style={{ backgroundImage: 'radial-gradient(color-mix(in oklch, var(--color-texto-3) 26%, transparent) 1px, transparent 1.2px)', backgroundSize: '12px 12px' }}
      >
        <span className="absolute top-3 left-3"><Pastilla tono={e.tono}>{e.texto}</Pastilla></span>
        {pasos.map((p, i) => (
          <Fragment key={p.id}>
            {i > 0 && <span aria-hidden className={cx('h-px w-3.5 flex-none bg-borde-fuerte', pausado && 'opacity-45')} />}
            <span
              className={cx(
                'inline-flex h-[26px] flex-none items-center gap-2 rounded-full border px-3 text-xs font-medium whitespace-nowrap shadow-min',
                p.fallo ? 'border-rojo-texto/50 bg-rojo-fondo text-rojo-texto' : 'border-borde bg-superficie',
                pausado ? 'text-texto-2 grayscale' : !p.fallo && 'text-tinta',
              )}
            >
              <span aria-hidden className="size-[7px] rounded-full" style={{ background: p.color }} />
              {p.nombre}
            </span>
          </Fragment>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pt-3 pb-5">
        <h3 className="truncate text-sm font-medium text-tinta">
          {onAbrir ? (
            <button type="button" onClick={onAbrir} className="truncate text-left after:absolute after:inset-0 focus-visible:outline-none pointer-coarse:min-h-11">{nombre}</button>
          ) : nombre}
        </h3>
        <p className="truncate text-xs text-texto-3">{disparador}</p>
        {(resumen || serie) && (
          <div className="mt-auto flex items-end gap-4 border-t border-divisor pt-3">
            {resumen && <p className="min-w-0 flex-1 text-xs leading-normal text-texto-3 tabular-nums">{resumen}</p>}
            {serie && <Rayita serie={serie} apagada={pausado} />}
          </div>
        )}
      </div>
    </CajaTarjeta>
  )
}
