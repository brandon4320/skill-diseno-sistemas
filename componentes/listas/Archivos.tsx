'use client'
/**
 * Archivos: FilaArchivo (tipo dentro del ícono, tamaño a la derecha, quién lo tocó: persona o agente,
 * avance de subida en la propia fila), ListaArchivos (soltar archivos sobre la lista) y
 * Carpetas (carpetas arriba con conteo, archivos en tarjetas de dos pisos; entrar no cambia de página).
 * Galería viva: ejemplos/biblioteca/07-listas.html#lista-de-archivos
 */
import { useState, type DragEvent, type ReactNode } from 'react'
import { CaretRightIcon, FolderSimpleIcon, RobotIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'
import { EASE, plural } from './_lista'

export type Archivo = {
  id: string
  nombre: string
  /** "pdf", "xlsx", "jpg". Va dentro del ícono. */
  tipo: string
  /** Ya formateado: "2,4 MB". */
  peso: string
  /** Persona, o agente con su nombre. */
  modifico?: { persona?: Persona; agente?: string; cuando: string }
  /** 0–100 mientras sube. */
  subiendo?: number
}

const COLOR_TIPO: Record<string, string> = {
  pdf: 'bg-rojo-fondo text-rojo-texto',
  xlsx: 'bg-verde-fondo text-verde-texto',
  csv: 'bg-verde-fondo text-verde-texto',
  docx: 'bg-azul-fondo text-azul-texto',
  jpg: 'bg-ambar-fondo text-ambar-texto',
  png: 'bg-ambar-fondo text-ambar-texto',
}

/** Cuadro de 32 px con la extensión adentro. */
export function IconoArchivo({ tipo, className }: { tipo: string; className?: string }) {
  return (
    <span aria-hidden className={cx('grid size-8 shrink-0 place-items-center rounded-control font-mono text-[10px] font-medium uppercase', COLOR_TIPO[tipo.toLowerCase()] ?? 'bg-gris-fondo text-gris-texto', className)}>
      {tipo.slice(0, 4)}
    </span>
  )
}

export type FilaArchivoProps = { archivo: Archivo; onAbrir?: (id: string) => void; seleccionado?: boolean; extra?: ReactNode }

export function FilaArchivo({ archivo: a, onAbrir, seleccionado, extra }: FilaArchivoProps) {
  const subiendo = a.subiendo !== undefined && a.subiendo < 100
  return (
    <div className={cx('relative flex min-h-12 items-center gap-3 px-4 py-2 transition-colors', seleccionado ? 'bg-acento-suave' : 'hover:bg-hover')}>
      <IconoArchivo tipo={a.tipo} />
      <button type="button" onClick={() => onAbrir?.(a.id)} disabled={subiendo} className={cx('min-w-0 flex-1 truncate rounded-chip text-left text-[13px] text-tinta after:absolute after:inset-0', FOCO)}>
        {a.nombre}
      </button>
      {subiendo ? (
        <span className="flex w-28 items-center gap-2 text-xs text-texto-2 tabular-nums" aria-live="polite">
          <span role="progressbar" aria-valuenow={a.subiendo} aria-valuemin={0} aria-valuemax={100} aria-label={`Subiendo ${a.nombre}`} className="h-1 flex-1 overflow-hidden rounded-full bg-suave">
            <span className={cx('block h-full rounded-full bg-acento transition-[width] duration-300', EASE)} style={{ width: `${a.subiendo}%` }} />
          </span>
          {a.subiendo} %
        </span>
      ) : (
        a.modifico && (
          <span className="hidden w-44 shrink-0 items-center gap-2 truncate text-xs text-texto-2 sm:flex">
            {a.modifico.agente ? (
              <span className="grid size-5 place-items-center rounded-full bg-acento-suave text-acento">
                <RobotIcon size={12} aria-hidden />
              </span>
            ) : (
              a.modifico.persona && <Avatar persona={a.modifico.persona} tamano="xs" decorativo />
            )}
            <span className="truncate">
              {a.modifico.agente ?? a.modifico.persona?.nombre} · {a.modifico.cuando}
            </span>
          </span>
        )
      )}
      <span className="w-16 shrink-0 text-right text-xs text-texto-3 tabular-nums">{a.peso}</span>
      {extra && <span className="relative z-[1]">{extra}</span>}
    </div>
  )
}

export type ListaArchivosProps = {
  archivos: Archivo[]
  onAbrir?: (id: string) => void
  seleccionado?: string
  /** Si está, se puede soltar archivos sobre la lista. */
  onSoltar?: (archivos: File[]) => void
  /** "hasta 50 MB cada uno". */
  limite?: string
  className?: string
}

export function ListaArchivos({ archivos, onAbrir, seleccionado, onSoltar, limite, className }: ListaArchivosProps) {
  const [encima, setEncima] = useState(false)
  const soltar = (e: DragEvent) => {
    e.preventDefault()
    setEncima(false)
    if (onSoltar && e.dataTransfer.files.length) onSoltar([...e.dataTransfer.files])
  }
  return (
    <div
      onDragOver={onSoltar ? (e) => (e.preventDefault(), setEncima(true)) : undefined}
      onDragLeave={onSoltar ? () => setEncima(false) : undefined}
      onDrop={onSoltar ? soltar : undefined}
      className={cx('relative overflow-hidden rounded-tarjeta border bg-superficie transition-colors', encima ? 'border-acento' : 'border-borde', className)}
    >
      <ul className="divide-y divide-divisor">
        {archivos.map((a) => (
          <li key={a.id}>
            <FilaArchivo archivo={a} onAbrir={onAbrir} seleccionado={a.id === seleccionado} />
          </li>
        ))}
      </ul>
      {onSoltar && (
        <p className="flex items-center justify-center gap-1.5 border-t border-divisor px-4 py-3 text-xs text-texto-3">
          <UploadSimpleIcon size={13} aria-hidden /> Arrastrá archivos sobre la lista para subirlos{limite && ` · ${limite}`}
        </p>
      )}
      {encima && <div aria-hidden className="pointer-events-none absolute inset-0 bg-acento/5" />}
    </div>
  )
}

/* ── Carpetas y archivos ────────────────────────────────────────────────── */

export type Carpeta = { id: string; nombre: string; conteo: number }

export type CarpetasProps = {
  /** Ruta actual: [{id:'raiz', nombre:'Archivos'}, {id:'planos', nombre:'Planos'}]. */
  ruta: Array<{ id: string; nombre: string }>
  carpetas: Carpeta[]
  archivos: Archivo[]
  onEntrar: (id: string) => void
  onAbrir?: (id: string) => void
  className?: string
}

/** Carpetas arriba con su conteo; archivos abajo en tarjetas de dos pisos (el de abajo, un tono más claro). */
export function Carpetas({ ruta, carpetas, archivos, onEntrar, onAbrir, className }: CarpetasProps) {
  return (
    <div className={className}>
      <nav aria-label="Ruta" className="mb-3 flex flex-wrap items-center gap-1 text-[13px]">
        {ruta.map((r, i) => (
          <span key={r.id} className="inline-flex items-center gap-1">
            {i > 0 && <CaretRightIcon size={11} className="text-texto-3" aria-hidden />}
            {i === ruta.length - 1 ? (
              <span aria-current="page" className="font-medium text-tinta">
                {r.nombre}
              </span>
            ) : (
              <button type="button" onClick={() => onEntrar(r.id)} className={cx('rounded-chip px-1 text-texto-2 hover:text-tinta', FOCO)}>
                {r.nombre}
              </button>
            )}
          </span>
        ))}
      </nav>
      {carpetas.length > 0 && (
        <>
          <h3 className="mb-2 text-xs font-medium text-texto-3">Carpetas ({carpetas.length})</h3>
          <ul className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
            {carpetas.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onEntrar(c.id)}
                  className={cx('flex h-12 w-full items-center gap-2.5 rounded-control border border-borde bg-superficie px-3 text-left shadow-min transition-[transform,box-shadow] hover:shadow-hover active:scale-[.98]', EASE, FOCO)}
                >
                  <FolderSimpleIcon size={18} weight="fill" className="text-texto-3" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-tinta">{c.nombre}</span>
                  <span className="text-xs text-texto-3 tabular-nums">{c.conteo}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {archivos.length > 0 && (
        <>
          <h3 className="mb-2 text-xs font-medium text-texto-3">{plural(archivos.length, 'archivo')}</h3>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
            {archivos.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onAbrir?.(a.id)}
                  className={cx('w-full overflow-hidden rounded-tarjeta border border-borde bg-superficie text-left shadow-min transition-shadow hover:shadow-hover', FOCO)}
                >
                  <span className="flex items-center gap-2.5 px-3 py-3">
                    <IconoArchivo tipo={a.tipo} />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-tinta">{a.nombre}</span>
                  </span>
                  <span className="flex items-center gap-2 border-t border-divisor bg-panel px-3 py-2 text-xs text-texto-3">
                    <span className="min-w-0 flex-1 truncate">
                      {a.modifico?.agente ?? a.modifico?.persona?.nombre}
                      {a.modifico && ` · ${a.modifico.cuando}`}
                    </span>
                    <span className="tabular-nums">{a.peso}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
