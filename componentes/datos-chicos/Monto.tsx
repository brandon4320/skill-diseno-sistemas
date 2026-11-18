import { cx } from '../base/utilidades'

export type MonedaAmplia = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'UYU'

const SIMBOLO: Record<MonedaAmplia, string> = { ARS: '$', USD: 'US$', EUR: '€', BRL: 'R$', UYU: '$U' }
const MENOS = '−'

const nf = (dec: number) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec })

/** 1.234.567 → "1,2 M"; 184.200 → "184,2 mil". */
export function abreviar(n: number): string {
  const a = Math.abs(n)
  const f = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })
  if (a >= 1e6) return `${f.format(a / 1e6)} M`
  if (a >= 1e3) return `${f.format(a / 1e3)} mil`
  return nf(0).format(a)
}

export type MontoProps = {
  valor: number | null | undefined
  moneda?: MonedaAmplia
  /** Centavos en gris (por defecto sí). En celular conviene ocultarlos en filas y dejarlos en el total. */
  centavos?: boolean
  /** "$ 1,2 M": para cabeceras y gráficos. El valor completo va en title. */
  corto?: boolean
  /** texto: 13 en tablas · medio: 20 display · grande: 32 display con la moneda arriba. */
  tamano?: 'texto' | 'medio' | 'grande'
  /** anulado: tachado gris · vencido: rojo · estimado: "≈" y gris. */
  estado?: 'normal' | 'anulado' | 'vencido' | 'estimado'
  /** Segunda línea gris, para bimoneda: "≈ US$ 33.252 al TC 1.450". */
  equivalente?: string
  className?: string
}

/**
 * Monto (patrones 1.9 y 7.14): moneda y centavos en texto-3, un paso más chicos; cifras tabulares;
 * negativo con signo menos tipográfico, nunca entre paréntesis; null → "—" gris. Server Component.
 */
export function Monto({ valor, moneda = 'ARS', centavos = true, corto, tamano = 'texto', estado = 'normal', equivalente, className }: MontoProps) {
  if (valor == null || !Number.isFinite(valor)) return <span className={cx('text-texto-3', className)}>—</span>
  const signo = valor < 0 ? MENOS : ''
  const [ent, dec] = corto ? [abreviar(valor), undefined] : nf(centavos ? 2 : 0).format(Math.abs(valor)).split(',')
  const completo = `${signo}${SIMBOLO[moneda]} ${nf(2).format(Math.abs(valor))}`

  const cuerpo = (
    <span
      title={corto ? completo : undefined}
      className={cx(
        'font-medium whitespace-nowrap tabular-nums',
        tamano === 'medio' && 'font-display text-xl tracking-[-0.01em]',
        tamano === 'grande' && 'font-display text-[32px] leading-none tracking-[-0.02em]',
        estado === 'anulado' && 'text-texto-3 line-through',
        estado === 'vencido' && 'text-rojo-texto',
        estado === 'estimado' && 'text-texto-2',
        estado === 'normal' && valor < 0 && 'text-rojo-texto',
      )}
    >
      {estado === 'estimado' && '≈ '}
      {signo}
      <span
        className={cx(
          'mr-1 font-normal text-texto-3',
          tamano === 'grande' ? 'align-[0.7em] text-base' : tamano === 'medio' ? 'text-xs' : 'text-[11px]',
        )}
      >
        {SIMBOLO[moneda]}
      </span>
      {ent}
      {dec && <span className={cx('font-normal text-texto-3', tamano === 'grande' && 'text-base')}>,{dec}</span>}
    </span>
  )

  if (!equivalente) return <span className={className}>{cuerpo}</span>
  return (
    <span className={cx('inline-flex flex-col', className)}>
      {cuerpo}
      <span className="mt-0.5 text-xs text-texto-3 tabular-nums">{equivalente}</span>
    </span>
  )
}

export type CifraUnidadProps = {
  valor: string | number
  /** "kVA", "h", "m²", "%", "días de cobro". */
  unidad?: string
  /** al-lado: "1.284 horas de uso" · superindice: para columnas alineadas ("40 ^kVA"). */
  posicion?: 'al-lado' | 'superindice'
  /** "de 25 módulos alquilados": la fracción se escribe, no se dibuja. */
  de?: string
  tamano?: 'texto' | 'cifra'
  className?: string
}

/** Cifra con unidad en gris (patrones 7.1, 7.14 y 7.15). Server Component. */
export function CifraUnidad({ valor, unidad, posicion = 'al-lado', de, tamano = 'cifra', className }: CifraUnidadProps) {
  const v = typeof valor === 'number' ? nf(Number.isInteger(valor) ? 0 : 1).format(valor) : valor
  return (
    <span
      className={cx(
        'whitespace-nowrap tabular-nums',
        tamano === 'cifra' ? 'font-display text-2xl font-medium tracking-[-0.02em]' : 'text-[13px] font-medium',
        className,
      )}
    >
      {v}
      {unidad &&
        (posicion === 'superindice' ? (
          <span className="ml-0.5 align-[0.6em] font-sans text-[11px] font-normal tracking-normal text-texto-3">{unidad}</span>
        ) : (
          <span className="ml-1 font-sans text-[13px] font-normal tracking-normal text-texto-3">{unidad}</span>
        ))}
      {de && <span className="ml-1 font-sans text-[13px] font-normal tracking-normal text-texto-3">{de}</span>}
    </span>
  )
}
