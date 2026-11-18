import { CheckIcon, MinusIcon, XIcon } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

export type EstadoTarea = 'sin-empezar' | 'para-hacer' | 'en-curso' | 'en-revision' | 'hecha' | 'cancelada'

const ESTADO: Record<EstadoTarea, { texto: string; color: string }> = {
  'sin-empezar': { texto: 'Sin empezar', color: 'text-texto-3' },
  'para-hacer': { texto: 'Para hacer', color: 'text-texto-2' },
  'en-curso': { texto: 'En curso', color: 'text-ambar-texto' },
  'en-revision': { texto: 'En revisión', color: 'text-azul-texto' },
  hecha: { texto: 'Hecha', color: 'text-verde-texto' },
  cancelada: { texto: 'Cancelada', color: 'text-rojo-texto' },
}

/** El círculo de 14 px: punteado, vacío, a medias, tres cuartos, lleno con ✓, lleno con ✕. */
export function FormaEstado({ estado, className }: { estado: EstadoTarea; className?: string }) {
  const aro = <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  return (
    <svg viewBox="0 0 14 14" aria-hidden className={cx('size-3.5 shrink-0', className)}>
      {estado === 'sin-empezar' && <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2.2" />}
      {estado === 'para-hacer' && aro}
      {estado === 'en-curso' && (
        <>
          {aro}
          <path d="M7 3.2 A3.8 3.8 0 0 1 7 10.8Z" fill="currentColor" />
        </>
      )}
      {estado === 'en-revision' && (
        <>
          {aro}
          <path d="M7 3.2 A3.8 3.8 0 1 1 3.2 7 L7 7Z" fill="currentColor" />
        </>
      )}
      {estado === 'hecha' && (
        <>
          <circle cx="7" cy="7" r="6.2" fill="currentColor" />
          <path d="M4.4 7.2 6.2 9 9.7 5.4" fill="none" stroke="var(--color-superficie)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {estado === 'cancelada' && (
        <>
          <circle cx="7" cy="7" r="6.2" fill="currentColor" />
          <path d="M5 5l4 4M9 5l-4 4" stroke="var(--color-superficie)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/**
 * Estado por forma (patrones 1.12 y 6.7): el avance se lee en el dibujo, no en el color.
 * Pasado a grises tiene que seguir entendiéndose. Server Component.
 */
export function EstadoForma({ estado, className }: { estado: EstadoTarea; className?: string }) {
  const e = ESTADO[estado]
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap', e.color, className)}>
      <FormaEstado estado={estado} />
      {e.texto}
    </span>
  )
}

/**
 * Lo resuelto en gris (patrón 1.17): ✓ verde chico + palabra en texto-2, sin fondo.
 * La pastilla queda para lo que hay que atender.
 */
export function Resuelto({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-xs whitespace-nowrap text-texto-2', className)}>
      <CheckIcon size={13} aria-hidden className="text-verde-texto" />
      {children}
    </span>
  )
}

/** Pasos en fracción mono: "4/6". */
export function Fraccion({ hechos, total, className }: { hechos: number; total: number; className?: string }) {
  return (
    <span aria-label={`${hechos} de ${total} pasos`} className={cx('font-mono text-xs text-texto-3 tabular-nums', className)}>
      {hechos}/{total}
    </span>
  )
}

/** Tira de pasos de 56 px: un tramo por paso, los hechos en verde. */
export function TiraPasos({ hechos, total, className }: { hechos: number; total: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5', className)}>
      <span aria-hidden className="flex w-14 gap-[3px]">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={cx('h-1 flex-1 rounded-[2px]', i < hechos ? 'bg-verde-texto' : 'bg-suave')} />
        ))}
      </span>
      <Fraccion hechos={hechos} total={total} />
    </span>
  )
}

export type ValorResultado = number | null

export type CeldaResultadoProps = {
  /** 0 a 1. null = sin dato. */
  valor: ValorResultado
  /** Mientras corre: barra esqueleto de 44×8 que después entra desde desenfoque. */
  cargando?: boolean
  /** Desde cuánto es bueno y desde cuánto es dudoso. */
  umbrales?: { bueno: number; dudoso: number }
  className?: string
}

/**
 * Celda de resultado (patrón 1.12): círculo de 22 px con el tono al 12 % y el ícono,
 * más el valor en mono 14 del mismo color (".94"). Server Component.
 */
export function CeldaResultado({ valor, cargando, umbrales = { bueno: 0.85, dudoso: 0.6 }, className }: CeldaResultadoProps) {
  if (cargando)
    return <span aria-label="Calculando" className={cx('inline-block h-2 w-11 animate-pulse rounded-[4px] bg-suave', className)} />
  const tramo = valor == null ? 'nada' : valor >= umbrales.bueno ? 'bueno' : valor >= umbrales.dudoso ? 'dudoso' : 'malo'
  const T = {
    nada: { c: 'text-texto-3', f: 'bg-suave', I: MinusIcon, l: 'Sin dato' },
    bueno: { c: 'text-verde-texto', f: 'bg-verde-fondo', I: CheckIcon, l: 'Pasa' },
    dudoso: { c: 'text-ambar-texto', f: 'bg-ambar-fondo', I: MinusIcon, l: 'Dudoso' },
    malo: { c: 'text-rojo-texto', f: 'bg-rojo-fondo', I: XIcon, l: 'No pasa' },
  }[tramo]
  return (
    <span className={cx('inline-flex items-center gap-2 font-mono text-sm font-medium tabular-nums', T.c, className)}>
      <span className={cx('grid size-[22px] shrink-0 place-items-center rounded-full', T.f)}>
        <T.I size={12} weight="bold" aria-hidden />
      </span>
      <span className="sr-only">{T.l}:</span>
      {valor == null ? '—' : new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor).replace(/^0/, '')}
    </span>
  )
}
