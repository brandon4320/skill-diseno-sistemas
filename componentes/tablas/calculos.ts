// Lógica pura de las tablas: orden en ciclo, cálculos del pie y formato de montos. Sin React.

export type Direccion = 'asc' | 'desc'
export type Orden = { id: string; dir: Direccion }
export type Densidad = 'compacta' | 'normal' | 'comoda'
export type Calculo = 'suma' | 'promedio' | 'minimo' | 'maximo' | 'conteo' | 'vacias'

/** Alto de fila por densidad (06-tablas · densidad en tres niveles). */
export const ALTO_FILA: Record<Densidad, number> = { compacta: 28, normal: 36, comoda: 44 }

/**
 * Clic en el encabezado: ascendente → descendente → sin orden.
 * Con `sumar` (Mayús + clic) agrega o cicla un segundo criterio sin borrar los otros.
 */
export function ciclarOrden(actual: readonly Orden[], id: string, sumar = false): Orden[] {
  const i = actual.findIndex((o) => o.id === id)
  const sig: Orden | null = i < 0 ? { id, dir: 'asc' } : actual[i].dir === 'asc' ? { id, dir: 'desc' } : null
  if (!sumar) return sig ? [sig] : []
  const resto = actual.filter((o) => o.id !== id)
  return sig ? (i < 0 ? [...resto, sig] : actual.map((o) => (o.id === id ? sig : o))) : resto
}

export type ValorCelda = string | number | Date | null | undefined

function comparar(a: ValorCelda, b: ValorCelda): number {
  const vacioA = a === null || a === undefined || a === ''
  const vacioB = b === null || b === undefined || b === ''
  if (vacioA || vacioB) return vacioA === vacioB ? 0 : vacioA ? 1 : -1 // lo vacío siempre al final
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' })
}

/** Ordena sin mutar, con varios criterios en orden de prioridad. */
export function ordenarFilas<T>(filas: readonly T[], orden: readonly Orden[], valor: (fila: T, id: string) => ValorCelda): T[] {
  if (!orden.length) return [...filas]
  return [...filas].sort((x, y) => {
    for (const o of orden) {
      const c = comparar(valor(x, o.id), valor(y, o.id))
      if (c) return o.dir === 'asc' ? c : -c
    }
    return 0
  })
}

export const NOMBRE_CALCULO: Record<Calculo, string> = {
  suma: 'Suma',
  promedio: 'Promedio',
  minimo: 'Mínimo',
  maximo: 'Máximo',
  conteo: 'Conteo',
  vacias: 'Vacías',
}

/** Resultado del "⌄ Calcular" del pie. Con filtro, se calcula sobre lo filtrado. */
export function calcular(valores: readonly (number | null | undefined)[], tipo: Calculo): number | null {
  const n = valores.filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
  switch (tipo) {
    case 'conteo':
      return n.length
    case 'vacias':
      return valores.length - n.length
    case 'suma':
      return n.reduce((a, v) => a + v, 0)
    case 'promedio':
      return n.length ? n.reduce((a, v) => a + v, 0) / n.length : null
    case 'minimo':
      return n.length ? Math.min(...n) : null
    case 'maximo':
      return n.length ? Math.max(...n) : null
  }
}

/** "$ 1.250.000" sin centavos para montos de tabla; "—" si falta. */
export function formatoMonto(v: number | null | undefined, moneda: 'ARS' | 'USD' = 'ARS'): { simbolo: string; cifra: string } {
  if (v === null || v === undefined || !Number.isFinite(v)) return { simbolo: '', cifra: '—' }
  return {
    simbolo: moneda === 'USD' ? 'US$' : '$',
    cifra: new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v),
  }
}
