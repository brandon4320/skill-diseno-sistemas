import { AlarmIcon, ClockIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr'
import { cx } from '../base/utilidades'
import { aFecha, diasHasta, fechaCorta, fechaRelativa, ZONA, type Fecha } from '../datos/formato'

const completa = (d: Date) =>
  new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: ZONA }).format(d)

export type FechaRelativaProps = {
  fecha: Fecha
  /** "Hoy" del server (todayAR), nunca el del navegador. */
  ahora: Fecha
  /** relativa: "hace 8 min", "ayer 16:00" · absoluta: "9 dic" */
  modo?: 'relativa' | 'absoluta'
  className?: string
}

/**
 * Fecha relativa (patrones 1.15 y 1.16): lo reciente como se habla, pasada la semana "9 dic".
 * La fecha completa queda en title y en datetime. Server Component.
 */
export function FechaRelativa({ fecha, ahora, modo = 'relativa', className }: FechaRelativaProps) {
  const d = aFecha(fecha)
  if (!d) return <span className="text-texto-3">—</span>
  return (
    <time dateTime={d.toISOString()} title={completa(d)} className={cx('text-[13px] whitespace-nowrap text-texto-2 tabular-nums', className)}>
      {modo === 'relativa' ? fechaRelativa(fecha, ahora) : fechaCorta(fecha, ahora)}
    </time>
  )
}

export type VencimientoProps = {
  fecha: Fecha
  ahora: Fecha
  /** Desde cuántos días antes se pone ámbar (7 por defecto). */
  aviso?: number
  /** Para lo que ya se resolvió: va gris aunque haya pasado la fecha. */
  resuelto?: boolean
  /** Con la fecha absoluta adelante ("25 nov  en 7 días"). */
  conFecha?: boolean
  className?: string
}

/**
 * Fecha que apura (patrón 1.11): gris si faltan más de `aviso` días, ámbar hasta hoy,
 * rojo vencida. Siempre con la palabra, nunca solo el color. Server Component.
 */
export function Vencimiento({ fecha, ahora, aviso = 7, resuelto, conFecha = true, className }: VencimientoProps) {
  const d = diasHasta(fecha, ahora)
  if (d == null) return <span className="text-texto-3">—</span>
  const tramo = resuelto ? 'lejos' : d < 0 ? 'pasada' : d === 0 ? 'hoy' : d <= aviso ? 'cerca' : 'lejos'
  const texto =
    d < 0 ? (d === -1 ? 'vencida ayer' : `vencida hace ${-d} días`) : d === 0 ? 'vence hoy' : d === 1 ? 'vence mañana' : `en ${d} días`
  const Icono = tramo === 'pasada' ? WarningCircleIcon : tramo === 'hoy' ? AlarmIcon : tramo === 'cerca' ? ClockIcon : null
  return (
    <span className={cx('inline-flex items-center gap-3 whitespace-nowrap tabular-nums', className)}>
      {conFecha && <span className="text-[13px] text-tinta">{fechaCorta(fecha, ahora)}</span>}
      <span
        className={cx(
          'inline-flex items-center gap-1 text-xs',
          tramo === 'lejos' && 'text-texto-3',
          tramo === 'cerca' && 'font-medium text-ambar-texto',
          tramo === 'hoy' && 'font-semibold text-ambar-texto',
          tramo === 'pasada' && 'font-medium text-rojo-texto',
        )}
      >
        {Icono && <Icono size={13} aria-hidden />}
        {texto}
      </span>
    </span>
  )
}
