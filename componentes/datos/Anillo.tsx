import type { ReactNode } from 'react'

type Props = {
  /** 0..100 */
  pct: number | null | undefined
  /** Diámetro en px. 40–48 en filas, 62 en la tarjeta del celular (09), 96–120 de protagonista (13). */
  tamano?: number
  /** Grosor del trazo. ~10 % del diámetro. */
  grosor?: number
  color?: string
  /** Sobre la tarjeta protagonista: trazo blanco y pista translúcida. */
  sobreColor?: boolean
  /** Lo del centro. Por defecto el porcentaje en display. `null` para dejarlo vacío. */
  centro?: ReactNode
  etiqueta?: string
  className?: string
}

/**
 * Anillo de avance (09, 13, 14). Para "vas por la mitad", ocupación o cumplimiento.
 * No es una torta: un solo valor contra su total, con la punta redonda.
 */
export function Anillo({
  pct,
  tamano = 62,
  grosor,
  color = 'var(--color-acento)',
  sobreColor = false,
  centro,
  etiqueta,
  className = '',
}: Props) {
  const v = Math.max(0, Math.min(100, pct ?? 0))
  const g = grosor ?? Math.max(3, Math.round(tamano * 0.1))
  const r = (tamano - g) / 2
  const c = tamano / 2
  const trazo = sobreColor ? '#fff' : color
  const pista = sobreColor ? 'rgb(255 255 255 / .22)' : 'var(--color-suave)'
  const fuente = Math.max(11, Math.round(tamano * 0.24))

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={etiqueta}
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: tamano, height: tamano }}
    >
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" strokeWidth={g} style={{ stroke: pista }} />
        {v > 0 && (
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            style={{ stroke: trazo, strokeDashoffset: 100 - v }}
            strokeWidth={g}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            className="transition-[stroke-dashoffset] duration-1000 ease-(--ease) motion-reduce:transition-none starting:[stroke-dashoffset:100]"
          />
        )}
      </svg>
      {centro !== null && (
        <span
          className={`font-display relative leading-none font-medium tracking-[-.02em] tabular-nums ${sobreColor ? 'text-white' : 'text-tinta'}`}
          style={{ fontSize: fuente }}
        >
          {centro ?? (
            <>
              {Math.round(v)}
              <span className="ml-px text-[.62em] opacity-60">%</span>
            </>
          )}
        </span>
      )}
    </div>
  )
}
