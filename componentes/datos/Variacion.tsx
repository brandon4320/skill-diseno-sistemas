import { MinusIcon, TrendDownIcon, TrendUpIcon } from '@phosphor-icons/react/ssr'
import { delta, tonoDelta, VACIO, type Sentido, type UnidadDelta } from './formato'

type Props = {
  /** La variación ya calculada (12.4 = +12,4 %). Usá `variacion(actual, anterior)` de formato.ts. */
  valor: number | null | undefined
  /** Contra qué se compara. Obligatorio: un porcentaje sin período no dice nada. "vs. octubre", "esta semana". */
  periodo: string
  /** Lo decide el negocio, no el signo. Mora, gastos, reintegros, días de cobro: 'bajar-es-bueno'. */
  sentido?: Sentido
  unidad?: UnidadDelta
  decimales?: number
  /** Por debajo de esto (en valor absoluto) se considera estable y va en gris. */
  umbral?: number
  /**
   * texto: pie de un KPI (07) · pastilla: chip redondo con fondo al 10 % (06)
   * sobreColor: pastilla translúcida para la tarjeta protagonista.
   */
  variante?: 'texto' | 'pastilla' | 'sobreColor'
  className?: string
}

const COLOR = {
  bueno: 'text-verde-texto',
  malo: 'text-rojo-texto',
  neutro: 'text-texto-2',
} as const

const FONDO = {
  bueno: 'bg-verde-fondo text-verde-texto',
  malo: 'bg-rojo-fondo text-rojo-texto',
  neutro: 'bg-gris-fondo text-gris-texto',
} as const

const LECTURA = { bueno: 'favorable', malo: 'desfavorable', neutro: 'estable' } as const

/**
 * Flecha + cifra + período. El color sale de si es bueno o malo para el negocio:
 * "↘ −8 % vs. octubre" en la mora es verde. Nunca solo color: la flecha dice para dónde
 * y el lector de pantalla escucha "favorable" o "desfavorable".
 */
export function Variacion({
  valor,
  periodo,
  sentido = 'subir-es-bueno',
  unidad = '%',
  decimales = 1,
  umbral = 0,
  variante = 'texto',
  className = '',
}: Props) {
  const sinDato = valor == null || !Number.isFinite(valor)
  const tono = tonoDelta(valor, sentido, umbral)
  const r = sinDato ? 0 : Number(valor.toFixed(decimales))
  const Flecha = r > 0 ? TrendUpIcon : r < 0 ? TrendDownIcon : MinusIcon
  const cifra = sinDato ? VACIO : delta(valor, unidad, decimales)

  if (variante === 'texto') {
    return (
      <span className={`inline-flex min-w-0 items-center gap-1.5 text-xs font-medium tabular-nums ${className}`}>
        <span className={`inline-flex shrink-0 items-center gap-1 font-medium ${sinDato ? 'text-texto-3' : COLOR[tono]}`}>
          {!sinDato && <Flecha size={14} weight="bold" aria-hidden />}
          {cifra}
        </span>
        <span className="truncate text-texto-2">{periodo}</span>
        {!sinDato && <span className="sr-only">, {LECTURA[tono]}</span>}
      </span>
    )
  }

  const caja =
    variante === 'sobreColor'
      ? 'border border-white/20 bg-white/15 text-white backdrop-blur-sm'
      : sinDato
        ? 'bg-gris-fondo text-texto-3'
        : FONDO[tono]

  return (
    <span
      className={`inline-flex h-[22px] shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium tabular-nums whitespace-nowrap ${caja} ${className}`}
      title={periodo}
    >
      {!sinDato && <Flecha size={12} weight="bold" aria-hidden />}
      {cifra}
      <span className="sr-only">
        {' '}
        {periodo}
        {!sinDato && `, ${LECTURA[tono]}`}
      </span>
    </span>
  )
}
