import { useId, type ReactNode } from 'react'

type Props = {
  valores: (number | null | undefined)[]
  /** Color de la entidad o del dato. En la protagonista, `sobreColor`. */
  color?: string
  /** Alto en px. 42 en KPI, 56 en tarjeta de entidad, 88–96 en la protagonista. */
  alto?: number
  /** Degradé debajo de la línea. */
  area?: boolean
  /** Punto marcado: índice, 'ultimo' (por defecto) o false. */
  punto?: number | 'ultimo' | false
  /** Globo oscuro sobre el punto (08 "$241K"). */
  globo?: ReactNode
  /** Línea punteada vertical desde el punto hasta abajo (08). */
  guia?: boolean
  /** Trazo blanco y punto blanco con aro del color de fondo. */
  sobreColor?: boolean
  /** Fuerza el piso de la escala (por defecto, el mínimo de la serie). Usá 0 cuando importa la magnitud. */
  min?: number
  /** "Ventas de las últimas 12 semanas, en alza". Si falta, el dibujo queda oculto al lector. */
  etiqueta?: string
  className?: string
}

/* Margen interno (en % del alto) para que el punto y el trazo no se corten arriba ni abajo. */
const ARRIBA = 14
const ABAJO = 10

/** Curva monótona (Fritsch–Carlson): pasa por cada punto y nunca inventa picos ni valles. */
function trazado(p: [number, number][]): string {
  const n = p.length
  if (n < 2) return ''
  if (n === 2) return `M${p[0][0]},${p[0][1]}L${p[1][0]},${p[1][1]}`
  const dx: number[] = [], m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1][0] - p[i][0]
    m[i] = (p[i + 1][1] - p[i][1]) / dx[i]
  }
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i])
  t[n - 1] = m[n - 2]
  let d = `M${p[0][0]},${p[0][1]}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += `C${p[i][0] + h},${p[i][1] + h * t[i]} ${p[i + 1][0] - h},${p[i + 1][1] - h * t[i + 1]} ${p[i + 1][0]},${p[i + 1][1]}`
  }
  return d
}

/**
 * Sparkline con área degradé y un punto marcado (06, 08). Sin ejes: va adentro de tarjetas.
 * - El SVG se estira al ancho (viewBox 0..100) y el trazo no se deforma (non-scaling-stroke).
 * - El punto y el globo son HTML encima: siempre redondos, a cualquier ancho.
 * - Se dibuja de izquierda a derecha al aparecer (clip-path con @starting-style, sin JS).
 * - Los huecos (null) se saltean: la línea une lo que hay.
 */
export function Curva({
  valores,
  color = 'var(--color-dato-1)',
  alto = 42,
  area = true,
  punto = 'ultimo',
  globo,
  guia = false,
  sobreColor = false,
  min,
  etiqueta,
  className = '',
}: Props) {
  const id = `curva${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const datos = valores.map((v, i) => [i, v] as const).filter((x): x is readonly [number, number] => x[1] != null && Number.isFinite(x[1]))

  if (datos.length === 0) {
    return (
      <div className={`relative w-full ${className}`} style={{ height: alto }} aria-hidden>
        <div className="absolute inset-x-0 bottom-[30%] border-t border-dashed border-borde" />
      </div>
    )
  }

  const ys = datos.map((d) => d[1])
  const lo = min ?? Math.min(...ys)
  const hi = Math.max(...ys, lo)
  const rango = hi - lo || 1
  const ultimoI = Math.max(1, valores.length - 1)
  const pts: [number, number][] = datos.map(([i, v]) => [
    valores.length === 1 ? 50 : (i / ultimoI) * 100,
    hi === lo ? 50 : ARRIBA + (1 - (v - lo) / rango) * (100 - ARRIBA - ABAJO),
  ])
  if (pts.length === 1) pts.unshift([0, pts[0][1]])

  const d = trazado(pts)
  const trazo = sobreColor ? '#fff' : color
  const iPunto = punto === false ? -1 : punto === 'ultimo' ? pts.length - 1 : pts.findIndex((_, k) => datos[k]?.[0] === punto)
  const pp = iPunto >= 0 ? pts[iPunto] : null

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ height: alto }}
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible transition-[clip-path] duration-[1100ms] ease-(--ease) [clip-path:inset(-20%_-2%_-20%_-2%)] motion-reduce:transition-none starting:[clip-path:inset(-20%_100%_-20%_-2%)]"
      >
        {area && (
          <>
            <defs>
              <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: trazo, stopOpacity: sobreColor ? 0.3 : 0.22 }} />
                <stop offset="1" style={{ stopColor: trazo, stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d={`${d}L${pts[pts.length - 1][0]},100L${pts[0][0]},100Z`} fill={`url(#${id})`} />
          </>
        )}
        {pp && guia && (
          <line x1={pp[0]} x2={pp[0]} y1={pp[1]} y2={100} strokeWidth={1} style={{ stroke: trazo, strokeOpacity: 0.45 }} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        )}
        <path d={d} fill="none" style={{ stroke: trazo }} strokeWidth={sobreColor ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>

      {pp && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] delay-700 duration-300 ease-(--ease) motion-reduce:transition-none starting:[scale:.4] starting:opacity-0"
          style={{ left: `${pp[0]}%`, top: `${pp[1]}%` }}
        >
          <span
            className="block size-[9px] rounded-full"
            style={
              sobreColor
                ? { background: '#fff', boxShadow: '0 0 0 4px rgb(255 255 255 / .25)' }
                : { background: 'var(--color-superficie)', boxShadow: `inset 0 0 0 2.5px ${color}, 0 0 0 4px color-mix(in oklch, ${color} 16%, transparent)` }
            }
          />
          {globo != null && (
            <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-chip bg-tinta px-2 py-1 text-xs font-medium whitespace-nowrap text-superficie tabular-nums shadow-flotante after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-tinta">
              {globo}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
