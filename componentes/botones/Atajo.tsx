'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { cx } from '../base/utilidades'

/**
 * Atajos a la vista (patrón 11.5): la teclita va donde está la acción.
 * - <Tecla>: mono 11, 18 px, borde del color del texto al 22 %: sirve dentro de un botón relleno o con borde.
 * - useAtajo('n', fn): escucha la tecla fuera de campos de texto. Con `mod: true` pide ⌘ (Mac) o Ctrl.
 * - useTeclaMod(): devuelve '⌘' o 'Ctrl ' para escribir el atajo según el sistema.
 */
export function Tecla({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cx(
        'inline-grid h-[18px] min-w-[18px] place-items-center rounded-[5px] border border-current/22 px-1 font-mono text-[11px] font-medium opacity-70',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

const esMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent)

export function useTeclaMod(): string {
  return useSyncExternalStore(() => () => {}, () => (esMac() ? '⌘' : 'Ctrl '), () => '⌘')
}

export function useAtajo(tecla: string, hacer: () => void, opciones: { mod?: boolean; activo?: boolean } = {}) {
  const fn = useRef(hacer)
  fn.current = hacer
  const { mod = false, activo = true } = opciones
  useEffect(() => {
    if (!activo) return
    const alTeclear = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const enCampo = t?.closest('input, textarea, select, [contenteditable=""], [contenteditable=true]')
      const conMod = e.metaKey || e.ctrlKey
      if (e.key.toLowerCase() !== tecla.toLowerCase() || e.altKey) return
      if (mod ? !conMod : conMod || enCampo) return
      e.preventDefault()
      fn.current()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [tecla, mod, activo])
}
