'use client'
/** Ayudas internas de capas/: clases, Esc, foco atrapado y foco de regreso. */
import { useEffect, useRef, type RefObject } from 'react'

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
export const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
export const EASE = 'ease-[cubic-bezier(.23,1,.32,1)]'
export const ENFOCABLES =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Mientras `activo`, Esc llama a `alCerrar`. */
export function useEsc(activo: boolean, alCerrar: () => void) {
  const ref = useRef(alCerrar)
  ref.current = alCerrar
  useEffect(() => {
    if (!activo) return
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        ref.current()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [activo])
}

/**
 * Atrapa el Tab dentro de `caja` mientras esté abierta y, al cerrarse, devuelve el foco
 * a lo que lo tenía antes. Enfoca `[data-autofoco]` o el primer enfocable.
 */
export function useFocoAtrapado(abierta: boolean, caja: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!abierta) return
    const previo = document.activeElement as HTMLElement | null
    const el = caja.current
    const primero = el?.querySelector<HTMLElement>('[data-autofoco]') ?? el?.querySelector<HTMLElement>(ENFOCABLES)
    requestAnimationFrame(() => primero?.focus())
    const f = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !el) return
      const todos = [...el.querySelectorAll<HTMLElement>(ENFOCABLES)].filter((x) => x.offsetParent !== null)
      const a = todos[0]
      const z = todos[todos.length - 1]
      if (!a || !z) return
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', f)
    const scroll = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', f)
      document.body.style.overflow = scroll
      previo?.focus?.()
    }
  }, [abierta, caja])
}
