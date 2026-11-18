'use client'

import { useId, type ComponentProps, type ReactNode } from 'react'
import { WarningCircle, type Icon } from '@phosphor-icons/react'
import { cx } from './utilidades'

export type CampoProps = Omit<ComponentProps<'input'>, 'prefix' | 'size'> & {
  /** Rótulo arriba del campo, siempre (aunque se oculte visualmente). */
  rotulo: string
  ocultarRotulo?: boolean
  /** Ayuda corta abajo: qué pasa con el dato, no cómo escribirlo. */
  ayuda?: ReactNode
  /** Error en palabras de la persona. Reemplaza la ayuda mientras está. */
  error?: ReactNode
  /** Ícono gris a la izquierda (buscar, calendario). */
  icono?: Icon
  /** Texto o nodo pegado adentro a la izquierda: "US$", "https://". */
  prefijo?: ReactNode
  /** A la derecha: unidad ("%", "kg"), atajo o un botón chico. */
  sufijo?: ReactNode
  /** Montos y cantidades: cifras tabulares alineadas a la derecha. */
  numerico?: boolean
  /** Clases del contenedor (el input usa las suyas). */
  className?: string
}

/**
 * Campo de texto con rótulo, ayuda, error, prefijo y sufijo.
 * Foco: borde del acento + halo de 3 px. Error: borde y texto rojos con ícono (nunca solo color).
 * En celular el texto pasa a 16 px para que iOS no haga zoom.
 */
export function Campo({
  rotulo,
  ocultarRotulo = false,
  ayuda,
  error,
  icono: Icono,
  prefijo,
  sufijo,
  numerico = false,
  className,
  id: idPropio,
  disabled,
  required,
  'aria-describedby': describedPropio,
  ...input
}: CampoProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const conError = error != null && error !== false

  return (
    <div className={cx('flex min-w-0 flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cx('text-[13px] font-medium text-texto-2', ocultarRotulo && 'sr-only')}
      >
        {rotulo}
        {required && <span aria-hidden className="ml-0.5 text-texto-3">*</span>}
      </label>

      <div
        className={cx(
          'flex h-10 items-center gap-2 rounded-control border bg-superficie px-3 shadow-min pointer-coarse:h-11',
          'transition-[border-color,box-shadow] duration-150 ease-(--ease) motion-reduce:transition-none',
          conError
            ? 'border-rojo-texto/60 focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-rojo-texto)_16%,transparent)]'
            : 'border-borde-fuerte hover:border-texto-3/60 focus-within:border-acento focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-acento)_18%,transparent)]',
          disabled && 'bg-suave opacity-70 shadow-none',
        )}
      >
        {Icono && <Icono size={16} aria-hidden className="shrink-0 text-texto-3" />}
        {prefijo != null && <span className="shrink-0 text-[13px] text-texto-3 select-none">{prefijo}</span>}
        <input
          {...input}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={conError || undefined}
          aria-describedby={cx(describedPropio, conError ? idError : ayuda ? idAyuda : undefined) || undefined}
          className={cx(
            'h-full min-w-0 flex-1 bg-transparent text-sm text-tinta outline-none placeholder:text-texto-3',
            'disabled:cursor-not-allowed max-sm:text-base',
            numerico && 'text-right tabular-nums',
          )}
        />
        {sufijo != null && <span className="flex shrink-0 items-center text-[13px] text-texto-3">{sufijo}</span>}
      </div>

      {conError ? (
        <p id={idError} className="flex items-center gap-1 text-xs font-medium text-rojo-texto">
          <WarningCircle size={14} weight="fill" aria-hidden className="shrink-0" />
          {error}
        </p>
      ) : (
        ayuda && <p id={idAyuda} className="text-xs text-texto-3">{ayuda}</p>
      )}
    </div>
  )
}
