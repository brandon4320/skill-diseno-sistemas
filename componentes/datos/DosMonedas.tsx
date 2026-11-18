import type { ReactNode } from 'react'

/*
 * Moneda local y dólares LADO A LADO, con el mismo tamaño (SKILL.md §5 "Dos monedas").
 * - La local a la izquierda, los dólares a la derecha; nunca se suman ni se pasan a una sola.
 * - Cada una con su chip de color fijo en todo el sistema (acá: local azul, dólar verde).
 * - Si una está en cero se muestra igual ("US$ 0").
 * Uso:
 *   <DosMonedas
 *     local={<><ChipMoneda codigo="ARS" /><Cifra .../><p>63 contratos</p></>}
 *     dolares={<><ChipMoneda codigo="USD" /><Cifra .../><p>2 contratos</p></>}
 *   />
 */

export type MonedaLado = { codigo: string; color: string; fondo: string }

const MONEDAS: Record<string, MonedaLado> = {
  ARS: { codigo: 'ARS', color: '#3b6fe0', fondo: '#e8effc' },
  USD: { codigo: 'USD', color: '#1f9d5c', fondo: '#e5f5ec' },
}

/** Chip "ARS" / "USD" arriba de cada cifra. `sobreColor` para la tarjeta protagonista. */
export function ChipMoneda({ codigo, sobreColor = false }: { codigo: string; sobreColor?: boolean }) {
  const m = MONEDAS[codigo] ?? { codigo, color: 'var(--color-texto-2)', fondo: 'var(--color-suave)' }
  return (
    <span
      className="inline-flex h-5 items-center rounded-[6px] px-1.5 font-mono text-[10.5px] font-semibold tracking-[0.02em]"
      style={sobreColor ? { background: 'rgb(255 255 255 / .18)', color: '#fff' } : { background: m.fondo, color: m.color }}
    >
      {m.codigo}
    </span>
  )
}

/** Dos columnas iguales separadas por una línea de 1 px. En tarjetas angostas, `apiladas`. */
export function DosMonedas({
  local,
  dolares,
  apiladas = false,
  sobreColor = false,
  className = '',
}: {
  local: ReactNode
  dolares: ReactNode
  apiladas?: boolean
  sobreColor?: boolean
  className?: string
}) {
  const linea = sobreColor ? 'border-white/20' : 'border-divisor'
  if (apiladas) {
    return (
      <div className={className}>
        <div>{local}</div>
        <div className={`mt-3 border-t border-dashed pt-3 ${linea}`}>{dolares}</div>
      </div>
    )
  }
  return (
    <div className={`grid grid-cols-2 ${className}`}>
      <div className="min-w-0 pr-3.5">{local}</div>
      <div className={`min-w-0 border-l pl-3.5 ${linea}`}>{dolares}</div>
    </div>
  )
}

/** Pie partido en dos mitades alineadas con las columnas de arriba. */
export function PieDosMonedas({ local, dolares }: { local: ReactNode; dolares: ReactNode }) {
  return (
    <div className="grid grid-cols-2 text-xs font-medium text-texto-2">
      <span className="min-w-0 truncate pr-3.5">{local}</span>
      <span className="min-w-0 truncate pl-[calc(0.875rem+1px)]">{dolares}</span>
    </div>
  )
}
