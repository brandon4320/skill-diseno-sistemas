'use client'

import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { CircleNotch, type Icon } from '@phosphor-icons/react'
import { Tooltip, type LadoTooltip } from './Tooltip'
import { cx, FOCO } from './utilidades'

/**
 * principal: el único relleno de la pantalla (tinta, invertido en oscuro).
 * secundario: con borde y sombra mínima.
 * texto: sin caja, para acciones de poco peso ("Restaurar", "Ver todo").
 * El tamaño (normal 38 px / chico 28 px) y "solo ícono" se combinan con cualquiera.
 */
export type VarianteBoton = 'principal' | 'secundario' | 'texto'
export type TamanoBoton = 'normal' | 'chico'

type Comun = Omit<ComponentProps<'button'>, 'children'> & {
  variante?: VarianteBoton
  tamano?: TamanoBoton
  /** Ícono a la izquierda (Phosphor, peso regular). */
  icono?: Icon
  /** Ícono a la derecha (flecha, caret). */
  iconoFinal?: Icon
  /**
   * Muestra "Guardando…" sin cambiar el ancho del botón. Pasarlo (aunque sea false) desde el
   * primer render en los botones que guardan: así el ancho ya contempla el texto de carga.
   */
  cargando?: boolean
  textoCargando?: string
  /** Atajo de teclado visible ("⌘K") o, en solo ícono, dentro del tooltip. */
  atajo?: string
}

type ConTexto = Comun & { children: ReactNode }
/** Solo ícono: el aria-label es obligatorio y se usa como tooltip. */
type SoloIcono = Comun & {
  children?: never
  icono: Icon
  'aria-label': string
  /** false si el botón ya está dentro de otro tooltip o de un menú. */
  tooltip?: boolean
  ladoTooltip?: LadoTooltip
}

export type BotonProps = ConTexto | SoloIcono

const VARIANTE: Record<VarianteBoton, string> = {
  principal: 'bg-tinta text-superficie shadow-principal hover:bg-tinta/90',
  secundario: 'border border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
  texto: 'text-texto-2 hover:bg-suave hover:text-tinta',
}

const TAMANO: Record<TamanoBoton, { caja: string; icono: string; gap: string; px: number }> = {
  normal: { caja: 'h-[38px] rounded-control text-[13px] pointer-coarse:min-h-11', icono: 'size-[38px] pointer-coarse:size-11', gap: 'gap-2', px: 17 },
  chico: { caja: 'h-7 rounded-chip text-xs', icono: 'size-7', gap: 'gap-1.5', px: 14 },
}

export function Boton(props: BotonProps) {
  const {
    variante = 'secundario',
    tamano = 'normal',
    icono: IconoInicio,
    iconoFinal: IconoFin,
    cargando,
    textoCargando = 'Guardando…',
    atajo,
    children,
    className,
    onClick,
    type = 'button',
    ...resto
  } = props
  // Sacamos las props propias de "solo ícono" para que no lleguen al <button>.
  const { tooltip = true, ladoTooltip = 'arriba', ...nativas } = resto as typeof resto & {
    tooltip?: boolean
    ladoTooltip?: LadoTooltip
  }

  const soloIcono = children == null
  // Solo los botones que pueden cargar reservan el ancho de "Guardando…".
  const conCarga = cargando !== undefined
  const t = TAMANO[tamano]
  const padding = tamano === 'chico' ? 'px-3' : 'px-4'

  // Mientras carga no se deshabilita (perdería el foco): se ignora el click.
  const alClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (cargando) return e.preventDefault()
    onClick?.(e)
  }

  // Las dos capas ocupan la misma celda: el ancho es el mayor de las dos y no salta.
  const contenido = (
    <span className="grid place-items-center">
      <span className={cx('col-start-1 row-start-1 inline-flex items-center', t.gap, cargando && 'invisible')}>
        {IconoInicio && <IconoInicio size={t.px} aria-hidden className="shrink-0" />}
        {children}
        {IconoFin && <IconoFin size={t.px - 2} aria-hidden className="shrink-0 opacity-70" />}
        {atajo && !soloIcono && (
          <kbd className="ml-0.5 rounded-[5px] border border-current/20 px-1 font-mono text-xs font-medium opacity-60">
            {atajo}
          </kbd>
        )}
      </span>
      {conCarga && (
        <span
          aria-hidden={!cargando}
          className={cx('col-start-1 row-start-1 inline-flex items-center', t.gap, !cargando && 'invisible')}
        >
          <CircleNotch size={t.px} aria-hidden className={cx('shrink-0', cargando && 'animate-spin motion-reduce:animate-none')} />
          {!soloIcono && textoCargando}
        </span>
      )}
    </span>
  )

  const boton = (
    <button
      {...nativas}
      type={type}
      onClick={alClick}
      aria-busy={cargando || undefined}
      aria-disabled={cargando || nativas['aria-disabled'] || undefined}
      className={cx(
        'relative inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap select-none',
        'transition-[transform,background-color,box-shadow,color] duration-150 ease-(--ease)',
        'active:scale-[.97] motion-reduce:transition-none motion-reduce:active:scale-100',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress',
        FOCO,
        VARIANTE[variante],
        t.caja,
        soloIcono ? t.icono : padding,
        className,
      )}
    >
      {contenido}
    </button>
  )

  if (soloIcono && tooltip) {
    return (
      <Tooltip texto={nativas['aria-label']} atajo={atajo} lado={ladoTooltip} describir={false}>
        {boton}
      </Tooltip>
    )
  }
  return boton
}
