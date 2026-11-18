type Props = {
  hechos: number
  total: number
  /** Color de la entidad (`colorDe(proyecto.id)`). Para vencidos, `var(--color-rojo-texto)`. */
  color?: string
  /** Bloques que van con otro color al final de los hechos (p. ej. vencidos en rojo). */
  alerta?: number
  colorAlerta?: string
  /** Con más de esto, cada bloque pasa a valer una fracción (no se dibujan 80 bloques). */
  maximo?: number
  alto?: number
  /** "40 %" a la derecha, en display. */
  conPorcentaje?: boolean
  etiqueta?: string
  className?: string
}

/**
 * Barra segmentada (06 Gr8r): "4 de 10 hechas". Cada bloque es una unidad de trabajo,
 * así se lee como cantidad y no solo como porcentaje. Va con su línea "4 de 10 · Vence 9 dic".
 */
export function Bloques({
  hechos,
  total,
  color = 'var(--color-dato-1)',
  alerta = 0,
  colorAlerta = 'var(--color-rojo-texto)',
  maximo = 20,
  alto = 7,
  conPorcentaje = false,
  etiqueta,
  className = '',
}: Props) {
  const t = Math.max(0, total)
  const n = Math.max(1, Math.min(t || 1, maximo))
  const escala = t > maximo ? n / t : 1
  const llenos = Math.round(Math.min(hechos, t) * escala)
  const rojos = Math.min(n - llenos, Math.round(Math.max(0, alerta) * escala))
  const pct = t ? Math.round((Math.min(hechos, t) / t) * 100) : 0

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={t}
        aria-valuenow={Math.min(hechos, t)}
        aria-valuetext={`${hechos} de ${total}`}
        aria-label={etiqueta}
        className="flex min-w-0 flex-1 gap-1"
      >
        {Array.from({ length: n }, (_, i) => {
          const fondo = i < llenos ? color : i < llenos + rojos ? colorAlerta : undefined
          return (
            <i
              key={i}
              className={`block min-w-0 flex-1 rounded-[3px] ${fondo ? '' : 'bg-suave'} transition-[opacity,scale] duration-500 ease-(--ease) motion-reduce:transition-none ${
                fondo ? 'starting:[scale:.4_1] starting:opacity-0' : ''
              }`}
              style={{ height: alto, background: fondo, transitionDelay: fondo ? `${i * 45}ms` : undefined }}
            />
          )
        })}
      </div>
      {conPorcentaje && <b className="font-display shrink-0 text-[13px] font-medium tabular-nums">{pct}&#8239;%</b>}
    </div>
  )
}
