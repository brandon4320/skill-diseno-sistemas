'use client'

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Check, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { flechaEnGrupo } from './_campo'

/* Grupos de radio a la vista: chips (pocas opciones cortas), tarjetas (opciones con consecuencia)
   y miniaturas (elegir una forma). Flechas para moverse, Tab entra y sale del grupo. */

type Base<V extends string> = {
  rotulo: ReactNode
  valor: V | null
  onCambio: (v: V) => void
  /** Oculta el rótulo (queda para lectores). */
  ocultarRotulo?: boolean
  className?: string
}

function useGrupo<V extends string>(valores: V[], valor: V | null, onCambio: (v: V) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const actual = Math.max(0, valores.indexOf(valor as V))
  const props = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => { refs.current[i] = el },
    role: 'radio' as const,
    type: 'button' as const,
    'aria-checked': valores[i] === valor,
    tabIndex: i === actual ? 0 : -1,
    onClick: () => onCambio(valores[i]),
    onKeyDown: (e: KeyboardEvent) => {
      const n = flechaEnGrupo(e, i, valores.length)
      if (n != null) { onCambio(valores[n]); refs.current[n]?.focus() }
    },
  })
  return props
}

function Rotulo({ id, rotulo, oculto }: { id: string; rotulo: ReactNode; oculto?: boolean }) {
  return <span id={id} className={cx('text-[13px] font-medium text-texto-2', oculto && 'sr-only')}>{rotulo}</span>
}

/* ───────── chips ───────── */

export type OpcionChip<V extends string> = { valor: V; texto: string; icono?: Icon; /** "12" gris al lado. */ cuenta?: number }
export type OpcionesChipsProps<V extends string> = Base<V> & { opciones: OpcionChip<V>[] }

