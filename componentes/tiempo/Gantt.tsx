'use client'

import type { CSSProperties } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { diaSemana, diferenciaDias, fechaCorta, iniciales, MESES_CORTOS, mesDe, numeroDia, sumarDias, type Dia } from './tiempo'

export type EstadoTarea = 'pendiente' | 'en-curso' | 'hecha' | 'atrasada' | 'borrador'

export type TareaGantt = {
  id: string
  titulo: string
  desde: Dia
  hasta: Dia
  /** 0–100: se dibuja como relleno más oscuro dentro de la barra. */
  avance?: number
  estado: EstadoTarea
  responsable?: string
  /** Grupo o fase: las tareas se agrupan por este rótulo. */
  grupo?: string
}

export type Hito = { id: string; titulo: string; dia: Dia }

export type GanttLivianoProps = {
  tareas: TareaGantt[]
  hitos?: Hito[]
  desde: Dia
  /** Cantidad de días visibles (28 por defecto). */
  dias?: number
  /** Del server. */
  hoy: Dia
  onAbrir?: (t: TareaGantt) => void
  className?: string
}

const COLOR: Record<EstadoTarea, string> = {
  pendiente: 'var(--color-texto-3)',
  'en-curso': 'var(--color-azul-texto)',
  hecha: 'var(--color-verde-texto)',
  atrasada: 'var(--color-rojo-texto)',
  borrador: 'var(--color-borde-fuerte)',
}
const NOMBRE: Record<EstadoTarea, string> = { pendiente: 'Pendiente', 'en-curso': 'En curso', hecha: 'Hecha', atrasada: 'Atrasada', borrador: 'Borrador' }

/**
 * Gantt liviano (patrón 8.10): nombre a la izquierda, barras con tinte del estado y avance
 * adentro, línea de hoy y rombos de hito. Lo que no entra en la barra corta va afuera, a la derecha.
 * En celular la columna de nombres se achica y la grilla scrollea de costado adentro de la tarjeta.
 */
export function GanttLiviano({ tareas, hitos = [], desde, dias = 28, hoy, onAbrir, className }: GanttLivianoProps) {
  const col = 32
  const ancho = dias * col
  const x = (d: Dia) => diferenciaDias(d, desde) * col
  const grupos = [...new Set(tareas.map(t => t.grupo ?? ''))]
  const enRango = diferenciaDias(hoy, desde) >= 0 && diferenciaDias(hoy, desde) < dias
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <div className="overflow-x-auto">
        <div className="relative grid [--nom:200px] max-sm:[--nom:140px]" style={{ gridTemplateColumns: `var(--nom) ${ancho}px`, width: `calc(var(--nom) + ${ancho}px)` }}>
          <div className="sticky left-0 z-[2] border-b border-r border-borde bg-superficie" />
          <div className="relative flex h-11 border-b border-borde">
            {Array.from({ length: dias }, (_, i) => {
              const d = sumarDias(desde, i)
              const finde = diaSemana(d) === 0 || diaSemana(d) === 6
              return (
                <span key={d} className={cx('flex w-8 flex-none flex-col items-center justify-center text-[11px] tabular-nums', finde ? 'bg-suave text-texto-3' : 'text-texto-2', d === hoy && 'font-medium text-tinta')}>
                  {numeroDia(d) === 1 || i === 0 ? <span className="text-texto-3">{MESES_CORTOS[mesDe(d)]}</span> : null}
                  {numeroDia(d)}
                </span>
              )
            })}
          </div>
          {grupos.map(g => (
            <Grupo key={g || '·'} titulo={g} tareas={tareas.filter(t => (t.grupo ?? '') === g)} x={x} col={col} ancho={ancho} onAbrir={onAbrir} />
          ))}
          {enRango && (
            <span aria-hidden className="pointer-events-none absolute bottom-0 top-11 z-[1] w-0.5 bg-rojo-texto" style={{ left: `calc(var(--nom) + ${x(hoy) + col / 2 - 1}px)` }} />
          )}
          <div className="sticky left-0 z-[2] border-r border-borde bg-superficie" />
          <div className="relative h-8">
            {hitos.map(h => (
              <span key={h.id} className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-[11px] text-texto-2" style={{ left: x(h.dia) + col / 2 - 5 }}>
                <span aria-hidden className="size-2.5 rotate-45 rounded-[2px] bg-tinta" />
                {h.titulo} · {fechaCorta(h.dia)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type GrupoProps = { titulo: string; tareas: TareaGantt[]; x: (d: Dia) => number; col: number; ancho: number; onAbrir?: (t: TareaGantt) => void }

function Grupo({ titulo, tareas, x, col, ancho, onAbrir }: GrupoProps) {
  return (
    <>
      {titulo && (
        <>
          <div className="sticky left-0 z-[2] border-r border-borde bg-superficie px-4 pb-1 pt-3 text-xs font-medium text-texto-2">{titulo}</div>
          <div style={{ width: ancho }} />
        </>
      )}
      {tareas.map(t => {
        const izq = x(t.desde)
        const w = (diferenciaDias(t.hasta, t.desde) + 1) * col
        const corta = w < 96
        const etiqueta = `${t.titulo}, ${NOMBRE[t.estado]}, ${fechaCorta(t.desde)} a ${fechaCorta(t.hasta)}${t.avance != null ? `, ${t.avance} %` : ''}`
        return (
          <div key={t.id} className="contents">
            <div className="sticky left-0 z-[2] flex h-10 min-w-0 items-center gap-2 border-r border-borde bg-superficie px-4 text-[13px] text-tinta">
              <span className="truncate">{t.titulo}</span>
            </div>
            <div className="relative h-10">
              <button
                type="button"
                onClick={() => onAbrir?.(t)}
                aria-label={etiqueta}
                title={etiqueta}
                style={{ left: izq + 2, width: w - 4, '--t': COLOR[t.estado], '--p': `${t.avance ?? 0}%` } as CSSProperties}
                className={cx(
                  'absolute top-1/2 flex h-7 -translate-y-1/2 items-center gap-1.5 overflow-hidden rounded-chip px-1.5 text-left text-xs font-medium text-[color-mix(in_oklch,var(--t)_64%,var(--color-tinta))]',
                  'bg-[linear-gradient(90deg,color-mix(in_oklch,var(--t)_24%,var(--color-superficie))_var(--p),color-mix(in_oklch,var(--t)_12%,var(--color-superficie))_var(--p))]',
                  t.estado === 'borrador' && 'border border-dashed border-borde-fuerte bg-superficie text-texto-2',
                  FOCO,
                )}
              >
                {t.responsable && <span className="grid size-5 flex-none place-items-center rounded-full bg-superficie text-[11px] text-texto-2">{iniciales(t.responsable)}</span>}
                {!corta && <span className="truncate">{t.titulo}</span>}
              </button>
              {corta && <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-xs text-texto-3" style={{ left: izq + w + 8 }}>{t.titulo}</span>}
            </div>
          </div>
        )
      })}
    </>
  )
}
