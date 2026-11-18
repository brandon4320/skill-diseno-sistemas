'use client'
/**
 * Banner de aviso: lo que afecta a toda la pantalla y no se resuelve con un toast
 * (certificado por vencer, solo lectura, error del servidor con código).
 *
 * - Un tono por motivo: info (azul), aviso (ámbar), error (rojo), ok (verde), neutro.
 * - Título en peso 500 y una línea de consecuencia debajo; código y hora en mono si es un error.
 * - Una sola acción principal (borde) y, si hace falta, una de texto. Descartar solo si no es grave.
 * - error usa role="alert"; el resto role="status". En celular las acciones bajan a su propia fila.
 *
 *   <Banner tono="aviso" titulo="El certificado de ARCA vence el 24 nov"
 *     detalle="Sin renovarlo, desde el 24 nov no se pueden emitir facturas."
 *     accion={{ texto: 'Renovar', hacer: renovar }} onDescartar={ocultar} />
 */
import type { ReactNode } from 'react'
import { CheckCircleIcon, InfoIcon, WarningIcon, WarningOctagonIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cn, FOCO } from './compartido'

export type TonoBanner = 'info' | 'aviso' | 'error' | 'ok' | 'neutro'

const TONO: Record<TonoBanner, { caja: string; icono: Icon }> = {
  info: { caja: 'bg-azul-fondo text-azul-texto', icono: InfoIcon },
  aviso: { caja: 'bg-ambar-fondo text-ambar-texto', icono: WarningIcon },
  error: { caja: 'bg-rojo-fondo text-rojo-texto', icono: WarningOctagonIcon },
  ok: { caja: 'bg-verde-fondo text-verde-texto', icono: CheckCircleIcon },
  neutro: { caja: 'border-borde bg-superficie text-texto-2', icono: InfoIcon },
}

export type AccionBanner = { texto: string; hacer: () => void; icono?: Icon }

export type BannerProps = {
  tono?: TonoBanner
  titulo: ReactNode
  /** La consecuencia, en una línea: "Sin renovarlo, desde el 24 nov no se pueden emitir facturas." */
  detalle?: ReactNode
  /** Para errores: "ERR-504 · 18 nov 15:42". */
  codigo?: string
  accion?: AccionBanner
  accionTexto?: AccionBanner
  /** Si se pasa, aparece la ×. No la pases en avisos que bloquean trabajo. */
  onDescartar?: () => void
  icono?: Icon
  className?: string
}

const BTN =
  'inline-flex h-8 items-center gap-1.5 rounded-control px-3 text-[13px] font-medium whitespace-nowrap transition-[background,transform] duration-150 active:scale-[.97] max-md:h-11'

export function Banner({ tono = 'info', titulo, detalle, codigo, accion, accionTexto, onDescartar, icono, className }: BannerProps) {
  const t = TONO[tono]
  const I = icono ?? t.icono
  return (
    <div
      role={tono === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-3 rounded-control border border-transparent py-2.5 pr-2.5 pl-3.5 text-[13px] leading-[1.45] max-md:flex-wrap',
        t.caja,
        className,
      )}
    >
      <I size={18} weight={tono === 'neutro' ? 'regular' : 'fill'} className="flex-none" aria-hidden />
      <div className="min-w-0 flex-1">
        <b className="font-medium">{titulo}</b>
        {(detalle || codigo) && (
          <small className="block text-xs tabular-nums">
            {detalle}
            {codigo && <span className="font-mono">{detalle ? ' · ' : ''}{codigo}</span>}
          </small>
        )}
      </div>
      {(accion || accionTexto || onDescartar) && (
        <div className="flex flex-none items-center gap-2 max-md:w-full max-md:justify-end">
          {accionTexto && (
            <button type="button" onClick={accionTexto.hacer} className={cn(BTN, 'hover:bg-[color-mix(in_oklch,currentColor_10%,transparent)]', FOCO)}>
              {accionTexto.texto}
            </button>
          )}
          {accion && (
            <button
              type="button"
              onClick={accion.hacer}
              className={cn(BTN, 'border border-[color-mix(in_oklch,currentColor_24%,transparent)] bg-superficie text-tinta shadow-min hover:bg-hover', FOCO)}
            >
              {accion.icono && <accion.icono size={14} aria-hidden />}
              {accion.texto}
            </button>
          )}
          {onDescartar && (
            <button
              type="button"
              onClick={onDescartar}
              aria-label="Descartar aviso"
              title="Descartar"
              className={cn('grid size-8 place-items-center rounded-chip opacity-80 hover:bg-[color-mix(in_oklch,currentColor_10%,transparent)] hover:opacity-100 max-md:size-11', FOCO)}
            >
              <XIcon size={14} aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
