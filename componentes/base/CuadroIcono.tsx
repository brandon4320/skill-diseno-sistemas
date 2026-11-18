import type { Icon } from '@phosphor-icons/react'
import { cx, TONOS, type Tono } from './utilidades'

export type TamanoCuadro = 'chico' | 'normal' | 'grande'

type Comun = {
  icono: Icon
  /** chico 22 px (al lado de un título) · normal 36 px (filas, bandeja) · grande 40 px (cabecera de hoja). */
  tamano?: TamanoCuadro
  /** Si el ícono dice algo que no está escrito al lado, describirlo. Si no, es decorativo. */
  etiqueta?: string
  className?: string
}

/**
 * neutro: cuadrado blanco con borde y sombra mínima, ícono gris (sobre bandeja, ref. 08).
 * estado: fondo al 10 % del estado (filas de aviso).
 * entidad: color fijo de la entidad con ícono relleno en blanco (proyectos, clientes).
 * heroe: translúcido blanco, para la tarjeta protagonista de color.
 */
export type CuadroIconoProps =
  | (Comun & { variante?: 'neutro' })
  | (Comun & { variante: 'estado'; tono: Tono })
  | (Comun & { variante: 'entidad'; color: string })
  | (Comun & { variante: 'heroe' })

const TAMANO: Record<TamanoCuadro, { caja: string; icono: number }> = {
  chico: { caja: 'size-[22px] rounded-chip', icono: 12 },
  normal: { caja: 'size-9 rounded-control', icono: 17 },
  grande: { caja: 'size-10 rounded-control', icono: 19 },
}

/** Ícono en cuadro: la única forma en que un ícono lleva color (SKILL.md §6). */
export function CuadroIcono(props: CuadroIconoProps) {
  const { icono: Icono, tamano = 'normal', etiqueta, className } = props
  const t = TAMANO[tamano]

  let estilo = ''
  let fondo: string | undefined
  let peso: 'regular' | 'fill' = 'regular'

  switch (props.variante) {
    case 'estado':
      estilo = cx(TONOS[props.tono].fondo, TONOS[props.tono].texto)
      break
    case 'entidad':
      estilo = 'text-white shadow-[inset_0_1px_0_rgb(255_255_255/.22)]'
      fondo = props.color
      peso = 'fill'
      break
    case 'heroe':
      estilo = 'border border-white/20 bg-white/15 text-white'
      break
    default:
      estilo = 'border border-borde bg-superficie text-texto-2 shadow-min'
  }

  return (
    <span
      role={etiqueta ? 'img' : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : true}
      className={cx('inline-grid shrink-0 place-items-center', t.caja, estilo, className)}
      style={fondo ? { background: fondo } : undefined}
    >
      <Icono size={t.icono} weight={peso} aria-hidden />
    </span>
  )
}
