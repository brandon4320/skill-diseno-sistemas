'use client'
/**
 * Complementos de estructura/ErrorEnLugar (bloque, banda, línea):
 *
 * - NotaError: la nota mono gris con código, hora y referencia ("ERR-504 · 18 nov 15:42 · ref 7F3A"),
 *   un botón para copiarla para soporte y el detalle técnico detrás de "Ver detalle".
 * - ErrorBloqueIlustrado: el bloque con la ilustración de error sobre clima rojo, el intento
 *   ("intento 2 de 3") y la nota. Reintentar con ancho fijo y gerundio; sacude si vuelve a fallar.
 * - ErrorKpi: el KPI que no se pudo calcular: "—" gris, causa en una línea y Reintentar.
 *
 *   <ErrorBloqueIlustrado titulo="No pudimos traer las cobranzas"
 *     texto="El servidor tardó demasiado. Lo que cargaste hoy está a salvo."
 *     codigo="ERR-504" cuando={new Date()} referencia="7F3A-21C" intento={{ actual: 1, de: 3 }}
 *     detalle={"GET /api/cobranzas\n504 Gateway Timeout · 30.000 ms"} onReintentar={refetch} />
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowClockwiseIcon, CheckIcon, CircleNotchIcon, CopyIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Ilustracion, CLIMA } from './Ilustracion'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

const hora = (d: Date) => new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' }).format(d).replace(/\./g, '').replace(',', '')

export type NotaErrorProps = {
  codigo: string
  cuando: Date
  referencia?: string
  /** "intento 2 de 3". */
  extra?: string
  detalle?: string
  className?: string
}

export function NotaError({ codigo, cuando, referencia, extra, detalle, className }: NotaErrorProps) {
  const [copiado, setCopiado] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const texto = [codigo, hora(cuando), extra, referencia && `ref ${referencia}`].filter(Boolean).join(' · ')
  async function copiar() {
    try {
      await navigator.clipboard.writeText(detalle ? `${texto}\n${detalle}` : texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      /* sin portapapeles: el texto sigue seleccionable */
    }
  }
  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <span className="font-mono text-xs text-texto-3 tabular-nums select-all">{texto}</span>
        <button type="button" onClick={copiar} aria-label={copiado ? 'Copiado' : 'Copiar código del error'} className={cn('grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta max-md:size-11', FOCO)}>
          {copiado ? <CheckIcon size={14} className="text-verde-texto" /> : <CopyIcon size={14} />}
        </button>
        {detalle && (
          <button type="button" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)} className={cn('h-7 rounded-chip px-2 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}>
            {abierto ? 'Ocultar detalle' : 'Ver detalle'}
          </button>
        )}
      </div>
      <span role="status" className="sr-only">{copiado ? 'Código copiado' : ''}</span>
      {abierto && detalle && <pre className="w-full max-w-[420px] rounded-control border border-borde bg-suave px-3 py-2 text-left font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-texto-2">{detalle}</pre>}
    </div>
  )
}

export type ErrorBloqueIlustradoProps = {
  titulo: string
  /** Qué quedó a salvo o qué hacer. */
  texto?: ReactNode
  codigo: string
  cuando: Date
  referencia?: string
  intento?: { actual: number; de: number }
  detalle?: string
  onReintentar?: () => void | Promise<void>
  className?: string
}

export function ErrorBloqueIlustrado({ titulo, texto, codigo, cuando, referencia, intento, detalle, onReintentar, className }: ErrorBloqueIlustradoProps) {
  const [reintentando, setReintentando] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const previo = useRef(cuando.getTime())
  // Si llega un error nuevo (otra hora) después de reintentar, sacude 320 ms.
  useEffect(() => {
    if (previo.current !== cuando.getTime()) {
      caja.current?.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320 })
      previo.current = cuando.getTime()
    }
  }, [cuando])
  async function reintentar() {
    if (!onReintentar || reintentando) return
    setReintentando(true)
    try {
      await onReintentar()
    } finally {
      setReintentando(false)
    }
  }
  return (
    <div ref={caja} role="alert" className={cn('flex flex-col items-center px-6 py-8 text-center', CLIMA.malo, className)}>
      <Ilustracion nombre="error" tamano="hoja" />
      <h4 className="mt-2 font-display text-xl font-medium tracking-[-.02em] text-tinta">{titulo}</h4>
      {texto && <p className="mt-1 max-w-[34ch] text-[13px] leading-normal text-texto-2">{texto}</p>}
      {onReintentar && (
        <button
          type="button"
          onClick={reintentar}
          aria-busy={reintentando || undefined}
          className={cn('mt-4 inline-flex h-[38px] min-w-[140px] items-center justify-center gap-2 rounded-control border border-borde bg-superficie px-3.5 text-[13px] font-medium shadow-min transition-[background,transform] duration-150 hover:bg-hover active:scale-[.97] aria-busy:cursor-progress aria-busy:text-texto-2 max-md:h-11', FOCO)}
        >
          {reintentando ? <CircleNotchIcon size={16} className="animate-spin motion-reduce:animate-none" /> : <ArrowClockwiseIcon size={16} />}
          {reintentando ? 'Reintentando…' : 'Reintentar'}
        </button>
      )}
      <NotaError className="mt-3" codigo={codigo} cuando={cuando} referencia={referencia} extra={intento && intento.actual > 1 ? `intento ${intento.actual} de ${intento.de}` : undefined} detalle={detalle} />
    </div>
  )
}

/** KPI sin dato: "—" gris (nunca 0), causa en una línea y Reintentar como enlace. */
export function ErrorKpi({ causa = 'No se pudo calcular', codigo, onReintentar }: { causa?: string; codigo?: string; onReintentar?: () => void }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-[32px] leading-none font-medium text-texto-3" aria-label="Sin dato">—</span>
      <span className="mt-2 flex flex-wrap items-center gap-1 text-xs text-texto-3">
        <WarningCircleIcon size={14} className="text-rojo-texto" aria-hidden />
        {causa}
        {onReintentar && (
          <button type="button" onClick={onReintentar} className={cn('font-medium text-acento hover:underline max-md:min-h-11', FOCO)}>
            Reintentar
          </button>
        )}
      </span>
      {codigo && <span className="mt-3 font-mono text-xs text-texto-3">{codigo}</span>}
    </div>
  )
}
