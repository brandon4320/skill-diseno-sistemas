'use client'

import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { CaretUpDown, Check, Plus } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'
import { Coincidencia, EnvoltorioCampo, INPUT, cajaCampo, describedBy, sinAcentos, useAfuera, type Mensaje } from './_campo'

export type OpcionCombo = {
  valor: string
  texto: string
  /** Dato gris a la derecha: CUIT, código, ciudad. Se busca también por él. */
  detalle?: string
  /** Avatar, ícono o punto de color a la izquierda. */
  inicio?: ReactNode
  grupo?: string
}

export type ComboboxProps = {
  rotulo: ReactNode
  opciones: OpcionCombo[]
  valor: string | null
  onCambio: (valor: string | null) => void
  placeholder?: string
  /** Última fila: "Crear «texto»" con lo que se escribió. */
  onCrear?: (texto: string) => void
  /** Al abrir sin texto, se muestran primero (los recientes). */
  recientes?: string[]
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

/** Combobox con búsqueda sin acentos, coincidencia marcada, recientes, grupos y "Crear" al final (patrón ARIA 1.2). */
export function Combobox({ rotulo, opciones, valor, onCambio, placeholder = 'Buscar…', onCrear, recientes, opcional, ayuda, mensaje, id: idPropio, className }: ComboboxProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const idLista = `${id}-lista`
  const ref = useRef<HTMLDivElement>(null)
  const elegida = opciones.find((o) => o.valor === valor) ?? null
  const [abierto, setAbierto] = useState(false)
  const [q, setQ] = useState('')
  const [activa, setActiva] = useState(0)
  const cerrar = useCallback(() => { setAbierto(false); setQ('') }, [])
  useAfuera(ref, abierto, cerrar)

  const filtradas = useMemo(() => {
    if (!q) {
      const r = recientes ? opciones.filter((o) => recientes.includes(o.valor)).map((o) => ({ ...o, grupo: 'Recientes' })) : []
      return [...r, ...opciones.filter((o) => !r.some((x) => x.valor === o.valor))]
    }
    const s = sinAcentos(q)
    return opciones.filter((o) => sinAcentos(`${o.texto} ${o.detalle ?? ''}`).includes(s))
  }, [q, opciones, recientes])
  const conCrear = !!onCrear && q.trim() !== '' && !opciones.some((o) => sinAcentos(o.texto) === sinAcentos(q.trim()))
  const total = filtradas.length + (conCrear ? 1 : 0)

  const elegir = (i: number) => {
    if (i < filtradas.length) onCambio(filtradas[i].valor)
    else if (conCrear) onCrear?.(q.trim())
    cerrar()
  }

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={mensaje} className={cx('w-80 max-sm:w-full', className)}>
      <div ref={ref} className="relative">
        <div data-caja className={cajaCampo(mensaje?.tipo ?? 'neutro')} onClick={() => setAbierto(true)}>
          {!abierto && elegida?.inicio}
          <input
            id={id}
            role="combobox"
            aria-expanded={abierto}
            aria-controls={idLista}
            aria-autocomplete="list"
            aria-activedescendant={abierto && total ? `${id}-op-${activa}` : undefined}
            aria-invalid={mensaje?.tipo === 'error' || undefined}
            aria-describedby={describedBy(id, mensaje, ayuda)}
            autoComplete="off"
            value={abierto ? q : elegida?.texto ?? ''}
            placeholder={abierto && elegida ? elegida.texto : placeholder}
            onFocus={() => setAbierto(true)}
            onChange={(e) => { setQ(e.target.value); setActiva(0); setAbierto(true) }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                setAbierto(true)
                if (total) setActiva((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + total) % total)
              } else if (e.key === 'Enter' && abierto && total) { e.preventDefault(); elegir(activa) }
              else if (e.key === 'Escape' && abierto) { e.preventDefault(); cerrar() }
              else if (e.key === 'Tab') cerrar()
            }}
            className={INPUT}
          />
          {!abierto && elegida?.detalle && <span className="shrink-0 font-mono text-xs text-texto-3">{elegida.detalle}</span>}
          <CaretUpDown size={14} aria-hidden className="shrink-0 text-texto-3" />
        </div>
        {abierto && (
          <ul
            id={idLista}
            role="listbox"
            aria-label={typeof rotulo === 'string' ? rotulo : undefined}
            className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-tarjeta border border-borde bg-superficie p-1 shadow-flotante"
          >
            {filtradas.map((o, i) => (
              <li key={o.valor} role="presentation">
                {o.grupo && o.grupo !== filtradas[i - 1]?.grupo && (
                  <div aria-hidden className="px-2 pb-1 pt-2 text-[11px] font-medium text-texto-3">{o.grupo}</div>
                )}
                <div
                  id={`${id}-op-${i}`}
                  role="option"
                  aria-selected={o.valor === valor}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => elegir(i)}
                  onPointerMove={() => setActiva(i)}
                  className={cx('flex h-9 cursor-pointer items-center gap-2 rounded-interno px-2 text-sm text-tinta max-sm:h-11', i === activa && 'bg-hover')}
                >
                  {o.inicio}
                  <span className="min-w-0 flex-1 truncate"><Coincidencia texto={o.texto} busqueda={q} /></span>
                  {o.detalle && <span className="shrink-0 font-mono text-xs text-texto-3"><Coincidencia texto={o.detalle} busqueda={q} /></span>}
                  {o.valor === valor && <Check size={14} aria-hidden className="shrink-0 text-acento" />}
                </div>
              </li>
            ))}
            {conCrear && (
              <li role="presentation">
                <div
                  id={`${id}-op-${filtradas.length}`}
                  role="option"
                  aria-selected={false}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => elegir(filtradas.length)}
                  onPointerMove={() => setActiva(filtradas.length)}
                  className={cx('flex h-9 cursor-pointer items-center gap-2 rounded-interno border-t border-divisor px-2 text-sm text-texto-2 max-sm:h-11', activa === filtradas.length && 'bg-hover')}
                >
                  <Plus size={14} aria-hidden /> Crear «{q.trim()}»
                </div>
              </li>
            )}
            {total === 0 && <li className="px-2 py-3 text-[13px] text-texto-3">Nada con «{q}».</li>}
          </ul>
        )}
      </div>
    </EnvoltorioCampo>
  )
}
