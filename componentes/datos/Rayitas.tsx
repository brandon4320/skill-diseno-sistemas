import type { CSSProperties } from 'react'

type Props = {
  /** 0..100. Lo que pasa de 100 se recorta (y conviene decirlo en el contexto: "112 % de la meta"). */
  pct: number | null | undefined
  /** Color de la entidad o del dato (`colorDe(id)`, `var(--color-dato-3)`). Nunca el acento. */
  color?: string
  /** Cantidad de rayitas. 34 en una tarjeta de ~300 px; 24 en celular. */
  n?: number
  /** Alto en px. 16 en KPI (07), 10–12 en filas. */
  alto?: number
  /** Dónde debería ir hoy (0..100): una rayita más alta en tinta. "71 % de lo esperado". */
  esperado?: number
  /** Para el lector de pantalla: "Ganado en el mes". */
  etiqueta?: string
  className?: string
}

/**
 * Barra de ticks (07 Loops): rayitas finas, coloreadas hasta el porcentaje y grises el resto.
 * Es el dibujo por defecto de un KPI de avance contra meta. Crecen de a una al aparecer.
 */
export function Rayitas({ pct, color = 'var(--color-dato-3)', n = 34, alto = 16, esperado, etiqueta, className = '' }: Props) {
  const v = Math.max(0, Math.min(100, pct ?? 0))
  const llenas = Math.round((n * v) / 100)
  const marca = esperado == null ? -1 : Math.min(n - 1, Math.max(0, Math.round((n * esperado) / 100) - 1))

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={etiqueta}
      className={`mt-3 flex items-end gap-0.5 ${className}`}
      style={{ height: alto }}
    >
      {Array.from({ length: n }, (_, i) => {
        const llena = i < llenas
        const esMarca = i === marca
        const estilo: CSSProperties = {
          height: esMarca ? alto + 6 : '100%',
          background: esMarca ? 'var(--color-tinta)' : llena ? color : undefined,
          transitionDelay: llena ? `${i * 14}ms` : undefined,
        }
        return (
          <i
            key={i}
            style={estilo}
            className={`block min-w-0 flex-1 origin-bottom rounded-[2px] ${
              llena || esMarca ? '' : 'bg-suave'
            } transition-[scale,opacity] duration-500 ease-(--ease) motion-reduce:transition-none ${
              llena ? 'starting:[scale:1_.2] starting:opacity-0' : ''
            }`}
          />
        )
      })}
    </div>
  )
}
