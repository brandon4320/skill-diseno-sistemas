'use client'
/**
 * Edición en la celda: clic o Enter abre el editor en el lugar (texto, lista, fecha o monto).
 * Enter guarda, Esc cancela, Tab guarda y sigue. Guarda en la celda (◌ → ✓), sin botón Guardar.
 * Si `onGuardar` falla, vuelve al valor anterior y muestra el error en la misma celda.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CheckIcon, CircleNotchIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type TipoEditor = 'texto' | 'lista' | 'fecha' | 'monto'
type Estado = 'quieta' | 'editando' | 'guardando' | 'guardado' | 'error'

export type CeldaEditableProps = {
  valor: string
  tipo?: TipoEditor
  opciones?: string[]
  /** Nombre del campo para lectores de pantalla: "Responsable de FAC-01101". */
  etiqueta: string
  onGuardar: (nuevo: string) => Promise<void> | void
  /** Dibujo en reposo (pastilla, avatar + nombre). Por defecto, el valor o "—". */
  vista?: ReactNode
}

export function CeldaEditable({ valor, tipo = 'texto', opciones = [], etiqueta, onGuardar, vista }: CeldaEditableProps) {
  const [estado, setEstado] = useState<Estado>('quieta')
  const [borrador, setBorrador] = useState(valor)
  const campo = useRef<HTMLInputElement & HTMLSelectElement>(null)
  const boton = useRef<HTMLButtonElement>(null)

  useEffect(() => { if (estado === 'editando') { campo.current?.focus(); if (tipo !== 'lista') campo.current?.select?.() } }, [estado, tipo])
  useEffect(() => {
    if (estado !== 'guardado') return
    const t = setTimeout(() => setEstado('quieta'), 1400)
    return () => clearTimeout(t)
  }, [estado])

  const abrir = () => { setBorrador(valor); setEstado('editando') }
  const cancelar = () => { setEstado('quieta'); requestAnimationFrame(() => boton.current?.focus()) }
  const guardar = async (volverFoco: boolean) => {
    if (borrador === valor) { if (volverFoco) cancelar(); else setEstado('quieta'); return }
    setEstado('guardando')
    try {
      await onGuardar(borrador)
      setEstado('guardado')
    } catch {
      setBorrador(valor)
      setEstado('error')
    }
    if (volverFoco) requestAnimationFrame(() => boton.current?.focus())
  }
  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); void guardar(true) }
    else if (e.key === 'Escape') { e.preventDefault(); cancelar() }
    else if (e.key === 'Tab') void guardar(false)
  }

  if (estado === 'editando') {
    const clase = cx('h-8 w-full min-w-0 rounded-chip border border-tinta bg-superficie px-2 text-[13px] text-tinta outline-none max-md:h-11', tipo === 'monto' && 'text-right tabular-nums')
    return tipo === 'lista' ? (
      <select ref={campo} aria-label={etiqueta} value={borrador} onChange={(e) => setBorrador(e.target.value)} onKeyDown={teclas} onBlur={() => void guardar(false)} className={clase}>
        {opciones.map((o) => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input
        ref={campo}
        aria-label={etiqueta}
        type={tipo === 'fecha' ? 'date' : 'text'}
        inputMode={tipo === 'monto' ? 'decimal' : undefined}
        value={borrador}
        onChange={(e) => setBorrador(e.target.value)}
        onKeyDown={teclas}
        onBlur={() => void guardar(false)}
        className={clase}
      />
    )
  }

  return (
    <button
      ref={boton}
      type="button"
      onClick={abrir}
      aria-label={`${etiqueta}: ${valor || 'vacío'}. Editar`}
      className={cx('group inline-flex h-8 w-full min-w-0 items-center gap-1.5 rounded-chip px-2 text-left text-[13px] text-tinta hover:bg-hover max-md:min-h-11', tipo === 'monto' && 'justify-end tabular-nums', FOCO)}
    >
      <span className="min-w-0 truncate">{vista ?? (valor || <span className="text-texto-3">—</span>)}</span>
      <span aria-live="polite" className="shrink-0">
        {estado === 'guardando' && <CircleNotchIcon size={14} aria-label="Guardando" className="animate-spin text-texto-3" />}
        {estado === 'guardado' && <CheckIcon size={14} weight="bold" aria-label="Guardado" className="text-verde-texto" />}
        {estado === 'error' && <WarningCircleIcon size={14} aria-label="No se pudo guardar" className="text-rojo-texto" />}
      </span>
    </button>
  )
}
