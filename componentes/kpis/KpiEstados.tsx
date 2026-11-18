import type { ElementType, ReactNode } from 'react'
import { ArrowUpRightIcon, WarningIcon } from '@phosphor-icons/react/ssr'
import { cx, FOCO } from '../base/utilidades'

const BANDEJA = 'flex min-w-0 flex-col rounded-tarjeta border border-borde bg-suave p-1'
const TARJETA = 'flex flex-1 flex-col rounded-interno border border-borde bg-superficie p-4 shadow-min [[data-tema=oscuro]_&]:shadow-none'

export type KpiAtencionProps = {
  rotulo: string
  valor: ReactNode
  /** Qué pasa, en una oración: "3 facturas vencidas hace más de 30 días". */
  motivo: ReactNode
  /** La acción que lo resuelve: "Ver vencidas". */
  accion: string
  href: string
  enlace?: ElementType
  tono?: 'rojo' | 'ambar'
  className?: string
}

/**
 * KPI que requiere atención: misma bandeja, cifra en el tono del estado y un pie que es la
 * acción que lo resuelve. El color nunca va solo: lleva ícono y texto.
 */
export function KpiAtencion({ rotulo, valor, motivo, accion, href, enlace: Enlace = 'a', tono = 'rojo', className }: KpiAtencionProps) {
  const t = tono === 'rojo' ? { texto: 'text-rojo-texto', fondo: 'bg-rojo-fondo' } : { texto: 'text-ambar-texto', fondo: 'bg-ambar-fondo' }
  return (
    <section className={cx(BANDEJA, className)}>
      <header className="flex h-9 items-center gap-2 px-3 text-[13px] font-medium text-texto-2">
        <WarningIcon size={16} aria-hidden className={t.texto} />
        <h3 className="truncate">{rotulo}</h3>
      </header>
      <div className={TARJETA}>
        <div className={cx('font-display text-[32px] leading-[1.1] font-medium tracking-[-.03em] tabular-nums', t.texto)}>{valor}</div>
        <p className="mt-1 text-xs text-texto-2">{motivo}</p>
      </div>
      <Enlace href={href} className={cx('group/pie mt-1 flex min-h-[34px] items-center gap-2 rounded-interno px-3 text-xs font-semibold', t.fondo, t.texto, FOCO)}>
        {accion}
        <ArrowUpRightIcon size={14} aria-hidden className="ml-auto transition-transform duration-200 group-hover/pie:translate-x-px group-hover/pie:-translate-y-px" />
      </Enlace>
    </section>
  )
}

/** KPI cargando: esqueleto con la forma final (§6b), sin spinner ni "Cargando…". */
export function KpiCargando({ rotulo, className }: { rotulo: string; className?: string }) {
  const barra = 'animate-pulse rounded-chip bg-suave motion-reduce:animate-none'
  return (
    <section aria-busy className={cx(BANDEJA, className)}>
      <header className="flex h-9 items-center px-3 text-[13px] font-medium text-texto-2">
        <h3 className="truncate">{rotulo}</h3>
      </header>
      <div className={TARJETA} aria-hidden>
        <div className={cx('h-[34px] w-2/3', barra)} />
        <div className={cx('mt-2 h-3 w-1/2', barra)} />
        <div className={cx('mt-4 h-4', barra)} />
      </div>
      <div className="flex min-h-[34px] items-center px-3" aria-hidden>
        <span className="h-3 w-1/3 animate-pulse rounded-chip bg-borde/60 motion-reduce:animate-none" />
      </div>
      <span className="sr-only">Cargando {rotulo}</span>
    </section>
  )
}

export type KpiSinDatosProps = {
  rotulo: string
  /** Por qué no hay: "Todavía no cargaste horas este mes". */
  motivo: ReactNode
  /** La primera acción: <Boton>Cargar horas</Boton>. */
  accion?: ReactNode
  icono?: ReactNode
  className?: string
}

/** KPI sin datos: "—" en gris, el motivo y la primera acción. Nunca "0" ni una tarjeta vacía. */
export function KpiSinDatos({ rotulo, motivo, accion, icono, className }: KpiSinDatosProps) {
  return (
    <section className={cx(BANDEJA, className)}>
      <header className="flex h-9 items-center gap-2 px-3 text-[13px] font-medium text-texto-2">
        {icono && <span className="flex text-texto-3 [&>svg]:size-4">{icono}</span>}
        <h3 className="truncate">{rotulo}</h3>
      </header>
      <div className={TARJETA}>
        <div className="font-display text-[32px] leading-[1.1] font-medium text-texto-3">—</div>
        <p className="mt-1 text-xs text-texto-3">{motivo}</p>
        {accion && <div className="mt-4">{accion}</div>}
      </div>
    </section>
  )
}
