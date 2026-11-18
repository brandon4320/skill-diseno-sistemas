'use client'

import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón que dice cuántos hay detrás (SKILL.md §1c.5, patrón 2.5):
 * - `modo="insignia"`: círculo de 14 en tinta sobre el botón ("Filtrar" con 3 filtros activos).
 * - `modo="dentro"`: conteo gris en el texto ("Aprobar 4"), para acciones en lote.
 * El número salta (escala con rebote, 240 ms) cuando cambia. El conteo va en el nombre accesible.
 */
export type BotonConContadorProps = Omit<ComponentProps<'button'>, 'children'> & {
  children: ReactNode
  conteo: number
  /** Cómo se lee: (n) => `Filtrar, ${n} activos`. */
  nombre: (n: number) => string
  modo?: 'insignia' | 'dentro'
  icono?: Icon
  variante?: 'principal' | 'secundario'
}

export function BotonConContador({ children, conteo, nombre, modo = 'insignia', icono: Ico, variante = 'secundario', className, ...resto }: BotonConContadorProps) {
  const num = useRef<HTMLSpanElement>(null)
  const previo = useRef(conteo)
  useEffect(() => {
    if (previo.current === conteo) return
    previo.current = conteo
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    num.current?.animate([{ transform: 'scale(.55)' }, { transform: 'scale(1)' }], { duration: 240, easing: 'cubic-bezier(.34,1.56,.64,1)' })
  }, [conteo])

  const principal = variante === 'principal'
  return (
    <button
      type="button"
      {...resto}
      aria-label={nombre(conteo)}
      className={cx(
        'relative inline-flex h-[38px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control pr-3.5 pl-3 text-[13px] font-medium whitespace-nowrap',
        'transition-[background-color,transform] duration-150 ease-(--ease) active:scale-[.97] motion-reduce:active:scale-100 pointer-coarse:min-h-11',
        principal ? 'bg-tinta text-superficie shadow-principal hover:bg-tinta/90' : 'border border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
        FOCO,
        className,
      )}
    >
      {Ico && <Ico size={17} aria-hidden />}
      {children}
      {modo === 'dentro' && (
        <span ref={num} aria-hidden className={cx('inline-block tabular-nums', principal ? 'opacity-60' : 'text-texto-3')}>{conteo}</span>
      )}
      {modo === 'insignia' && conteo > 0 && (
        <span
          ref={num}
          aria-hidden
          className="absolute -top-1 -right-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-tinta px-[3px] text-[11px] font-medium text-superficie tabular-nums"
        >
          {conteo}
        </span>
      )}
    </button>
  )
}