/** Chips en lugar de un desplegable: todas las opciones a la vista, una elegida. */
export function OpcionesChips<V extends string>({ rotulo, opciones, valor, onCambio, ocultarRotulo, className }: OpcionesChipsProps<V>) {
  const id = useId()
  const props = useGrupo(opciones.map((o) => o.valor), valor, onCambio)
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Rotulo id={id} rotulo={rotulo} oculto={ocultarRotulo} />
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1.5">
        {opciones.map((o, i) => {
          const on = o.valor === valor
          const Icono = o.icono
          return (
            <button
              key={o.valor}
              {...props(i)}
              className={cx(
                'inline-flex h-8 items-center gap-1.5 rounded-chip border px-3 text-[13px] transition-colors duration-150 motion-reduce:transition-none max-sm:h-11',
                on ? 'border-acento bg-acento-suave text-tinta' : 'border-borde bg-superficie text-texto-2 hover:bg-hover',
                FOCO,
              )}
            >
              {Icono && <Icono size={14} weight={on ? 'fill' : 'regular'} aria-hidden />}
              {o.texto}
              {o.cuenta != null && <span className="font-mono text-xs text-texto-3 tabular-nums">{o.cuenta}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── tarjetas ───────── */

export type OpcionTarjeta<V extends string> = {
  valor: V
  titulo: string
  /** Qué pasa si se elige: "Se factura el 1 de cada mes". */
  descripcion?: ReactNode
  icono?: Icon
  /** "Recomendado", precio, plazo. */
  extra?: ReactNode
  deshabilitada?: boolean
}
export type TarjetasOpcionProps<V extends string> = Base<V> & { opciones: OpcionTarjeta<V>[]; columnas?: 2 | 3 }

/** Tarjetas de opción: para elecciones con consecuencia que necesitan una línea de explicación. */
export function TarjetasOpcion<V extends string>({ rotulo, opciones, valor, onCambio, ocultarRotulo, columnas = 2, className }: TarjetasOpcionProps<V>) {
  const id = useId()
  const props = useGrupo(opciones.map((o) => o.valor), valor, onCambio)
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Rotulo id={id} rotulo={rotulo} oculto={ocultarRotulo} />
      <div role="radiogroup" aria-labelledby={id} className={cx('grid gap-2 max-sm:grid-cols-1', columnas === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {opciones.map((o, i) => {
          const on = o.valor === valor
          const Icono = o.icono
          return (
            <button
              key={o.valor}
              {...props(i)}
              disabled={o.deshabilitada}
              className={cx(
                'relative flex items-start gap-3 rounded-tarjeta border bg-superficie p-3 text-left transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none',
                on ? 'border-acento shadow-[0_0_0_1px_var(--color-acento)]' : 'border-borde hover:border-borde-fuerte hover:shadow-hover',
                'disabled:cursor-not-allowed disabled:opacity-60',
                FOCO,
              )}
            >
              {Icono && (
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-control', on ? 'bg-acento-suave text-acento' : 'bg-suave text-texto-2')}>
                  <Icono size={16} weight="duotone" aria-hidden />
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-tinta">{o.titulo}{o.extra && <span className="text-xs font-normal text-texto-3">{o.extra}</span>}</span>
                {o.descripcion && <span className="text-xs leading-snug text-texto-3">{o.descripcion}</span>}
              </span>
              <span aria-hidden className={cx('grid size-4 shrink-0 place-items-center rounded-full border', on ? 'border-acento bg-acento text-superficie' : 'border-borde-fuerte')}>
                {on && <Check size={10} weight="bold" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── miniaturas ───────── */

export type OpcionMiniatura<V extends string> = { valor: V; texto: string; /** Dibujo chico de la forma (SVG o esquema con divs). */ dibujo: ReactNode }
export type MiniaturasProps<V extends string> = Base<V> & { opciones: OpcionMiniatura<V>[] }

/** Miniaturas para elegir una forma (diseño de factura, vista, plantilla): se ve antes de elegir. */
export function Miniaturas<V extends string>({ rotulo, opciones, valor, onCambio, ocultarRotulo, className }: MiniaturasProps<V>) {
  const id = useId()
  const props = useGrupo(opciones.map((o) => o.valor), valor, onCambio)
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Rotulo id={id} rotulo={rotulo} oculto={ocultarRotulo} />
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-3">
        {opciones.map((o, i) => {
          const on = o.valor === valor
          return (
            <button key={o.valor} {...props(i)} className={cx('flex w-28 flex-col items-center gap-1.5 rounded-tarjeta', FOCO)}>
              <span className={cx('flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-tarjeta border bg-suave p-2 transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none', on ? 'border-acento shadow-[0_0_0_1px_var(--color-acento)]' : 'border-borde hover:border-borde-fuerte')}>
                {o.dibujo}
              </span>
              <span className={cx('text-xs', on ? 'font-medium text-tinta' : 'text-texto-2')}>{o.texto}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── color de entidad ───────── */

export type ColorEntidadProps = Omit<Base<string>, 'valor'> & {
  valor: string
  colores: readonly string[]
  /** Nombre de cada color para lectores ("Azul"). */
  nombres?: readonly string[]
}

/** Color de una entidad (etiqueta, proyecto, caja): círculos a la vista, el elegido con tilde. */
export function ColorEntidad({ rotulo, valor, onCambio, colores, nombres, ocultarRotulo, className }: ColorEntidadProps) {
  const id = useId()
  const props = useGrupo([...colores], valor, onCambio)
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Rotulo id={id} rotulo={rotulo} oculto={ocultarRotulo} />
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-1">
        {colores.map((c, i) => (
          <button
            key={c}
            {...props(i)}
            aria-label={nombres?.[i] ?? c}
            className={cx('grid size-8 place-items-center rounded-full max-sm:size-11', FOCO)}
          >
            <span className={cx('grid size-6 place-items-center rounded-full text-white transition-transform duration-150 motion-reduce:transition-none', c === valor && 'scale-110 ring-2 ring-superficie ring-offset-2 ring-offset-[var(--c)]')} style={{ background: c, ['--c' as string]: c }}>
              {c === valor && <Check size={12} weight="bold" aria-hidden />}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
