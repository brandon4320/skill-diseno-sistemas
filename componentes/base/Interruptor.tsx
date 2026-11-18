'use client'

import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { cx, FOCO } from './utilidades'

type Comun = Omit<ComponentProps<'button'>, 'onChange' | 'children' | 'value' | 'defaultValue' | 'role'> & {
  /** Controlado. */
  activo?: boolean
  /** No controlado: valor inicial. */
  porDefecto?: boolean
  onCambio?: (activo: boolean) => void
}

/** Con rótulo: fila de ajuste (título + explicación gris a la izquierda, interruptor a la derecha). */
type ConRotulo = Comun & { rotulo: string; descripcion?: ReactNode }
/** Suelto: necesita aria-label. */
type Suelto = Comun & { rotulo?: never; descripcion?: never; 'aria-label': string }

export type InterruptorProps = ConRotulo | Suelto

/**
 * Interruptor (role="switch") para opciones binarias, con su explicación debajo del título.
 * Encendido = acento. Toda la fila es clickeable cuando lleva rótulo.
 */
export function Interruptor(props: InterruptorProps) {
  const { activo, porDefecto = false, onCambio, rotulo, descripcion, className, disabled, onClick, ...resto } = props
  const [interno, setInterno] = useState(porDefecto)
  const on = activo ?? interno
  const id = useId()

  const cambiar: ComponentProps<'button'>['onClick'] = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (activo === undefined) setInterno(!on)
    onCambio?.(!on)
  }

  const interruptor = (
    <button
      {...resto}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={rotulo ? `${id}-rotulo` : undefined}
      aria-describedby={descripcion ? `${id}-desc` : undefined}
      disabled={disabled}
      onClick={cambiar}
      className={cx(
        'group relative inline-flex h-[22px] w-9 shrink-0 cursor-pointer items-center rounded-full',
        'transition-colors duration-200 ease-(--ease) motion-reduce:transition-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        on ? 'bg-acento' : 'bg-borde-fuerte',
        FOCO,
        !rotulo && className,
      )}
    >
      <span
        aria-hidden
        className={cx(
          'block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/.2),0_0_0_.5px_rgb(0_0_0/.04)]',
          'transition-[translate,width] duration-200 ease-(--ease) motion-reduce:transition-none',
          // Al apretar, la perilla se estira un poco hacia donde va (detalle de iOS).
          'group-active:w-5',
          on ? 'translate-x-[17px] group-active:translate-x-[13px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )

  if (!rotulo) return interruptor

  return (
    <div
      className={cx('flex items-center gap-4', disabled ? 'opacity-60' : 'cursor-pointer', className)}
      // Click en el texto = click en el interruptor (sin duplicar si el click fue en el botón).
      onClick={(e) => {
        if (disabled || (e.target as HTMLElement).closest('[role="switch"]')) return
        ;(e.currentTarget.querySelector('[role="switch"]') as HTMLButtonElement | null)?.click()
      }}
    >
      <div className="min-w-0 flex-1">
        <div id={`${id}-rotulo`} className="text-sm font-medium text-tinta">{rotulo}</div>
        {descripcion && <div id={`${id}-desc`} className="mt-0.5 text-xs text-texto-2">{descripcion}</div>}
      </div>
      {interruptor}
    </div>
  )
}
