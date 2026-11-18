'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CircleNotch, Play, Stop, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Proceso repetible como fila con su botón (patrones 4.5 y 5.6): cobro mensual, IPC, reporte.
 * "Ejecutar" → "Corriendo…" con el ancho fijo (al pasar, "Detener") y los pasos en cascada →
 * el resultado escrito en verbos y cifras en verde ("18 facturas emitidas · $ 20,9 M").
 * Si se detiene, queda en ámbar en qué paso se paró.
 */
export type EjecutarFilaProps = {
  nombre: string
  /** "El 1º de cada mes · 6 pasos". */
  detalle: string
  icono: Icon
  /** "Corrió el 1 nov". */
  ultima: string
  pasos: number
  /**
   * Corre el proceso. Llamá a `avance(i)` al empezar cada paso (0..pasos-1) y devolvé el resultado
   * en una línea. Respetá la señal para poder detenerlo.
   */
  ejecutar: (avance: (paso: number) => void, senal: AbortSignal) => Promise<string>
  /** Responsables, por ejemplo <PilaAvatares>. */
  extra?: ReactNode
}

type Estado = { tipo: 'quieto'; texto: string } | { tipo: 'corre'; paso: number } | { tipo: 'ok'; texto: string } | { tipo: 'parado'; paso: number }

export function EjecutarFila({ nombre, detalle, icono: Ico, ultima, pasos, ejecutar, extra }: EjecutarFilaProps) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'quieto', texto: ultima })
  const control = useRef<AbortController | null>(null)
  const paso = useRef(0)
  useEffect(() => () => control.current?.abort(), [])

  const alClick = async () => {
    if (estado.tipo === 'corre') { control.current?.abort(); setEstado({ tipo: 'parado', paso: paso.current }); return }
    control.current = new AbortController()
    const senal = control.current.signal
    paso.current = 0
    setEstado({ tipo: 'corre', paso: 0 })
    try {
      const res = await ejecutar(i => { paso.current = i; if (!senal.aborted) setEstado({ tipo: 'corre', paso: i }) }, senal)
      if (!senal.aborted) setEstado({ tipo: 'ok', texto: res })
    } catch {
      if (!senal.aborted) setEstado({ tipo: 'parado', paso: paso.current })
    }
  }

  const corre = estado.tipo === 'corre'
  const hechos = estado.tipo === 'corre' ? estado.paso : estado.tipo === 'ok' ? pasos : 0
  const linea =
    estado.tipo === 'corre' ? `Paso ${estado.paso + 1} de ${pasos}…`
      : estado.tipo === 'parado' ? `Detenido en el paso ${estado.paso + 1} de ${pasos}`
        : estado.texto
  const capa = 'col-start-1 row-start-1 inline-flex items-center gap-1 transition-opacity duration-150'

  return (
    <div className="flex min-h-14 flex-wrap items-center gap-3 border-t border-divisor px-4 py-2 first:border-t-0 sm:flex-nowrap sm:pl-5">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-suave text-texto-2"><Ico size={16} aria-hidden /></span>
      <div className="min-w-0 flex-1 basis-[calc(100%-48px)] sm:basis-auto">
        <div className="truncate text-[13px] font-medium text-tinta">{nombre}</div>
        <div className="truncate text-xs text-texto-3">{detalle}</div>
      </div>
      {extra && <div className="hidden sm:block">{extra}</div>}
      <div className="hidden w-[72px] gap-[3px] sm:flex" aria-hidden>
        {Array.from({ length: pasos }, (_, i) => (
          <i key={i} className={cx('h-1.5 flex-1 rounded-[2px] transition-colors duration-300', i < hechos ? 'bg-verde-texto' : i === hechos && corre ? 'animate-pulse bg-acento/45' : 'bg-suave')} />
        ))}
      </div>
      <span
        aria-live="polite"
        className={cx(
          'flex-1 truncate pl-11 text-xs sm:w-[150px] sm:flex-none sm:pl-0',
          estado.tipo === 'ok' ? 'font-medium text-verde-texto' : estado.tipo === 'parado' ? 'font-medium text-ambar-texto' : 'text-texto-3',
        )}
      >
        {linea}
      </span>
      <button
        type="button"
        onClick={alClick}
        aria-busy={corre || undefined}
        aria-label={corre ? `Detener ${nombre}` : `Ejecutar ${nombre}`}
        className={cx(
          'group inline-grid h-7 shrink-0 cursor-pointer place-items-center rounded-chip border border-borde bg-superficie px-2.5 text-xs font-medium text-tinta shadow-min',
          'transition-[background-color,transform] duration-150 hover:bg-hover active:scale-[.97] pointer-coarse:min-h-11',
          FOCO,
        )}
      >
        <span className={cx(capa, corre && 'invisible opacity-0')}><Play size={14} aria-hidden />Ejecutar</span>
        <span className={cx(capa, 'text-texto-2', !corre && 'invisible opacity-0', 'group-hover:invisible group-hover:opacity-0')}>
          <CircleNotch size={14} aria-hidden className="animate-spin motion-reduce:animate-none" />Corriendo…
        </span>
        <span className={cx(capa, 'invisible opacity-0', corre && 'group-hover:visible group-hover:opacity-100')}><Stop size={14} aria-hidden />Detener</span>
      </button>
    </div>
  )
}
