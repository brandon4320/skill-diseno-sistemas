'use client'

import { useRef, useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * "+ Agregar …" al final de su propia lista, en gris (SKILL.md §5 Acciones).
 * Al tocarlo se convierte en el renglón nuevo: Enter guarda y deja el siguiente abierto,
 * Esc o salir vacío lo cierra y devuelve el foco al botón.
 */
export type AgregarAlFinalProps = {
  /** "Agregar tarea". */
  texto: string
  /** Placeholder del renglón ("Escribí la tarea y Enter"). */
  placeholder?: string
  onAgregar: (texto: string) => void | Promise<void>
}

export function AgregarAlFinal({ texto, placeholder = 'Escribí y Enter', onAgregar }: AgregarAlFinalProps) {
  const [abierto, setAbierto] = useState(false)
  const [valor, setValor] = useState('')
  const boton = useRef<HTMLButtonElement>(null)

  const cerrar = () => { setAbierto(false); setValor(''); requestAnimationFrame(() => boton.current?.focus()) }

  if (abierto) {
    return (
      <div className="flex h-9 items-center gap-2 pointer-coarse:h-12">
        <span aria-hidden className="ml-px size-[18px] shrink-0 rounded-full border-[1.5px] border-borde-fuerte opacity-50" />
        <input
          autoFocus
          aria-label={texto}
          value={valor}
          placeholder={placeholder}
          onChange={e => setValor(e.target.value)}
          onBlur={() => { if (!valor.trim()) cerrar() }}
          onKeyDown={async e => {
            if (e.key === 'Escape') { e.stopPropagation(); cerrar() }
            if (e.key === 'Enter' && valor.trim()) { await onAgregar(valor.trim()); setValor('') }
          }}
          className="h-8 min-w-0 flex-1 rounded-chip border border-acento bg-superficie px-2.5 text-[13px] text-tinta outline-none ring-3 ring-acento/18 placeholder:text-texto-3 pointer-coarse:h-11 pointer-coarse:text-base"
        />
      </div>
    )
  }
  return (
    <button
      ref={boton}
      type="button"
      onClick={() => setAbierto(true)}
      className={cx(
        '-ml-1.5 inline-flex h-7 cursor-pointer items-center gap-1 rounded-chip px-1.5 text-xs font-medium text-texto-3',
        'transition-colors duration-150 hover:bg-hover hover:text-tinta pointer-coarse:min-h-11',
        FOCO,
      )}
    >
      <Plus size={14} aria-hidden />
      {texto}
    </button>
  )
}
