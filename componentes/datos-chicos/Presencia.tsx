import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type EstadoPresencia = 'en-linea' | 'ausente' | 'ocupado' | 'desconectado'

export const TEXTO_PRESENCIA: Record<EstadoPresencia, string> = {
  'en-linea': 'En línea',
  ausente: 'Ausente',
  ocupado: 'No molestar',
  desconectado: 'Desconectado',
}

/* Cada estado con su forma: lleno, aro, con barra, hueco. Se lee sin color. */
const FORMA: Record<EstadoPresencia, string> = {
  'en-linea': 'bg-verde-texto',
  ausente: 'bg-superficie border-[2.5px] border-ambar-texto',
  ocupado: 'bg-rojo-texto',
  desconectado: 'bg-superficie border-2 border-texto-3',
}

export type PuntoPresenciaProps = {
  estado: EstadoPresencia
  /** 8 · 10 (por defecto) · 12 · 14 px. */
  tamano?: 8 | 10 | 12 | 14
  /** Latido de 1,8 s: solo para lo que está pasando ahora (llamada, sincronización en curso). */
  vivo?: boolean
  /** Sin anillo ni posición absoluta: para usar en una línea de texto. */
  suelto?: boolean
  /** Texto para el lector; por defecto el nombre del estado. */
  etiqueta?: string
  className?: string
}

/**
 * Punto de presencia (patrones 9.1 y 15.8). Sobre un avatar va abajo a la derecha con anillo de
 * 2 px de la superficie: envolvé el avatar con <ConPresencia>. Server Component.
 */
export function PuntoPresencia({ estado, tamano = 10, vivo, suelto, etiqueta, className }: PuntoPresenciaProps) {
  return (
    <span
      role="img"
      aria-label={etiqueta ?? TEXTO_PRESENCIA[estado]}
      className={cx(
        'relative inline-block shrink-0 rounded-full',
        FORMA[estado],
        !suelto && 'absolute -right-px -bottom-px ring-2 ring-superficie',
        className,
      )}
      style={{ width: tamano, height: tamano }}
    >
      {estado === 'ocupado' && <i aria-hidden className="absolute top-1/2 right-0.5 left-0.5 h-0.5 -translate-y-1/2 rounded-[1px] bg-superficie" />}
      {vivo && (
        <i
          aria-hidden
          className="absolute -inset-[3px] rounded-full border-2 border-verde-texto opacity-0 motion-safe:animate-[latido_1.8s_cubic-bezier(.23,1,.32,1)_infinite]"
        />
      )}
    </span>
  )
}

/** Envoltorio: el avatar adentro y el punto encima. */
export function ConPresencia({ children, estado, tamano }: { children: ReactNode; estado: EstadoPresencia; tamano?: PuntoPresenciaProps['tamano'] }) {
  return (
    <span className="relative inline-flex shrink-0">
      {children}
      <PuntoPresencia estado={estado} tamano={tamano} />
    </span>
  )
}

/*
 * Keyframes que necesita `vivo` (sumalos una vez en la hoja global):
 *   @keyframes latido { 0% { transform: scale(.6); opacity: .7 } 100% { transform: scale(1.6); opacity: 0 } }
 */
