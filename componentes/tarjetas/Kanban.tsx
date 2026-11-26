'use client'
/**
 * Kanban: TarjetaKanban (etiquetas, título, checklist, código, fecha, responsables) y
 * ColumnaKanban (título con conteo, límite opcional, zona para soltar y "Agregar" al final).
 * Arrastre nativo de HTML5 con teclado de respaldo: Alt + ← / → mueve la tarjeta de columna.
 */
import { useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react'
import { CalendarBlankIcon, CheckSquareIcon, PlusIcon } from '@phosphor-icons/react'
import { PilaAvatares } from '../base/PilaAvatares'
import type { Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'

export type EtiquetaKanban = { texto: string; color: string }

export type TareaKanban = {
  id: string
  titulo: string
  codigo?: string
  etiquetas?: readonly EtiquetaKanban[]
  checklist?: { hechos: number; total: number }
  vence?: string
  /** "hoy" pinta la fecha en ámbar, "vencida" en rojo. */
  urgencia?: 'normal' | 'hoy' | 'vencida'
  responsables?: readonly Persona[]
}

export type TarjetaKanbanProps = {
  tarea: TareaKanban
  onAbrir?: (id: string) => void
  /** Teclado: Alt + flecha mueve a la columna vecina. */
  onMover?: (id: string, direccion: -1 | 1) => void
}

const COLOR_FECHA = { normal: 'text-texto-3', hoy: 'text-ambar-texto', vencida: 'text-rojo-texto' } as const

export function TarjetaKanban({ tarea, onAbrir, onMover }: TarjetaKanbanProps) {
  const [arrastrando, setArrastrando] = useState(false)
  const alTeclado = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') onAbrir?.(tarea.id)
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault()
      onMover?.(tarea.id, e.key === 'ArrowLeft' ? -1 : 1)
    }
  }
  const urg = tarea.urgencia ?? 'normal'
  return (
    <article
      tabIndex={0}
      draggable
      aria-label={tarea.titulo}
      aria-roledescription="tarjeta arrastrable"
      onDragStart={(e: DragEvent<HTMLElement>) => { e.dataTransfer.setData('text/plain', tarea.id); e.dataTransfer.effectAllowed = 'move'; setArrastrando(true) }}
      onDragEnd={() => setArrastrando(false)}
      onClick={() => onAbrir?.(tarea.id)}
      onKeyDown={alTeclado}
      className={cx(
        'flex cursor-grab flex-col gap-2.5 rounded-interno border border-borde bg-superficie p-3.5 shadow-min',
        'transition-[transform,box-shadow,opacity] duration-200 ease-(--ease) hover:shadow-hover',
        arrastrando && 'rotate-[1.5deg] opacity-60 motion-reduce:rotate-0',
        FOCO,
      )}
    >
      {tarea.etiquetas && tarea.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tarea.etiquetas.map(et => (
            <span
              key={et.texto}
              className="inline-flex h-5 items-center gap-1.5 rounded-chip border px-1.5 text-xs"
              style={{ borderColor: `color-mix(in oklch, ${et.color} 40%, transparent)`, color: `color-mix(in oklch, ${et.color} 70%, var(--color-tinta))` }}
            >
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: et.color }} />
              {et.texto}
            </span>
          ))}
        </div>
      )}
      <h4 className="text-[13px] leading-snug font-medium text-tinta">{tarea.titulo}</h4>
      <div className="flex items-center gap-3 text-xs text-texto-3">
        {tarea.checklist && (
          <span className="inline-flex items-center gap-1 tabular-nums" aria-label={`${tarea.checklist.hechos} de ${tarea.checklist.total} pasos`}>
            <CheckSquareIcon size={14} aria-hidden />{tarea.checklist.hechos}/{tarea.checklist.total}
          </span>
        )}
        {tarea.codigo && <span className="font-mono">{tarea.codigo}</span>}
        {tarea.vence && (
          <span className={cx('inline-flex items-center gap-1 tabular-nums', COLOR_FECHA[urg])}>
            <CalendarBlankIcon size={14} aria-hidden />
            {urg === 'hoy' ? 'Vence hoy' : urg === 'vencida' ? `Venció ${tarea.vence}` : tarea.vence}
          </span>
        )}
        {tarea.responsables && tarea.responsables.length > 0 && (
          <span className="ml-auto"><PilaAvatares personas={tarea.responsables} tamano="xs" max={3} /></span>
        )}
      </div>
    </article>
  )
}

export type ColumnaKanbanProps = {
  id: string
  titulo: string
  color?: string
  cantidad: number
  /** Límite de trabajo en curso: al pasarlo, el conteo se pone ámbar. */
  limite?: number
  onSoltar?: (idTarea: string, idColumna: string) => void
  onAgregar?: () => void
  children: ReactNode
}

export function ColumnaKanban({ id, titulo, color, cantidad, limite, onSoltar, onAgregar, children }: ColumnaKanbanProps) {
  const [encima, setEncima] = useState(false)
  const pasado = limite !== undefined && cantidad > limite
  return (
    <section
      aria-label={`${titulo}, ${cantidad}`}
      onDragOver={e => { if (onSoltar) { e.preventDefault(); setEncima(true) } }}
      onDragLeave={() => setEncima(false)}
      onDrop={e => { e.preventDefault(); setEncima(false); const t = e.dataTransfer.getData('text/plain'); if (t) onSoltar?.(t, id) }}
      className={cx(
        'flex min-h-[200px] min-w-[264px] flex-col gap-2 rounded-tarjeta bg-suave p-2 transition-[background-color,box-shadow] duration-150',
        encima && 'bg-acento-suave ring-2 ring-acento/30 ring-inset',
      )}
    >
      <header className="flex h-9 items-center gap-2 px-2">
        {color && <span aria-hidden className="size-2 rounded-full" style={{ background: color }} />}
        <h3 className="text-[13px] font-medium text-tinta">{titulo}</h3>
        <span className={cx('text-xs tabular-nums', pasado ? 'font-medium text-ambar-texto' : 'text-texto-3')}>
          {limite !== undefined ? `${cantidad}/${limite}` : cantidad}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
      {onAgregar && (
        <button
          type="button"
          onClick={onAgregar}
          className={cx('flex h-9 items-center gap-2 rounded-control px-2 text-[13px] text-texto-3 hover:bg-superficie hover:text-tinta pointer-coarse:h-11', FOCO)}
        >
          <PlusIcon size={14} />Agregar
        </button>
      )}
    </section>
  )
}
