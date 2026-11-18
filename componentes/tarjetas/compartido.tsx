/**
 * Piezas chicas que comparten las tarjetas: caja de tarjeta, barra de uso y formato de números.
 * Requieren tokens.css (bg-superficie, border-borde, rounded-tarjeta, shadow-hover…).
 */
import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../base/utilidades'

/** Número es-AR con separador de miles: 48000 → "48.000". */
export const miles = (n: number) => n.toLocaleString('es-AR', { maximumFractionDigits: 0 })

/** Caja común: 20 px de radio, borde hairline, sube 2 px al pasar el mouse si es clickeable. */
export function CajaTarjeta({
  clickeable = false,
  apagada = false,
  className,
  children,
  ...resto
}: ComponentProps<'article'> & { clickeable?: boolean; apagada?: boolean; children: ReactNode }) {
  return (
    <article
      {...resto}
      className={cx(
        'flex min-w-0 flex-col gap-4 rounded-tarjeta border border-borde bg-superficie p-5',
        'transition-[transform,box-shadow,border-color] duration-200 ease-(--ease)',
        clickeable && 'hover:-translate-y-0.5 hover:shadow-hover motion-reduce:hover:translate-y-0',
        apagada && 'bg-panel',
        className,
      )}
    >
      {children}
    </article>
  )
}

/** Barra fina de avance: valor sobre total, con color propio o el acento. */
export function BarraUso({ valor, total, color, rotulo }: { valor: number; total: number; color?: string; rotulo: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((valor / total) * 100)) : 0
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={valor}
      className="h-1.5 w-full overflow-hidden rounded-full bg-suave"
    >
      <div
        className="h-full rounded-full bg-acento transition-[width] duration-500 ease-(--ease)"
        style={{ width: `${pct}%`, ...(color ? { background: color } : null) }}
      />
    </div>
  )
}
