'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ClockCounterClockwise, MagnifyingGlass, X } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Buscador a pantalla completa (el ⌘K del teléfono, SKILL.md §11): la píldora de búsqueda abre
 * toda la pantalla con el teclado arriba; recientes antes de escribir, chips por tipo y
 * resultados de dos líneas con lo encontrado resaltado. Filtrar lo hace quien lo usa (`buscar`).
 */
export type ResultadoBusqueda = { id: string; titulo: string; detalle: string; tipo: string; icono?: ReactNode }

export type BuscadorCompletoProps = {
  abierto: boolean
  alCerrar: () => void
  recientes: readonly string[]
  tipos: readonly string[]
  buscar: (texto: string, tipo: string | null) => readonly ResultadoBusqueda[]
  alElegir: (r: ResultadoBusqueda) => void
  marcador?: string
}

function Resaltado({ texto, buscado }: { texto: string; buscado: string }) {
  const i = buscado ? texto.toLocaleLowerCase('es').indexOf(buscado.toLocaleLowerCase('es')) : -1
  if (i < 0) return <>{texto}</>
  return <>{texto.slice(0, i)}<mark className="rounded-[3px] bg-acento-suave text-tinta">{texto.slice(i, i + buscado.length)}</mark>{texto.slice(i + buscado.length)}</>
}

export function BuscadorCompleto({ abierto, alCerrar, recientes, tipos, buscar, alElegir, marcador = 'Buscar clientes, facturas…' }: BuscadorCompletoProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const idLista = useId()
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState<string | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) { d.showModal(); campo.current?.focus() }
    if (!abierto && d.open) d.close()
  }, [abierto])

  const resultados = texto.trim() ? buscar(texto.trim(), tipo) : []

  return (
    <dialog ref={ref} aria-label="Buscar" onClose={alCerrar} className="m-0 h-dvh max-h-none w-full max-w-none bg-fondo p-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 px-3 pt-[max(env(safe-area-inset-top),12px)] pb-2">
          <button type="button" aria-label="Cerrar búsqueda" onClick={alCerrar} className={cx('grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-tinta', FOCO)}>
            <ArrowLeft size={20} aria-hidden />
          </button>
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-borde bg-superficie px-3 focus-within:border-acento">
            <MagnifyingGlass size={18} aria-hidden className="shrink-0 text-texto-3" />
            <input
              ref={campo}
              type="search"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder={marcador}
              aria-controls={idLista}
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent text-base text-tinta outline-none placeholder:text-texto-3"
            />
            {texto && (
              <button type="button" aria-label="Borrar" onClick={() => { setTexto(''); campo.current?.focus() }} className={cx('grid size-7 cursor-pointer place-items-center rounded-full text-texto-3', FOCO)}>
                <X size={14} aria-hidden />
              </button>
            )}
          </label>
        </div>
        <div role="radiogroup" aria-label="Tipo" className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {[null, ...tipos].map(t => (
            <button
              key={t ?? 'todo'}
              type="button"
              role="radio"
              aria-checked={tipo === t}
              onClick={() => setTipo(t)}
              className={cx('h-8 shrink-0 cursor-pointer rounded-full border px-3 text-sm font-medium', tipo === t ? 'border-tinta bg-tinta text-superficie' : 'border-borde bg-superficie text-texto-2', FOCO)}
            >
              {t ?? 'Todo'}
            </button>
          ))}
        </div>
        <div id={idLista} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          {!texto.trim() ? (
            <>
              <h3 className="mt-2 mb-1 text-xs font-semibold text-texto-3 uppercase">Recientes</h3>
              <ul>
                {recientes.map(r => (
                  <li key={r}>
                    <button type="button" onClick={() => setTexto(r)} className={cx('flex h-11 w-full cursor-pointer items-center gap-3 text-left text-[15px] text-tinta', FOCO)}>
                      <ClockCounterClockwise size={18} aria-hidden className="text-texto-3" />{r}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : resultados.length === 0 ? (
            <p className="mt-8 text-center text-sm text-texto-2">Nada con «{texto.trim()}». Probá con el número o el CUIT.</p>
          ) : (
            <ul className="mt-1 flex flex-col">
              {resultados.map(r => (
                <li key={r.id} className="border-b border-divisor last:border-b-0">
                  <button type="button" onClick={() => alElegir(r)} className={cx('flex min-h-14 w-full cursor-pointer items-center gap-3 py-2 text-left', FOCO)}>
                    {r.icono && <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-suave text-texto-2">{r.icono}</span>}
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-[15px] font-medium text-tinta"><Resaltado texto={r.titulo} buscado={texto.trim()} /></b>
                      <small className="block truncate text-xs text-texto-3">{r.tipo} · <Resaltado texto={r.detalle} buscado={texto.trim()} /></small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  )
}
