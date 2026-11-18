import { cx } from '../base/utilidades'

export type MapaCalorProps = {
  /** Filas × columnas: valores[fila][columna]. null = sin dato. */
  valores: Array<Array<number | null>>
  filas: string[]
  columnas: string[]
  /** Texto de cada celda para el lector de pantalla y el title: "Lunes 9 h: 14 tareas". */
  describir?: (fila: string, columna: string, valor: number | null) => string
  color?: string
  /** Leyenda "Menos ▢▢▢▢ Más". */
  leyenda?: boolean
  etiqueta: string
  className?: string
}

const NIVELES = [0, 0.18, 0.38, 0.62, 0.9]

/**
 * Mapa de calor de actividad: 5 niveles del mismo color (no arcoíris), celdas de 14 px con
 * radio 3, rótulos en mono. Con muchas columnas hace scroll horizontal adentro, nunca la página.
 */
export function MapaCalor({ valores, filas, columnas, describir, color = 'var(--color-acento)', leyenda = true, etiqueta, className }: MapaCalorProps) {
  const max = Math.max(1, ...valores.flat().filter((v): v is number => v != null))
  const nivel = (v: number | null) => (v == null || v === 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)))
  const fondo = (n: number) => (n === 0 ? 'var(--color-suave)' : `color-mix(in oklab, ${color} ${Math.round(NIVELES[n] * 100)}%, var(--color-superficie))`)
  const texto = describir ?? ((f, c, v) => `${f} ${c}: ${v ?? 'sin dato'}`)

  return (
    <figure className={cx('min-w-0', className)}>
      <div className="overflow-x-auto pb-1">
        <table className="border-separate border-spacing-[3px]" aria-label={etiqueta}>
          <thead>
            <tr>
              <th scope="col" className="sr-only">
                Fila
              </th>
              {columnas.map((c) => (
                <th key={c} scope="col" className="px-0 font-mono text-[10px] font-normal text-texto-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f}>
                <th scope="row" className="pr-2 text-right font-mono text-[10px] font-normal whitespace-nowrap text-texto-3">
                  {f}
                </th>
                {columnas.map((c, j) => {
                  const v = valores[i]?.[j] ?? null
                  const t = texto(f, c, v)
                  return (
                    <td key={c} title={t} className="size-3.5 rounded-[3px] p-0" style={{ background: fondo(nivel(v)) }}>
                      <span className="sr-only">{t}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leyenda && (
        <figcaption className="mt-2 flex items-center justify-end gap-1 text-[11px] text-texto-3" aria-hidden>
          Menos
          {NIVELES.map((_, n) => (
            <span key={n} className="size-3 rounded-[3px]" style={{ background: fondo(n) }} />
          ))}
          Más
        </figcaption>
      )}
    </figure>
  )
}
