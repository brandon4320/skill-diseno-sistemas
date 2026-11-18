'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { CircleNotch, Prohibit, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón destructivo (SKILL.md §5: "Deshacer antes que confirmar").
 * - <BotonPeligro>: rojo de texto, para la fila o el pie. Si la acción es reversible, hacela y
 *   ofrecé Deshacer en el toast: no hace falta confirmar.
 * - <ConfirmarIrreversible>: solo para lo que no vuelve. Dice la consecuencia y el botón REPITE la
 *   acción ("Anular FAC-01098"), nunca "Sí" ni "Aceptar". El foco arranca en Cancelar; Esc cierra.
 */
export function BotonPeligro({ children, icono: Ico, onClick, tamano = 'chico' }: { children: ReactNode; icono?: Icon; onClick: () => void; tamano?: 'normal' | 'chico' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex shrink-0 cursor-pointer items-center gap-1 font-medium text-rojo-texto transition-colors duration-150 hover:bg-rojo-fondo',
        tamano === 'chico' ? 'h-7 rounded-chip px-2.5 text-xs' : 'h-[38px] gap-2 rounded-control px-3.5 text-[13px]',
        'pointer-coarse:min-h-11',
        FOCO,
      )}
    >
      {Ico && <Ico size={tamano === 'chico' ? 14 : 17} aria-hidden />}
      {children}
    </button>
  )
}

export type ConfirmarIrreversibleProps = {
  abierto: boolean
  onCerrar: () => void
  /** "¿Anular FAC-01098?" */
  titulo: string
  /** La consecuencia con el dato: "Se emite una nota de crédito por $ 1.840.000…". */
  consecuencia: ReactNode
  /** Repite la acción: "Anular FAC-01098". */
  textoAccion: string
  gerundio: string
  accion: () => Promise<unknown>
}

export function ConfirmarIrreversible({ abierto, onCerrar, titulo, consecuencia, textoAccion, gerundio, accion }: ConfirmarIrreversibleProps) {
  const dlg = useRef<HTMLDialogElement>(null)
  const id = useId()
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  const confirmar = async () => {
    setCargando(true)
    try { await accion(); onCerrar() } finally { setCargando(false) }
  }

  return (
    <dialog
      ref={dlg}
      role="alertdialog"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      onClose={onCerrar}
      onCancel={e => { if (cargando) e.preventDefault() }}
      className="m-auto w-[min(100%-32px,460px)] overflow-hidden rounded-tarjeta border border-borde bg-superficie p-0 text-tinta shadow-flotante backdrop:bg-fondo/55 backdrop:backdrop-blur-[6px]"
    >
      <div className="flex items-center gap-3 border-b border-divisor py-4 pr-4 pl-5">
        <span className="grid size-9 place-items-center rounded-control bg-rojo-fondo text-rojo-texto"><Prohibit size={18} aria-hidden /></span>
        <h2 id={`${id}-t`} className="font-display text-base font-medium">{titulo}</h2>
      </div>
      <div id={`${id}-d`} className="p-5 text-[13px] leading-relaxed text-texto-2">{consecuencia}</div>
      <div className="flex items-center gap-2 border-t border-divisor bg-suave/60 px-5 py-3">
        <button autoFocus type="button" onClick={onCerrar} className={cx('mr-auto h-[38px] cursor-pointer rounded-control px-3.5 text-[13px] font-medium text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={confirmar}
          aria-busy={cargando || undefined}
          className={cx('inline-grid h-[38px] cursor-pointer place-items-center rounded-control bg-rojo-texto px-3.5 text-[13px] font-medium text-white shadow-principal hover:brightness-95', FOCO)}
        >
          <span className={cx('col-start-1 row-start-1 inline-flex items-center gap-2', cargando && 'invisible')}><Prohibit size={17} aria-hidden />{textoAccion}</span>
          <span className={cx('col-start-1 row-start-1 inline-flex items-center gap-2', !cargando && 'invisible')}><CircleNotch size={17} aria-hidden className="animate-spin" />{gerundio}</span>
        </button>
      </div>
    </dialog>
  )
}
