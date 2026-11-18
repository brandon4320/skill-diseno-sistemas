'use client'

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from './utilidades'

export type LadoTooltip = 'arriba' | 'abajo' | 'izquierda' | 'derecha'

export type TooltipProps = {
  /** Lo que dice el tooltip: corto, sin punto final. */
  texto: ReactNode
  /** Atajo de teclado que se muestra a la derecha, ej. "⌘K". */
  atajo?: string
  lado?: LadoTooltip
  /** Espera antes de mostrarse (ms). Si otro tooltip se cerró hace poco, aparece al instante. */
  retardo?: number
  /** Si el hijo ya tiene ese mismo texto como aria-label, pasar false para no repetirlo. */
  describir?: boolean
  /** Un solo elemento; idealmente enfocable (botón, enlace). */
  children: ReactElement<{ 'aria-describedby'?: string }>
}

// Momento del último cierre: si se pasa de un ícono al de al lado, el segundo no espera.
let ultimoCierre = 0
const VENTANA_SIN_ESPERA = 400

const POSICION: Record<LadoTooltip, string> = {
  arriba: 'bottom-full left-1/2 mb-2 -translate-x-1/2 origin-bottom',
  abajo: 'top-full left-1/2 mt-2 -translate-x-1/2 origin-top',
  izquierda: 'right-full top-1/2 mr-2 -translate-y-1/2 origin-right',
  derecha: 'left-full top-1/2 ml-2 -translate-y-1/2 origin-left',
}

/**
 * Tooltip oscuro (invertido en modo oscuro). Se abre con el mouse o con foco de teclado,
 * nunca con toque; Esc lo cierra. Lo llevan todos los botones de solo ícono.
 */
export function Tooltip({ texto, atajo, lado = 'arriba', retardo = 450, describir = true, children }: TooltipProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const mostrar = () => {
    clearTimeout(timer.current)
    const espera = Date.now() - ultimoCierre < VENTANA_SIN_ESPERA ? 0 : retardo
    timer.current = setTimeout(() => setVisible(true), espera)
  }
  const ocultar = () => {
    clearTimeout(timer.current)
    setVisible((v) => {
      if (v) ultimoCierre = Date.now()
      return false
    })
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  // Esc cierra el tooltip sin mover el foco.
  useEffect(() => {
    if (!visible) return
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && ocultar()
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [visible])

  const alEntrar = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') mostrar()
  }
  const alEnfocar = (e: FocusEvent) => {
    // Solo foco de teclado: un click no debería dejar el tooltip abierto.
    if ((e.target as HTMLElement).matches(':focus-visible')) mostrar()
  }

  const previo = children.props['aria-describedby']
  const hijo = describir
    ? cloneElement(children, { 'aria-describedby': cx(previo, id) || undefined })
    : children

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={alEntrar}
      onPointerLeave={ocultar}
      onFocus={alEnfocar}
      onBlur={ocultar}
      onPointerDown={ocultar}
    >
      {hijo}
      <span
        id={id}
        role="tooltip"
        className={cx(
          'pointer-events-none absolute z-50 flex w-max max-w-64 items-center gap-2 rounded-chip bg-tinta px-3 py-1.5',
          'text-xs leading-snug font-medium text-superficie shadow-flotante',
          'transition-[opacity,scale,visibility] duration-150 ease-(--ease) motion-reduce:transition-none',
          POSICION[lado],
          visible ? 'scale-100 opacity-100' : 'invisible scale-95 opacity-0',
        )}
      >
        {texto}
        {atajo && (
          <kbd className="rounded-[5px] border border-current/25 px-1 font-mono text-xs font-medium opacity-70">
            {atajo}
          </kbd>
        )}
      </span>
    </span>
  )
}
