'use client'

import { BellSimpleIcon, CheckIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Ítem "Pronto" (01-navegacion · 07): lo que todavía no está se ve apagado al 45 % con su pastilla
 * y cuándo llega; no se esconde ni lleva a una pantalla vacía. Se puede pedir aviso.
 */
export type ItemProntoProps = {
  texto: string
  icono: Icon
  /** "en diciembre", "Q1". */
  cuando: string
  avisado?: boolean
  onAvisarme?: () => void
}

export function ItemPronto({ texto, icono: I, cuando, avisado = false, onAvisarme }: ItemProntoProps) {
  return (
    <div className="group flex h-[34px] items-center gap-2.5 rounded-control px-2 text-[13px]" aria-disabled="true">
      <span className="flex min-w-0 flex-1 items-center gap-2.5 text-texto-2 opacity-45">
        <I className="size-[18px] shrink-0" aria-hidden />
        <span className="truncate">{texto}</span>
      </span>
      <span className="rounded-full bg-suave px-2 py-0.5 text-[11px] font-medium text-texto-2" title={`Llega ${cuando}`}>Pronto · {cuando}</span>
      {onAvisarme && (
        <button
          type="button"
          onClick={onAvisarme}
          aria-pressed={avisado}
          aria-label={avisado ? `Te avisamos cuando llegue ${texto}` : `Avisarme cuando llegue ${texto}`}
          className={cx('grid size-7 cursor-pointer place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta', FOCO)}
        >
          {avisado ? <CheckIcon weight="bold" className="size-3.5 text-verde-texto" /> : <BellSimpleIcon className="size-3.5" />}
        </button>
      )}
    </div>
  )
}
