import { CloudArrowUp, CloudCheck } from '@phosphor-icons/react/dist/ssr'
import { cx } from '../base/utilidades'

/**
 * Sin señal en el dato (SKILL.md §5 Celular, §7 Estados): la falta de señal se muestra en el
 * dato, no en un cartel. «1 sin subir» en ámbar en la fila y en el resumen, la hora de la última
 * actualización en gris; al volver la señal sube sola y avisa (eso lo hace un Toast).
 */
export function PendienteSubir({ cantidad }: { cantidad: number }) {
  if (cantidad === 0) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ambar-fondo px-2 py-0.5 text-xs font-medium text-ambar-texto">
      <CloudArrowUp size={13} aria-hidden />
      {cantidad} sin subir
    </span>
  )
}

export type ResumenSenalProps = {
  /** Cuántos registros esperan señal. */
  pendientes: number
  /** "Actualizado 14:32". */
  actualizado: string
  className?: string
}

export function ResumenSenal({ pendientes, actualizado, className }: ResumenSenalProps) {
  return (
    <p role="status" className={cx('flex items-center gap-2 text-xs text-texto-3', className)}>
      {pendientes > 0
        ? <PendienteSubir cantidad={pendientes} />
        : <span className="inline-flex items-center gap-1 text-verde-texto"><CloudCheck size={13} aria-hidden />Todo subido</span>}
      <span className="font-mono">{actualizado}</span>
    </p>
  )
}
