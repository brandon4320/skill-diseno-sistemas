'use client'
/**
 * ErrorEnLugar: el error se cuenta donde pasó, no en un modal. Qué pasó en palabras de la
 * persona, "Reintentar", y lo que ya estaba cargado queda a la vista.
 *
 * - "bloque": ocupa el lugar del contenido que no llegó (tarjeta o tabla vacía).
 * - "banda": tira arriba de datos que SÍ están pero pueden estar viejos ("Mostrando lo de las 14:32").
 * - "linea": dentro de una fila o un pie de hoja, después de una acción que falló.
 *
 * El detalle técnico (código, mensaje del servidor) va escondido detrás de "Ver detalle", en mono.
 */
import { useState, type ReactNode } from 'react'
import { ArrowClockwiseIcon, WarningCircleIcon, WifiSlashIcon, type Icon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

export type ErrorEnLugarProps = {
  /** Qué pasó: "No pudimos traer las facturas". */
  titulo: string
  /** Qué queda a salvo o qué hacer: "Lo que ya estaba cargado sigue a la vista." */
  texto?: ReactNode
  onReintentar?: () => void | Promise<void>
  variante?: 'bloque' | 'banda' | 'linea'
  /** Por defecto: sin conexión para "bloque", alerta para el resto. */
  icono?: Icon
  /** Técnico, para soporte: "HTTP 504 · /api/facturas · 14:32:08". */
  detalle?: string
  className?: string
}

export function ErrorEnLugar({ titulo, texto, onReintentar, variante = 'bloque', icono, detalle, className }: ErrorEnLugarProps) {
  const [reintentando, setReintentando] = useState(false)
  const [verDetalle, setVerDetalle] = useState(false)

  async function reintentar() {
    if (!onReintentar || reintentando) return
    setReintentando(true)
    try {
      await onReintentar()
    } finally {
      setReintentando(false)
    }
  }

  const botonReintentar = onReintentar && (
    <button
      type="button"
      onClick={reintentar}
      disabled={reintentando}
      aria-busy={reintentando}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 font-medium whitespace-nowrap transition-[background,transform] duration-150 active:scale-[.97] disabled:cursor-progress',
        variante === 'linea'
          ? 'h-7 rounded-chip px-1.5 text-xs text-rojo-texto hover:bg-rojo-fondo'
          : 'h-8 rounded-chip border border-borde bg-superficie px-3 text-xs text-tinta shadow-min hover:bg-hover',
        FOCO,
      )}
    >
      <ArrowClockwiseIcon size={14} className={cn(reintentando && 'animate-spin motion-reduce:animate-none')} />
      {reintentando ? 'Reintentando…' : 'Reintentar'}
    </button>
  )

  const bloqueDetalle = detalle && (
    <div className={cn(variante === 'bloque' ? 'mt-1' : 'mt-1.5')}>
      <button
        type="button"
        onClick={() => setVerDetalle((v) => !v)}
        aria-expanded={verDetalle}
        className={cn('rounded-chip text-xs font-medium text-texto-3 underline-offset-4 hover:text-texto-2 hover:underline', FOCO)}
      >
        {verDetalle ? 'Ocultar detalle' : 'Ver detalle'}
      </button>
      {verDetalle && (
        <code className="mt-1.5 block rounded-chip bg-suave px-3 py-1.5 text-left font-mono text-xs break-all text-texto-2 select-all">{detalle}</code>
      )}
    </div>
  )

  if (variante === 'linea') {
    const I = icono ?? WarningCircleIcon
    return (
      <div role="alert" className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-xs', className)}>
        <span className="inline-flex items-center gap-1.5 font-medium text-rojo-texto">
          <I size={14} />
          {titulo}
        </span>
        {texto && <span className="text-texto-2">{texto}</span>}
        {botonReintentar}
        {bloqueDetalle && <div className="basis-full">{bloqueDetalle}</div>}
      </div>
    )
  }

  if (variante === 'banda') {
    const I = icono ?? WarningCircleIcon
    return (
      <div role="alert" className={cn('flex items-start gap-3 rounded-control bg-rojo-fondo px-3 py-3 md:items-center', className)}>
        <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-superficie text-rojo-texto shadow-min">
          <I size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <b className="block text-[13px] font-medium text-tinta">{titulo}</b>
          {texto && <span className="block text-xs text-texto-2">{texto}</span>}
          {bloqueDetalle}
        </div>
        {botonReintentar}
      </div>
    )
  }

  const I = icono ?? WifiSlashIcon
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-2 px-6 py-8 text-center', className)}>
      <span className="grid size-11 place-items-center rounded-control bg-rojo-fondo text-rojo-texto">
        <I size={20} />
      </span>
      <h4 className="font-display mt-1.5 text-base font-medium tracking-[-.01em]">{titulo}</h4>
      {texto && <p className="max-w-64 text-[13px] text-texto-2">{texto}</p>}
      {botonReintentar && <div className="mt-1.5">{botonReintentar}</div>}
      {bloqueDetalle}
    </div>
  )
}
