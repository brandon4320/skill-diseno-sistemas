'use client'

import { ArrowsClockwiseIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { fechaRelativa, type Fecha } from '../datos/formato'

export type FrescuraProps = {
  /** Cuándo llegó el último dato bueno. */
  sincronizado: Fecha
  ahora: Fecha
  /** Nombre del sistema de origen: "Jaque", "AFIP", "Banco". */
  origen?: string
  /** Pasados estos minutos se pone ámbar (60 por defecto). */
  vieja?: number
  /** Si la última corrida falló. */
  error?: string
  /** Recarga; mientras la promesa corre, el ícono gira y dice "Sincronizando…". */
  onSincronizar?: () => Promise<void>
  className?: string
}

/**
 * Frescura del dato (patrón 7.18): "● Sincronizado hace 12 min ⟳" a la derecha de las pestañas.
 * Verde al día, ámbar pasada la hora, rojo con Reintentar si falló.
 */
export function Frescura({ sincronizado, ahora, origen, vieja = 60, error, onSincronizar, className }: FrescuraProps) {
  const [cargando, setCargando] = useState(false)
  const min = (new Date(ahora).getTime() - new Date(sincronizado).getTime()) / 6e4
  const tono = error ? 'error' : min > vieja ? 'vieja' : 'ok'

  async function sincronizar() {
    if (!onSincronizar || cargando) return
    setCargando(true)
    try {
      await onSincronizar()
    } finally {
      setCargando(false)
    }
  }

  return (
    <span
      aria-live="polite"
      className={cx(
        'inline-flex items-center gap-1.5 text-xs whitespace-nowrap',
        tono === 'ok' && 'text-texto-3',
        tono === 'vieja' && 'text-ambar-texto',
        tono === 'error' && 'text-rojo-texto',
        className,
      )}
    >
      <span aria-hidden className={cx('size-[7px] rounded-full', tono === 'ok' ? 'bg-verde-texto' : tono === 'vieja' ? 'bg-ambar-texto' : 'bg-rojo-texto')} />
      {cargando
        ? 'Sincronizando…'
        : error
          ? error
          : `${tono === 'vieja' ? 'Último dato' : 'Sincronizado'} ${fechaRelativa(sincronizado, ahora)}${origen ? ` · ${origen}` : ''}`}
      {onSincronizar &&
        (error && !cargando ? (
          <button type="button" onClick={sincronizar} className={cx('h-6 rounded-chip px-2 font-medium hover:bg-hover max-md:h-11', FOCO)}>
            Reintentar
          </button>
        ) : (
          <button
            type="button"
            onClick={sincronizar}
            aria-label="Sincronizar ahora"
            title="Sincronizar ahora"
            aria-busy={cargando}
            className={cx('grid size-6 place-items-center rounded-chip text-texto-2 hover:bg-hover hover:text-tinta max-md:size-11', FOCO)}
          >
            <ArrowsClockwiseIcon size={14} aria-hidden className={cargando ? 'motion-safe:animate-spin' : undefined} />
          </button>
        ))}
    </span>
  )
}
