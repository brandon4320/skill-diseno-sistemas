'use client'

import { useState } from 'react'
import { colorDe, cx, iniciales } from './utilidades'

export type Persona = {
  /** Id estable: define el color del monograma. */
  id: string
  nombre: string
  /** Foto o avatar ilustrado. Si falta o no carga, va el monograma. */
  foto?: string
}

export type TamanoAvatar = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type PresenciaAvatar = 'en-linea' | 'ausente' | 'ocupado'

export type AvatarProps = {
  persona: Persona
  /** xs 20 · sm 26 · md 32 · lg 40 · xl 56 px */
  tamano?: TamanoAvatar
  presencia?: PresenciaAvatar
  /** Borde de 2,5 px del color de la superficie (para pilas o sobre fotos). */
  anillo?: boolean
  /** Si el nombre ya se lee al lado, el avatar no se anuncia. */
  decorativo?: boolean
  className?: string
}

const TAMANO: Record<TamanoAvatar, { caja: string; letra: string; punto: string }> = {
  xs: { caja: 'size-5', letra: 'text-[8.5px]', punto: 'size-1.5' },
  sm: { caja: 'size-[26px]', letra: 'text-[10px]', punto: 'size-2' },
  md: { caja: 'size-8', letra: 'text-xs', punto: 'size-2.5' },
  lg: { caja: 'size-10', letra: 'text-[13px]', punto: 'size-2.5' },
  xl: { caja: 'size-14', letra: 'text-xl', punto: 'size-3' },
}

const PRESENCIA: Record<PresenciaAvatar, { clase: string; texto: string }> = {
  'en-linea': { clase: 'bg-verde-texto', texto: 'En línea' },
  ausente: { clase: 'bg-ambar-texto', texto: 'Ausente' },
  ocupado: { clase: 'bg-rojo-texto', texto: 'Ocupado' },
}

/**
 * Avatar: foto, o monograma pastel con iniciales del color fijo de la persona.
 * La presencia va como punto con anillo y texto para lector de pantalla.
 */
export function Avatar({ persona, tamano = 'md', presencia, anillo = false, decorativo = false, className }: AvatarProps) {
  const [fallo, setFallo] = useState(false)
  const t = TAMANO[tamano]
  const color = colorDe(persona.id)
  const conFoto = persona.foto && !fallo

  return (
    <span className={cx('relative inline-flex shrink-0', className)}>
      {conFoto ? (
        <img
          src={persona.foto}
          alt={decorativo ? '' : persona.nombre}
          onError={() => setFallo(true)}
          className={cx(t.caja, 'rounded-full bg-suave object-cover', anillo && 'ring-[2.5px] ring-superficie')}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          role={decorativo ? undefined : 'img'}
          aria-label={decorativo ? undefined : persona.nombre}
          aria-hidden={decorativo || undefined}
          className={cx(
            t.caja,
            t.letra,
            'inline-grid place-items-center rounded-full font-medium tracking-tight select-none',
            anillo && 'ring-[2.5px] ring-superficie',
          )}
          style={{ background: `color-mix(in oklch, ${color} 15%, var(--color-superficie))`, color }}
        >
          {iniciales(persona.nombre)}
        </span>
      )}
      {presencia && (
        <span
          className={cx(
            'absolute right-0 bottom-0 rounded-full ring-2 ring-superficie',
            t.punto,
            PRESENCIA[presencia].clase,
          )}
        >
          <span className="sr-only">{PRESENCIA[presencia].texto}</span>
        </span>
      )}
    </span>
  )
}
