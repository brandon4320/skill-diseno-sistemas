'use client'
/**
 * Cambios sin guardar: una barra flotante abajo, centrada, que aparece cuando hay algo editado
 * y dice cuánto ("3 cambios sin guardar"). Descartar (texto) y Guardar (relleno), con ⌘S.
 *
 * - Guardar muestra "Guardando…" sin cambiar de ancho; si falla, el error queda en la barra.
 * - useAvisoAlSalir(sucio) pide confirmación del navegador al cerrar o recargar la pestaña.
 * - En celular ocupa el ancho y los botones miden 44 px.
 *
 *   useAvisoAlSalir(cambios > 0)
 *   <CambiosSinGuardar cambios={cambios} onDescartar={reset} onGuardar={guardar} />
 */
import { useEffect, useRef, useState } from 'react'
import { CircleNotchIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { cn, EASE, FOCO } from './compartido'

export function useAvisoAlSalir(sucio: boolean) {
  useEffect(() => {
    if (!sucio) return
    const f = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', f)
    return () => window.removeEventListener('beforeunload', f)
  }, [sucio])
}

export type CambiosSinGuardarProps = {
  cambios: number
  onDescartar: () => void
  /** Si tira error, el mensaje queda en la barra y no se pierde nada. */
  onGuardar: () => Promise<void> | void
  /** Por defecto "Guardar cambios". */
  textoGuardar?: string
}

const BTN = 'inline-flex h-8 items-center justify-center gap-1.5 rounded-control px-3 text-[13px] font-medium whitespace-nowrap active:scale-[.97] transition-transform max-md:h-11'

export function CambiosSinGuardar({ cambios, onDescartar, onGuardar, textoGuardar = 'Guardar cambios' }: CambiosSinGuardarProps) {
  const [fase, setFase] = useState<'quieto' | 'guardando'>('quieto')
  const [error, setError] = useState<string | null>(null)
  const guardarRef = useRef<() => void>(() => {})

  async function guardar() {
    if (fase === 'guardando') return
    setFase('guardando')
    setError(null)
    try {
      await onGuardar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar. Probá de nuevo.')
    } finally {
      setFase('quieto')
    }
  }
  guardarRef.current = () => void guardar()

  useEffect(() => {
    if (cambios <= 0) return
    const f = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        guardarRef.current()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [cambios])

  if (cambios <= 0) return null

  return (
    <div
      role="region"
      aria-label="Cambios sin guardar"
      className={cn(
        'fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-borde bg-superficie py-1.5 pr-1.5 pl-4 shadow-flotante',
        'animate-[ds-barra_260ms_both] motion-reduce:animate-none',
        'max-md:inset-x-4 max-md:translate-x-0 max-md:flex-wrap max-md:rounded-tarjeta max-md:p-3',
        EASE,
      )}
    >
      <style href="ds-barra" precedence="ds">{`@keyframes ds-barra{from{opacity:0;translate:0 8px}}`}</style>
      <span className="text-[13px] text-tinta tabular-nums max-md:basis-full" aria-live="polite">
        {error ? (
          <span className="inline-flex items-center gap-1.5 text-rojo-texto">
            <WarningCircleIcon size={15} weight="fill" aria-hidden />
            {error}
          </span>
        ) : (
          <>
            <b className="font-medium">{cambios}</b> {cambios === 1 ? 'cambio sin guardar' : 'cambios sin guardar'}
          </>
        )}
      </span>
      <div className="flex gap-1.5 max-md:ml-auto">
        <button type="button" onClick={onDescartar} disabled={fase === 'guardando'} className={cn(BTN, 'text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
          Descartar
        </button>
        <button type="button" onClick={() => void guardar()} aria-busy={fase === 'guardando'} className={cn(BTN, 'grid min-w-[136px] bg-tinta text-superficie shadow-principal', FOCO)}>
          <span className={cn('col-start-1 row-start-1 inline-flex items-center gap-1.5', fase === 'guardando' && 'invisible')}>
            {textoGuardar}
            <kbd className="font-mono text-[11px] opacity-70 max-md:hidden">⌘S</kbd>
          </span>
          {fase === 'guardando' && (
            <span className="col-start-1 row-start-1 inline-flex items-center gap-1.5">
              <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" aria-hidden />
              Guardando…
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
