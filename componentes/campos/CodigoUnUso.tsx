'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cx } from '../base/utilidades'
import { MensajeCampo, type Mensaje } from './_campo'

export type CodigoUnUsoProps = {
  rotulo?: ReactNode
  /** "Te lo mandamos a sofia@orbe.com.ar". */
  ayuda?: ReactNode
  largo?: number
  valor: string
  onCambio: (v: string) => void
  /** Se llama solo cuando se completan todos los dígitos (también al pegar). */
  onCompleto?: (v: string) => void
  mensaje?: Mensaje | null
  /** Segundos para poder pedir otro; con onReenviar muestra "Reenviar en 0:42". */
  esperaSegundos?: number
  onReenviar?: () => void
  disabled?: boolean
  className?: string
}

/** Código de un solo uso: casillas que avanzan solas, pegar completa todo, Backspace vuelve, autocompletar del SMS. */
export function CodigoUnUso({ rotulo = 'Código', ayuda, largo = 6, valor, onCambio, onCompleto, mensaje, esperaSegundos = 30, onReenviar, disabled, className }: CodigoUnUsoProps) {
  const id = useId()
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [espera, setEspera] = useState(esperaSegundos)
  useEffect(() => {
    if (!onReenviar || espera <= 0) return
    const t = setTimeout(() => setEspera((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [espera, onReenviar])

  const digitos = Array.from({ length: largo }, (_, i) => valor[i] ?? '')
  const poner = (desde: number, texto: string) => {
    const nuevos = texto.replace(/\D/g, '')
    if (!nuevos) return
    const arr = [...digitos]
    for (let k = 0; k < nuevos.length && desde + k < largo; k++) arr[desde + k] = nuevos[k]
    const v = arr.join('')
    onCambio(v)
    refs.current[Math.min(largo - 1, desde + nuevos.length)]?.focus()
    if (v.length === largo && !arr.includes('')) onCompleto?.(v)
  }
  const error = mensaje?.tipo === 'error'

  return (
    <div role="group" aria-labelledby={`${id}-rotulo`} aria-describedby={mensaje ? `${id}-mensaje` : ayuda ? `${id}-ayuda` : undefined} className={cx('flex flex-col gap-1.5', className)}>
      <span id={`${id}-rotulo`} className="text-[13px] font-medium text-texto-2">{rotulo}</span>
      <div className="flex gap-2">
        {digitos.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            aria-label={`Dígito ${i + 1} de ${largo}`}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={i === 0 ? largo : 1}
            disabled={disabled}
            value={d}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const v = e.target.value
              if (!v) { onCambio(digitos.map((x, k) => (k === i ? '' : x)).join('').trimEnd()); return }
              poner(i, v.length > 1 ? v : v.slice(-1))
            }}
            onPaste={(e) => { e.preventDefault(); poner(0, e.clipboardData.getData('text')) }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !d && i > 0) { e.preventDefault(); refs.current[i - 1]?.focus(); onCambio(digitos.map((x, k) => (k === i - 1 ? '' : x)).join('')) }
              if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
              if (e.key === 'ArrowRight' && i < largo - 1) refs.current[i + 1]?.focus()
            }}
            className={cx(
              'size-11 rounded-control border bg-superficie text-center font-mono text-xl text-tinta shadow-min outline-none transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none max-sm:size-12',
              error ? 'border-rojo-texto' : 'border-borde-fuerte focus:border-acento focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-acento)_18%,transparent)]',
              i === Math.floor(largo / 2) && largo >= 6 && 'ml-2',
            )}
          />
        ))}
      </div>
      {mensaje ? <MensajeCampo id={`${id}-mensaje`} mensaje={mensaje} /> : ayuda && <p id={`${id}-ayuda`} className="text-xs text-texto-3">{ayuda}</p>}
      {onReenviar && (
        <p className="text-xs text-texto-3">
          {espera > 0 ? (
            <span className="tabular-nums">Reenviar en 0:{String(espera).padStart(2, '0')}</span>
          ) : (
            <button type="button" onClick={() => { onReenviar(); setEspera(esperaSegundos) }} className="font-medium text-acento underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-acento/45 max-sm:inline-flex max-sm:h-11 max-sm:items-center">
              Mandar otro código
            </button>
          )}
        </p>
      )}
    </div>
  )
}
