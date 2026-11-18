'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { formatear, type Moneda, type NombreFormato } from './formato'

type Props = {
  /** Valor final. null o undefined muestran "—" sin animar. */
  hasta: number | null | undefined
  /** Desde dónde cuenta la primera vez. Después, cada cambio de `hasta` cuenta desde el valor anterior. */
  desde?: number
  /** Por nombre (no una función) para poder usarlo desde un Server Component. */
  formato?: NombreFormato
  moneda?: Moneda
  decimales?: number
  /** ms. ~600–900: que se note que llegó, no que espere. */
  duracion?: number
  className?: string
}

const salida = (t: number) => 1 - (1 - t) ** 3

/**
 * Número que cuenta hasta su valor al aparecer (SKILL.md §1b punto 8).
 * - El HTML del server ya trae el valor final: sin JS o con `prefers-reduced-motion` se ve directo.
 * - Arranca en `useLayoutEffect`, antes de pintar, así no hay parpadeo final → 0 → final.
 * - El lector de pantalla lee solo el valor final, una vez.
 * - `tabular-nums` para que los dígitos no bailen mientras cuenta.
 */
export function Cuenta({ hasta, desde = 0, formato = 'numero', moneda, decimales = 0, duracion = 800, className = '' }: Props) {
  const [v, setV] = useState<number | null | undefined>(hasta)
  /** Último valor pintado: si `hasta` cambia a mitad de camino, sigue desde ahí sin saltar. */
  const ultimo = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (hasta == null || !Number.isFinite(hasta)) {
      setV(hasta)
      return
    }
    const inicio = ultimo.current ?? desde
    if (inicio === hasta || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ultimo.current = hasta
      setV(hasta)
      return
    }
    const f = 10 ** decimales
    const t0 = performance.now()
    let raf = 0
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / duracion)
      const x = p === 1 ? hasta : Math.round((inicio + (hasta - inicio) * salida(p)) * f) / f
      ultimo.current = x
      setV(x)
      if (p < 1) raf = requestAnimationFrame(paso)
    }
    setV(inicio)
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [hasta, desde, decimales, duracion])

  const o = { moneda, decimales }
  return (
    <span className={`tabular-nums ${className}`}>
      <span aria-hidden="true">{formatear(v, formato, o)}</span>
      <span className="sr-only">{formatear(hasta, formato, o)}</span>
    </span>
  )
}
