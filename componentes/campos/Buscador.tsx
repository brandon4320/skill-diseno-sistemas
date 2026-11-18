'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { INPUT, cajaCampo } from './_campo'

export type BuscadorProps = {
  valor: string
  onCambio: (v: string) => void
  /** Dice qué se busca: "Buscar cliente, CUIT o contrato". */
  placeholder: string
  /** Rótulo para lectores (el placeholder no alcanza). */
  rotulo?: string
  /** Atajo global que enfoca el buscador ("/" o "k" con ⌘/Ctrl). */
  atajo?: '/' | 'k'
  /** "12 resultados" a la derecha mientras hay texto. */
  resultados?: ReactNode
  onEnter?: () => void
  className?: string
}

/** Buscador con lupa, atajo visible, cruz para limpiar (y Esc) y la cantidad de resultados. */
export function Buscador({ valor, onCambio, placeholder, rotulo = 'Buscar', atajo = '/', resultados, onEnter, className }: BuscadorProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const escribiendo = t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
      if (atajo === 'k' ? (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' : e.key === '/' && !escribiendo) {
        e.preventDefault()
        ref.current?.focus()
        ref.current?.select()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [atajo])
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <div role="search" className={cx('w-80 max-sm:w-full', className)}>
      <div data-caja className={cajaCampo('neutro', 'pr-1.5')}>
        <MagnifyingGlass size={16} aria-hidden className="shrink-0 text-texto-3" />
        <input
          ref={ref}
          type="search"
          aria-label={rotulo}
          value={valor}
          placeholder={placeholder}
          onChange={(e) => onCambio(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && valor) { e.preventDefault(); onCambio('') }
            if (e.key === 'Enter') onEnter?.()
          }}
          className={cx(INPUT, '[&::-webkit-search-cancel-button]:hidden')}
        />
        {valor ? (
          <>
            {resultados != null && <span aria-live="polite" className="shrink-0 text-xs text-texto-3 tabular-nums">{resultados}</span>}
            <button
              type="button"
              onClick={() => { onCambio(''); ref.current?.focus() }}
              aria-label="Limpiar búsqueda"
              className={cx('grid size-7 shrink-0 place-items-center rounded-full text-texto-3 hover:bg-hover hover:text-tinta max-sm:size-11', FOCO)}
            >
              <X size={14} aria-hidden />
            </button>
          </>
        ) : (
          <kbd aria-hidden className="shrink-0 rounded-[4px] border border-borde bg-suave px-1.5 font-mono text-xs text-texto-3 max-sm:hidden">
            {atajo === 'k' ? (mac ? '⌘K' : 'Ctrl K') : '/'}
          </kbd>
        )}
      </div>
    </div>
  )
}
