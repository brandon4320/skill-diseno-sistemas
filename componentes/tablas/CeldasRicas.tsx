/**
 * Celdas ricas: un marcador de 12–20 px antes de cada valor tipado (logo, avatar, enlace),
 * etiquetas con borde (nunca rellenas), monto con la moneda en gris, título con código en mono,
 * y "Modificó" (avatar + quién + hace cuánto). El color solo en la lectura que pide actuar.
 */
import type { ReactNode } from 'react'
import { colorDe, cx, iniciales } from '../base/utilidades'
import { formatoMonto } from './calculos'

/** Logo de entidad 20 px: inicial blanca sobre el color fijo del cliente, oscurecido para AA. */
export function LogoEntidad({ nombre, chico }: { nombre: string; chico?: boolean }) {
  return (
    <span
      aria-hidden
      style={{ background: `color-mix(in oklch, ${colorDe(nombre)} 72%, black)` }}
      className={cx('grid shrink-0 place-items-center font-semibold text-white', chico ? 'size-4 rounded-[5px] text-[10px]' : 'size-5 rounded-[6px] text-[11px]')}
    >
      {nombre.trim()[0]?.toUpperCase() ?? '·'}
    </span>
  )
}

export function CeldaEntidad({ nombre, bajada }: { nombre: string; bajada?: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <LogoEntidad nombre={nombre} />
      <span className="min-w-0 truncate text-[13px] text-tinta">{nombre}</span>
      {bajada && <span className="truncate text-xs text-texto-3">{bajada}</span>}
    </span>
  )
}

/** Título + código pegado en mono, sin columna aparte para el código. */
export function CeldaTitulo({ titulo, codigo }: { titulo: string; codigo?: string }) {
  return (
    <span className="inline-flex min-w-0 items-baseline gap-2">
      <span className="min-w-0 truncate text-[13px] font-medium text-tinta">{titulo}</span>
      {codigo && <span className="shrink-0 font-mono text-[11px] tracking-[.04em] text-texto-3">{codigo}</span>}
    </span>
  )
}

/** Monto a la derecha, tabular, con la moneda en gris. Lo que falta es "—". */
export function CeldaMonto({ valor, moneda = 'ARS', tono }: { valor: number | null | undefined; moneda?: 'ARS' | 'USD'; tono?: 'rojo' | 'verde' }) {
  const m = formatoMonto(valor, moneda)
  return (
    <span className={cx('block text-right text-[13px] tabular-nums', tono === 'rojo' ? 'text-rojo-texto' : tono === 'verde' ? 'text-verde-texto' : 'text-tinta')}>
      {m.simbolo && <span className="mr-1 text-[11px] text-texto-3">{m.simbolo}</span>}
      {m.cifra}
    </span>
  )
}

/** Etiqueta con borde del color de la entidad: nunca rellena. */
export function EtiquetaBorde({ texto, color }: { texto: string; color?: string }) {
  const c = color ?? colorDe(texto)
  return (
    <span
      style={{ borderColor: `color-mix(in oklch, ${c} 40%, transparent)`, color: `color-mix(in oklch, ${c} 70%, var(--color-tinta))` }}
      className="inline-flex h-5 shrink-0 items-center rounded-[7px] border px-1.5 text-[11px] font-medium whitespace-nowrap"
    >
      {texto}
    </span>
  )
}

/** Columna "Modificó": quién y hace cuánto, con la fecha completa en el title. */
export function CeldaModifico({ persona, cuando }: { persona: string; cuando: Date }) {
  const min = Math.round((Date.now() - cuando.getTime()) / 60000)
  const hace = min < 1 ? 'recién' : min < 60 ? `hace ${min} min` : min < 1440 ? `hace ${Math.round(min / 60)} h` : `hace ${Math.round(min / 1440)} d`
  return (
    <span className="inline-flex min-w-0 items-center gap-2" title={cuando.toLocaleString('es-AR')}>
      <span aria-hidden style={{ background: colorDe(persona) }} className="grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-medium text-white">
        {iniciales(persona)}
      </span>
      <span className="min-w-0 truncate text-[13px] text-tinta">{persona}</span>
      <span className="shrink-0 text-xs text-texto-3">{hace}</span>
    </span>
  )
}
