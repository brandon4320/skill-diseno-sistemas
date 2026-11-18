'use client'
/**
 * Guardado automático y cambios sin guardar.
 *
 * - useAutoguardado(valor, guardar): espera 900 ms sin cambios y guarda. Estados: "limpio",
 *   "sucio", "guardando", "error" (reintenta solo a los 5 s). Devuelve también cuándo guardó.
 * - EstadoGuardado: al lado del título o de las migas, ancho fijo: "● Cambios sin guardar" →
 *   "◌ Guardando…" → "✓ Guardado hace 5 s" → "No se guardó · reintento en 5 s · Reintentar".
 *   Con autoguardado no hay botón Guardar.
 * - BarraCambios: en ajustes (lo que cambia datos de otros): barra negra flotante con los cambios
 *   contados, Descartar y Guardar cambios (⌘S).
 *
 *   const auto = useAutoguardado(cotizacion, (v) => api.guardar(v))
 *   <EstadoGuardado {...auto} />
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckIcon, CircleNotchIcon, WarningCircleIcon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

export type EstadoAuto = 'limpio' | 'sucio' | 'guardando' | 'error'

export function useAutoguardado<T>(valor: T, guardar: (v: T) => Promise<unknown>, { demora = 900, reintento = 5000 } = {}) {
  const [estado, setEstado] = useState<EstadoAuto>('limpio')
  const [guardadoEn, setGuardadoEn] = useState<Date | null>(null)
  const [reintentoEn, setReintentoEn] = useState<number | null>(null)
  const primero = useRef(true)
  const ultimo = useRef(valor)
  const guardarRef = useRef(guardar)
  guardarRef.current = guardar
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const ahora = useCallback(async () => {
    clearTimeout(timer.current)
    setEstado('guardando')
    setReintentoEn(null)
    try {
      await guardarRef.current(ultimo.current)
      setEstado('limpio')
      setGuardadoEn(new Date())
    } catch {
      setEstado('error')
      setReintentoEn(Date.now() + reintento)
      timer.current = setTimeout(() => void ahora(), reintento)
    }
  }, [reintento])

  useEffect(() => {
    if (primero.current) {
      primero.current = false
      return
    }
    ultimo.current = valor
    setEstado((e) => (e === 'error' ? e : 'sucio'))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => void ahora(), demora)
  }, [valor, demora, ahora])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Avisar al salir si quedó algo sin guardar.
  useEffect(() => {
    if (estado === 'limpio') return
    const f = (e: BeforeUnloadEvent) => e.preventDefault()
    addEventListener('beforeunload', f)
    return () => removeEventListener('beforeunload', f)
  }, [estado])

  return { estado, guardadoEn, reintentoEn, reintentar: ahora }
}

function relativo(d: Date, ahora: number) {
  const s = Math.round((ahora - d.getTime()) / 1000)
  if (s < 5) return 'recién'
  if (s < 60) return `hace ${s} s`
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`
  return `a las ${new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d)}`
}

export type EstadoGuardadoProps = {
  estado: EstadoAuto
  guardadoEn: Date | null
  reintentoEn?: number | null
  reintentar?: () => void
  className?: string
}

export function EstadoGuardado({ estado, guardadoEn, reintentoEn, reintentar, className }: EstadoGuardadoProps) {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const base = 'inline-flex min-w-[150px] items-center justify-end gap-1.5 text-xs font-medium whitespace-nowrap tabular-nums'
  return (
    <span role="status" aria-live="polite" className={cn(base, className)}>
      {estado === 'sucio' && (
        <span className="inline-flex items-center gap-1.5 text-ambar-texto">
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          Cambios sin guardar
        </span>
      )}
      {estado === 'guardando' && (
        <span className="inline-flex items-center gap-1.5 text-texto-3">
          <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" aria-hidden />
          Guardando…
        </span>
      )}
      {estado === 'limpio' && guardadoEn && (
        <span className="inline-flex items-center gap-1.5 text-texto-3">
          <CheckIcon size={14} aria-hidden />
          Guardado {relativo(guardadoEn, ahora)}
        </span>
      )}
      {estado === 'error' && (
        <span className="inline-flex items-center gap-1.5 text-rojo-texto">
          <WarningCircleIcon size={14} aria-hidden />
          No se guardó{reintentoEn ? ` · reintento en ${Math.max(1, Math.ceil((reintentoEn - ahora) / 1000))} s` : ''}
          {reintentar && (
            <button type="button" onClick={reintentar} className={cn('font-medium text-acento hover:underline max-md:min-h-11', FOCO)}>
              Reintentar
            </button>
          )}
        </span>
      )}
    </span>
  )
}

export type BarraCambiosProps = {
  cambios: number
  /** "en Cobranzas", "en Perfil y Notificaciones". */
  donde?: string
  onDescartar: () => void
  onGuardar: () => Promise<void> | void
}

/** Barra flotante abajo al centro. Aparece con 1 cambio o más; ⌘S / Ctrl+S guarda. */
export function BarraCambios({ cambios, donde, onDescartar, onGuardar }: BarraCambiosProps) {
  const [guardando, setGuardando] = useState(false)
  const visible = cambios > 0
  const guardar = useCallback(async () => {
    if (guardando) return
    setGuardando(true)
    try {
      await onGuardar()
    } finally {
      setGuardando(false)
    }
  }, [guardando, onGuardar])
  useEffect(() => {
    if (!visible) return
    const f = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void guardar()
      }
    }
    addEventListener('keydown', f)
    return () => removeEventListener('keydown', f)
  }, [visible, guardar])
  return (
    <div
      role="region"
      aria-label="Cambios sin guardar"
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        'fixed bottom-6 left-1/2 z-40 flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-interno bg-tinta py-1.5 pr-1.5 pl-4 text-[13px] text-superficie shadow-flotante transition-[transform,opacity] duration-[240ms] ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="mr-2">
        <b className="block font-medium">Tenés cambios sin guardar</b>
        <small className="block text-xs opacity-80">
          {cambios} {cambios === 1 ? 'cambio' : 'cambios'}
          {donde ? ` ${donde}` : ''}
        </small>
      </div>
      <button type="button" onClick={onDescartar} className={cn('h-7 rounded-chip px-2.5 text-xs font-medium opacity-85 hover:bg-white/10 max-md:h-11', FOCO)}>
        Descartar
      </button>
      <button type="button" onClick={guardar} aria-busy={guardando || undefined} aria-keyshortcuts="Meta+S" className={cn('inline-flex h-7 min-w-[132px] items-center justify-center gap-1 rounded-chip bg-superficie px-2.5 text-xs font-medium text-tinta max-md:h-11', FOCO)}>
        {guardando && <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" />}
        {guardando ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </div>
  )
}
