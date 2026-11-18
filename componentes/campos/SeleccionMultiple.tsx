'use client'

import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, Plus, X } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { Coincidencia, EnvoltorioCampo, cajaCampo, describedBy, sinAcentos, useAfuera, type Mensaje } from './_campo'

export type OpcionMultiple = { valor: string; texto: string; /** Punto de color o avatar dentro del chip. */ inicio?: ReactNode }

export type SeleccionMultipleProps = {
  rotulo: ReactNode
  opciones: OpcionMultiple[]
  valores: string[]
  onCambio: (valores: string[]) => void
  placeholder?: string
  /** Etiquetas libres: Enter o coma crea una nueva con lo escrito. */
  onCrear?: (texto: string) => void
  /** Pasado este número, los chips se resumen en "+N". */
  maxVisibles?: number
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

/** Varios valores como chips dentro del campo; se escribe para filtrar, Backspace borra el último, Enter/coma crea. */
export function SeleccionMultiple({ rotulo, opciones, valores, onCambio, placeholder = 'Agregar…', onCrear, maxVisibles = 6, opcional, ayuda, mensaje, id: idPropio, className }: SeleccionMultipleProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const idLista = `${id}-lista`
  const ref = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activa, setActiva] = useState(0)
  const cerrar = useCallback(() => setAbierto(false), [])
  useAfuera(ref, abierto, cerrar)

  const elegidas = valores.map((v) => opciones.find((o) => o.valor === v) ?? { valor: v, texto: v })
  const filtradas = useMemo(() => opciones.filter((o) => !valores.includes(o.valor) && sinAcentos(o.texto).includes(sinAcentos(q))), [opciones, valores, q])
  const conCrear = !!onCrear && q.trim() !== '' && !opciones.some((o) => sinAcentos(o.texto) === sinAcentos(q.trim()))
  const total = filtradas.length + (conCrear ? 1 : 0)
  const quitar = (v: string) => { onCambio(valores.filter((x) => x !== v)); input.current?.focus() }
  const elegir = (i: number) => {
    if (i < filtradas.length) onCambio([...valores, filtradas[i].valor])
    else if (conCrear) onCrear?.(q.trim())
    setQ(''); setActiva(0); input.current?.focus()
  }
  const ocultas = Math.max(0, elegidas.length - maxVisibles)

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={mensaje} className={cx('w-[28rem] max-w-full', className)}>
      <div ref={ref} className="relative">
        <div data-caja onClick={() => input.current?.focus()} className={cajaCampo(mensaje?.tipo ?? 'neutro', 'h-auto min-h-10 flex-wrap gap-1 py-1 max-sm:h-auto max-sm:min-h-[52px]')}>
          {elegidas.slice(0, maxVisibles).map((o) => (
            <span key={o.valor} className="inline-flex h-7 max-w-full items-center gap-1 rounded-chip bg-suave pl-2 pr-0.5 text-[13px] text-tinta">
              {'inicio' in o && o.inicio}
              <span className="truncate">{o.texto}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); quitar(o.valor) }}
                aria-label={`Quitar ${o.texto}`}
                className="grid size-6 place-items-center rounded-full text-texto-3 hover:bg-hover hover:text-tinta focus-visible:outline-2 focus-visible:outline-acento/45"
              >
                <X size={12} aria-hidden />
              </button>
            </span>
          ))}
          {ocultas > 0 && <span className="inline-flex h-7 items-center rounded-chip px-2 text-[13px] text-texto-3" title={elegidas.slice(maxVisibles).map((o) => o.texto).join(', ')}>+{ocultas}</span>}
          <input
            ref={input}
            id={id}
            role="combobox"
            aria-expanded={abierto}
            aria-controls={idLista}
            aria-autocomplete="list"
            aria-activedescendant={abierto && total ? `${id}-op-${activa}` : undefined}
            aria-describedby={describedBy(id, mensaje, ayuda)}
            autoComplete="off"
            value={q}
            placeholder={valores.length ? '' : placeholder}
            onFocus={() => setAbierto(true)}
            onChange={(e) => { setQ(e.target.value.replace(',', '')); setActiva(0); setAbierto(true) }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !q && valores.length) quitar(valores[valores.length - 1])
              else if ((e.key === 'Enter' || e.key === ',') && total) { e.preventDefault(); elegir(activa) }
              else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (total) setActiva((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + total) % total) }
              else if (e.key === 'Escape') setAbierto(false)
            }}
            className="h-7 min-w-24 flex-1 bg-transparent text-sm text-tinta outline-none placeholder:text-texto-3 max-sm:text-base"
          />
        </div>
        {abierto && total > 0 && (
          <ul id={idLista} role="listbox" aria-multiselectable="true" className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-tarjeta border border-borde bg-superficie p-1 shadow-flotante">
            {filtradas.map((o, i) => (
              <li
                key={o.valor}
                id={`${id}-op-${i}`}
                role="option"
                aria-selected={false}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => elegir(i)}
                onPointerMove={() => setActiva(i)}
                className={cx('flex h-9 cursor-pointer items-center gap-2 rounded-interno px-2 text-sm text-tinta max-sm:h-11', i === activa && 'bg-hover')}
              >
                {o.inicio}
                <span className="flex-1 truncate"><Coincidencia texto={o.texto} busqueda={q} /></span>
                <Check size={14} aria-hidden className="text-transparent" />
              </li>
            ))}
            {conCrear && (
              <li
                id={`${id}-op-${filtradas.length}`}
                role="option"
                aria-selected={false}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => elegir(filtradas.length)}
                onPointerMove={() => setActiva(filtradas.length)}
                className={cx('flex h-9 cursor-pointer items-center gap-2 rounded-interno px-2 text-sm text-texto-2 max-sm:h-11', activa === filtradas.length && 'bg-hover')}
              >
                <Plus size={14} aria-hidden /> Crear «{q.trim()}»
              </li>
            )}
          </ul>
        )}
      </div>
    </EnvoltorioCampo>
  )
}
