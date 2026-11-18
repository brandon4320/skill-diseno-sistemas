'use client'
/**
 * Sin conexión: en la barra y en el dato, nunca un cartel que tape.
 *
 * - useConexion(): sigue navigator.onLine y los eventos online/offline.
 * - AvisoConexion: pastilla de la cabecera. En línea "Al día · 15:42"; sin red "Sin conexión ·
 *   se guarda al volver" o "2 cambios esperando"; al volver "Enviando 2 cambios…".
 * - DatoViejo: debajo de una cifra que no se pudo refrescar: "de las 15:40".
 * - useColaSinConexion(): guarda acciones mientras no hay red y las manda solas al volver.
 *
 *   const enLinea = useConexion()
 *   const cola = useColaSinConexion(enLinea)
 *   <AvisoConexion enLinea={enLinea} pendientes={cola.pendientes} enviando={cola.enviando} ultima={ultima} />
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { CheckCircleIcon, CircleNotchIcon, ClockCounterClockwiseIcon, WifiSlashIcon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const hhmm = (d: Date) => new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' }).format(d)

function suscribir(cb: () => void) {
  addEventListener('online', cb)
  addEventListener('offline', cb)
  return () => {
    removeEventListener('online', cb)
    removeEventListener('offline', cb)
  }
}

/** true si hay red. En el server responde true para no pintar "sin conexión" de más. */
export function useConexion(): boolean {
  return useSyncExternalStore(suscribir, () => navigator.onLine, () => true)
}

export type AvisoConexionProps = {
  enLinea: boolean
  /** Cambios guardados en el dispositivo esperando la red. */
  pendientes?: number
  /** true mientras se mandan los pendientes al volver. */
  enviando?: boolean
  /** Última sincronización correcta. */
  ultima?: Date
  className?: string
}

export function AvisoConexion({ enLinea, pendientes = 0, enviando, ultima, className }: AvisoConexionProps) {
  const plural = (n: number) => `${n} ${n === 1 ? 'cambio' : 'cambios'}`
  const base = 'inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap transition-colors duration-300'
  let contenido
  if (!enLinea)
    contenido = (
      <span className={cn(base, 'bg-gris-fondo text-texto-2', className)}>
        <WifiSlashIcon size={14} aria-hidden />
        Sin conexión · {pendientes ? `${plural(pendientes)} esperando` : 'se guarda al volver'}
      </span>
    )
  else if (enviando)
    contenido = (
      <span className={cn(base, 'bg-azul-fondo text-azul-texto', className)}>
        <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" aria-hidden />
        Enviando {plural(pendientes)}…
      </span>
    )
  else
    contenido = (
      <span className={cn(base, 'bg-verde-fondo text-verde-texto', className)}>
        <CheckCircleIcon size={14} aria-hidden />
        Al día{ultima ? ` · ${hhmm(ultima)}` : ''}
      </span>
    )
  return (
    <span role="status" aria-live="polite">
      {contenido}
    </span>
  )
}

/** Debajo de una cifra sin refrescar: reloj + "de las 15:40". Se muestra solo sin red. */
export function DatoViejo({ desde, visible = true }: { desde: Date; visible?: boolean }) {
  if (!visible) return null
  return (
    <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-texto-3">
      <ClockCounterClockwiseIcon size={12} aria-hidden />
      de las {hhmm(desde)}
    </span>
  )
}

/**
 * Cola de acciones sin red. `encolar(fn)` la corre ya si hay red; si no, la guarda y la manda sola
 * cuando vuelve, en orden. `pendientes` alimenta AvisoConexion.
 */
export function useColaSinConexion(enLinea: boolean) {
  const cola = useRef<(() => Promise<unknown>)[]>([])
  const [pendientes, setPendientes] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const encolar = useCallback(
    async (fn: () => Promise<unknown>) => {
      if (enLinea) return fn()
      cola.current.push(fn)
      setPendientes(cola.current.length)
    },
    [enLinea],
  )
  useEffect(() => {
    if (!enLinea || !cola.current.length) return
    let vivo = true
    ;(async () => {
      setEnviando(true)
      while (vivo && cola.current.length) {
        const fn = cola.current[0]
        try {
          await fn()
          cola.current.shift()
          setPendientes(cola.current.length)
        } catch {
          break // queda en la cola; se reintenta en el próximo "online"
        }
      }
      if (vivo) setEnviando(false)
    })()
    return () => {
      vivo = false
    }
  }, [enLinea])
  return { encolar, pendientes, enviando }
}
