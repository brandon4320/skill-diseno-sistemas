'use client'

import { useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cx } from '../base/utilidades'
import { EnvoltorioCampo, cajaCampo, describedBy, type Mensaje } from './_campo'

export type TextoLargoProps = {
  rotulo: ReactNode
  valor: string
  onCambio: (v: string) => void
  /** Límite de caracteres: el contador aparece cuando falta el 20 % y se pone ámbar/rojo cerca. */
  maximo?: number
  /** Crece con el texto hasta esta cantidad de líneas. */
  lineasMax?: number
  placeholder?: string
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  /** Plantillas o frases de un toque debajo ("Sin novedades", "Llamar el lunes"). */
  frases?: string[]
  id?: string
  className?: string
}

/** Texto largo que crece solo, con contador que aparece cerca del límite y frases rápidas. */
export function TextoLargo({ rotulo, valor, onCambio, maximo, lineasMax = 8, placeholder, opcional, ayuda, mensaje, frases, id: idPropio, className }: TextoLargoProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const linea = parseFloat(getComputedStyle(el).lineHeight) || 20
    el.style.height = `${Math.min(el.scrollHeight, linea * lineasMax + 16)}px`
  }, [valor, lineasMax])

  const quedan = maximo != null ? maximo - valor.length : null
  const mostrarContador = quedan != null && maximo != null && quedan <= maximo * 0.2
  const contador = mostrarContador ? (
    <span aria-live="polite" className={cx('text-xs tabular-nums', quedan < 0 ? 'text-rojo-texto' : quedan <= 10 ? 'text-ambar-texto' : 'text-texto-3')}>
      {quedan < 0 ? `${-quedan} de más` : `Quedan ${quedan}`}
    </span>
  ) : null
  const msj: Mensaje | null = mensaje ?? (quedan != null && quedan < 0 ? { tipo: 'error', texto: `Pasa el límite de ${maximo} caracteres.` } : null)

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda} mensaje={msj} extraRotulo={contador} className={cx('w-full max-w-xl', className)}>
      <div data-caja className={cajaCampo(msj?.tipo ?? 'neutro', 'h-auto items-start py-2 max-sm:h-auto')}>
        <textarea
          ref={ref}
          id={id}
          rows={3}
          value={valor}
          placeholder={placeholder}
          onChange={(e) => onCambio(e.target.value)}
          aria-invalid={msj?.tipo === 'error' || undefined}
          aria-describedby={describedBy(id, msj, ayuda)}
          className="min-h-[60px] w-full resize-none bg-transparent text-sm leading-5 text-tinta outline-none placeholder:text-texto-3 max-sm:text-base"
        />
      </div>
      {frases && frases.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frases.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onCambio(valor ? `${valor.trimEnd()} ${f}` : f)}
              className="h-7 rounded-chip border border-borde bg-superficie px-2.5 text-xs text-texto-2 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45 max-sm:h-11"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </EnvoltorioCampo>
  )
}
