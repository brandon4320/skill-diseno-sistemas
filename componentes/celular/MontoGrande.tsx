'use client'

import { useEffect, useId, useState } from 'react'
import { cx } from '../base/utilidades'

/**
 * Monto grande de formulario (SKILL.md §5 Celular): 44 px centrado con formato en vivo
 * (es-AR, punto de miles y coma decimal), moneda y centavos en gris; debajo, el impacto contra
 * el tope: lo ya cargado sólido y esto rayado. Si se pasa, sacude una vez y dice cuánto sobra.
 * `valor` va en centavos para no perder precisión.
 */
export type MontoGrandeProps = {
  etiqueta: string
  /** En centavos. */
  valor: number
  alCambiar: (centavos: number) => void
  moneda?: string
  /** Tope en centavos y lo ya usado del tope. */
  tope?: number
  usado?: number
}

const miles = (n: number) => Math.trunc(n).toLocaleString('es-AR')

export function MontoGrande({ etiqueta, valor, alCambiar, moneda = '$', tope, usado = 0 }: MontoGrandeProps) {
  const id = useId()
  const [sacude, setSacude] = useState(false)
  const pasado = tope !== undefined && usado + valor > tope
  const sobra = tope !== undefined ? usado + valor - tope : 0

  useEffect(() => {
    if (!pasado) return
    setSacude(true)
    const t = setTimeout(() => setSacude(false), 400)
    return () => clearTimeout(t)
  }, [pasado])

  const entero = Math.floor(valor / 100)
  const cent = String(valor % 100).padStart(2, '0')
  const pctUsado = tope ? Math.min(100, (usado / tope) * 100) : 0
  const pctEsto = tope ? Math.min(100 - pctUsado, (valor / tope) * 100) : 0

  return (
    <div className="flex flex-col items-center px-4">
      <label htmlFor={id} className="text-sm text-texto-2">{etiqueta}</label>
      <div className={cx('relative mt-1 flex items-baseline justify-center', sacude && 'animate-[sacudir_400ms_var(--ease)] motion-reduce:animate-none')}>
        <span aria-hidden className="mr-1.5 font-display text-2xl text-texto-3">{moneda}</span>
        <span aria-hidden className={cx('font-display text-[44px] leading-none font-semibold tabular-nums', pasado ? 'text-rojo-texto' : 'text-tinta')}>{miles(entero)}</span>
        <span aria-hidden className="font-display text-2xl text-texto-3 tabular-nums">,{cent}</span>
        <input
          id={id}
          inputMode="numeric"
          value={valor ? String(valor) : ''}
          onChange={e => alCambiar(Number(e.target.value.replace(/\D/g, '').slice(0, 13)) || 0)}
          aria-describedby={tope !== undefined ? `${id}-tope` : undefined}
          aria-invalid={pasado || undefined}
          className="absolute inset-0 w-full cursor-text bg-transparent text-transparent caret-transparent outline-none"
        />
      </div>
      {tope !== undefined && (
        <div className="mt-4 w-full max-w-xs">
          <div className="flex h-2 overflow-hidden rounded-full bg-suave" aria-hidden>
            <span className="h-full bg-texto-3" style={{ width: `${pctUsado}%` }} />
            <span
              className={cx('h-full', pasado ? 'bg-rojo-texto' : 'bg-acento')}
              style={{ width: `${pctEsto}%`, backgroundImage: 'repeating-linear-gradient(135deg,transparent 0 3px,rgb(255 255 255/.45) 3px 6px)' }}
            />
          </div>
          <p id={`${id}-tope`} className={cx('mt-2 text-center text-sm', pasado ? 'font-medium text-rojo-texto' : 'text-texto-2')}>
            {pasado ? `Sobran ${moneda} ${miles(sobra / 100)} del tope` : `Quedan ${moneda} ${miles((tope - usado - valor) / 100)} de ${moneda} ${miles(tope / 100)}`}
          </p>
        </div>
      )}
    </div>
  )
}
