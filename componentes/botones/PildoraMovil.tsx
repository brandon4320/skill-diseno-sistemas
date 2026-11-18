'use client'

import { useState } from 'react'
import { Check, CheckCircle, CircleNotch } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Acción principal del celular (SKILL.md §9): píldora fija abajo, a todo el ancho, 52 px, a 16 de
 * los bordes y sobre el padding seguro. Si falta algo NUNCA se apaga: dice qué falta en gris
 * ("Cerrar visita · faltan 3 + firma") y al tocarla llama a `irAlPendiente` (bajar al primero y
 * hacerlo destellar). Completa, pasa a tinta; al terminar, verde con el participio.
 * Reservá el alto en la página con `--ds-pie-movil` para que los toasts queden arriba.
 */
export type PildoraMovilProps = {
  /** "Cerrar visita". */
  texto: string
  gerundio: string
  /** "Visita cerrada". */
  participio: string
  /** "faltan 3 + firma"; vacío o undefined = completa. */
  falta?: string
  irAlPendiente: () => void
  accion: () => Promise<unknown>
  /** Sobre la barra inferior (bottom 82) o sola (bottom 16). */
  sobreBarra?: boolean
}

export function PildoraMovil({ texto, gerundio, participio, falta, irAlPendiente, accion, sobreBarra }: PildoraMovilProps) {
  const [fase, setFase] = useState<'reposo' | 'cargando' | 'hecho'>('reposo')
  const incompleta = Boolean(falta)

  const alTocar = async () => {
    if (fase !== 'reposo') return
    if (incompleta) return irAlPendiente()
    setFase('cargando')
    try { await accion(); setFase('hecho') } catch { setFase('reposo') }
  }

  return (
    <button
      type="button"
      onClick={alTocar}
      aria-busy={fase === 'cargando' || undefined}
      className={cx(
        'fixed inset-x-4 z-30 flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium',
        'mb-[env(safe-area-inset-bottom)] transition-[background-color,color,transform] duration-300 ease-(--ease) active:scale-[.98]',
        sobreBarra ? 'bottom-[82px]' : 'bottom-4',
        fase === 'hecho'
          ? 'bg-verde-texto text-superficie'
          : incompleta
            ? 'border border-borde bg-superficie text-texto-2 shadow-flotante'
            : 'bg-tinta text-superficie shadow-[0_10px_20px_-10px_rgb(0_0_0/.5)]',
        FOCO,
      )}
    >
      {fase === 'cargando' && <><CircleNotch size={18} aria-hidden className="animate-spin motion-reduce:animate-none" />{gerundio}</>}
      {fase === 'hecho' && <><Check size={18} weight="bold" aria-hidden />{participio}</>}
      {fase === 'reposo' && (incompleta
        ? <span>{texto} · <b className="font-medium text-tinta">{falta}</b></span>
        : <><CheckCircle size={18} aria-hidden />{texto}</>)}
    </button>
  )
}
