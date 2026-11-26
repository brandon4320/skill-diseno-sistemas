'use client'
/**
 * Sin permisos: de quién es, qué sí podés ver y a quién pedírselo. El permiso se describe por los
 * datos que incluye ("ver saldos y cobros de todos los clientes"), nunca por nombre de tabla.
 *
 * - SinPermisos: la vista entera, con "Pedir acceso" que pasa a pastilla "Pedido a Lucía · 15:42"
 *   y "Cancelar pedido".
 * - CausaBloqueo: la línea con candado al lado de una acción que no se puede usar (la causa
 *   siempre escrita en pantalla, no solo en un tooltip).
 * - DatoOculto: muestra solo el final ("•••• 4821") con quién ve el completo.
 */
import { useState, type ReactNode } from 'react'
import { CircleNotchIcon, HandIcon, InfoIcon, LockSimpleIcon } from '@phosphor-icons/react'
import { Ilustracion, CLIMA } from './Ilustracion'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
const hhmm = (d: Date) => new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' }).format(d)

export type SinPermisosProps = {
  /** "Esta vista es de Administración". */
  titulo: string
  /** Qué sí ve con su rol y a quién pedir: "Con tu rol (Comercial) ves los saldos de tus 14 clientes…". */
  texto: ReactNode
  /** El permiso por sus datos: "ver saldos y cobros de todos los clientes". */
  necesita: string
  /** A quién le llega el pedido. */
  aprobador: string
  /** Manda el pedido. Si no se pasa, no hay botón de pedir. */
  onPedir?: () => Promise<void> | void
  onCancelarPedido?: () => Promise<void> | void
  /** Si ya hay un pedido abierto, cuándo se hizo. */
  pedidoEn?: Date | null
  /** Botón secundario: "Ver mis clientes". */
  alternativa?: ReactNode
  className?: string
}

export function SinPermisos({ titulo, texto, necesita, aprobador, onPedir, onCancelarPedido, pedidoEn: inicial = null, alternativa, className }: SinPermisosProps) {
  const [pedidoEn, setPedidoEn] = useState<Date | null>(inicial)
  const [pidiendo, setPidiendo] = useState(false)
  async function pedir() {
    if (!onPedir || pidiendo) return
    setPidiendo(true)
    try {
      await onPedir()
      setPedidoEn(new Date())
    } finally {
      setPidiendo(false)
    }
  }
  async function cancelar() {
    await onCancelarPedido?.()
    setPedidoEn(null)
  }
  return (
    <div className={cn('flex min-h-[240px] flex-col items-center justify-center px-6 py-8 text-center', CLIMA.neutro, className)}>
      <Ilustracion nombre="sin-permisos" tamano="pagina" />
      <h4 className="mt-2 font-display text-xl font-medium tracking-[-.02em] text-tinta">{titulo}</h4>
      <p className="mt-1 max-w-[40ch] text-[13px] leading-normal text-texto-2">{texto}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-live="polite">
        {pedidoEn ? (
          <>
            <span className="inline-flex h-6 items-center gap-1.5 rounded-chip bg-azul-fondo px-2 text-xs font-medium text-azul-texto">
              <span className="size-1.5 rounded-full bg-current" aria-hidden />
              Pedido a {aprobador} · {hhmm(pedidoEn)}
            </span>
            {onCancelarPedido && (
              <button type="button" onClick={cancelar} className={cn('h-7 rounded-chip px-2.5 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}>
                Cancelar pedido
              </button>
            )}
          </>
        ) : (
          <>
            {onPedir && (
              <button
                type="button"
                onClick={pedir}
                aria-busy={pidiendo || undefined}
                className={cn('inline-flex h-[38px] min-w-[150px] items-center justify-center gap-2 rounded-control bg-tinta px-3.5 text-[13px] font-medium text-superficie shadow-principal transition-transform duration-150 active:scale-[.97] max-md:h-11', FOCO)}
              >
                {pidiendo ? <CircleNotchIcon size={16} className="animate-spin motion-reduce:animate-none" /> : <HandIcon size={16} />}
                {pidiendo ? 'Pidiendo…' : 'Pedir acceso'}
              </button>
            )}
            {alternativa}
          </>
        )}
      </div>
      <p className="mt-3 font-mono text-xs text-texto-3">Necesitás: {necesita}</p>
    </div>
  )
}

/** Línea con candado debajo o al lado de la acción bloqueada. Al botón ponele aria-disabled y aria-describedby a esta línea. */
export function CausaBloqueo({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <span id={id} className={cn('inline-flex items-center gap-1 text-xs text-texto-3', className)}>
      <LockSimpleIcon size={13} aria-hidden />
      {children}
    </span>
  )
}

/** Dato sensible: solo el final a la vista y quién ve el completo. */
export function DatoOculto({ rotulo, final, quienVe, grupos = 3 }: { rotulo: string; final: string; quienVe: string; grupos?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-tarjeta border border-borde bg-superficie px-4 py-3">
      <div className="min-w-0 flex-1">
        <small className="block text-xs text-texto-3">{rotulo}</small>
        <b className="font-mono font-medium tracking-[.06em] text-texto-2" aria-label={`${rotulo} terminado en ${final}`}>
          {'•••• '.repeat(grupos)}
          {final}
        </b>
      </div>
      <span className="grid size-8 place-items-center rounded-[10px] border border-borde bg-superficie text-texto-2 shadow-min" aria-hidden>
        <LockSimpleIcon size={16} />
      </span>
      <span className="flex basis-full items-center gap-1 text-xs text-texto-3">
        <InfoIcon size={13} aria-hidden />
        {quienVe}
      </span>
    </div>
  )
}
