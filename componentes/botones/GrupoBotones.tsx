'use client'

import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { Tooltip } from '../base/Tooltip'
import { cx, FOCO } from '../base/utilidades'

/**
 * Grupo de botones: acciones hermanas pegadas en una caja (bordes compartidos, radio solo en las
 * puntas, sombra una vez). Para navegar el período (‹ Hoy ›) usá <GrupoBotones> con <BotonDeGrupo>;
 * para elegir uno de varios (vista, alineación) usá <GrupoOpciones>, que maneja aria-pressed y ←/→.
 */
const BOTON = cx(
  'relative inline-flex cursor-pointer items-center justify-center gap-2 border border-borde bg-superficie text-[13px] font-medium text-tinta',
  '-ml-px first:ml-0 first:rounded-l-control last:rounded-r-control focus-visible:z-10',
  'transition-colors duration-150 hover:bg-hover aria-pressed:z-[1] aria-pressed:bg-suave',
  FOCO,
)

export function GrupoBotones({ rotulo, children, className }: { rotulo: string; children: ReactNode; className?: string }) {
  return <div role="group" aria-label={rotulo} className={cx('inline-flex shrink-0 rounded-control shadow-min', className)}>{children}</div>
}

export type BotonDeGrupoProps = {
  onClick: () => void
  children?: ReactNode
  icono?: Icon
  /** Obligatorio si es solo ícono: también es el tooltip. */
  'aria-label'?: string
  presionado?: boolean
  tamano?: 'normal' | 'chico'
}

export function BotonDeGrupo({ onClick, children, icono: Ico, presionado, tamano = 'normal', ...a11y }: BotonDeGrupoProps) {
  const chico = tamano === 'chico'
  const soloIcono = children == null
  const b = (
    <button
      type="button"
      onClick={onClick}
      aria-label={a11y['aria-label']}
      aria-pressed={presionado}
      className={cx(
        BOTON,
        chico ? 'h-7 first:rounded-l-chip last:rounded-r-chip' : 'h-[38px]',
        soloIcono ? (chico ? 'w-7' : 'w-[38px]') : 'px-3.5',
        'pointer-coarse:min-h-11 pointer-coarse:min-w-11',
      )}
    >
      {Ico && <Ico size={chico ? 14 : 17} aria-hidden />}
      {children}
    </button>
  )
  return soloIcono && a11y['aria-label'] ? <Tooltip texto={a11y['aria-label']} describir={false}>{b}</Tooltip> : b
}

export type OpcionGrupo<T extends string> = { valor: T; texto: string; icono?: Icon; soloIcono?: boolean }

export function GrupoOpciones<T extends string>({
  rotulo, opciones, valor, onCambio, tamano = 'normal',
}: { rotulo: string; opciones: readonly OpcionGrupo<T>[]; valor: T; onCambio: (v: T) => void; tamano?: 'normal' | 'chico' }) {
  const ref = useRef<HTMLDivElement>(null)
  const mover = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = opciones.findIndex(o => o.valor === valor)
    const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + opciones.length) % opciones.length
    onCambio(opciones[j].valor)
    ref.current?.querySelectorAll('button')[j]?.focus()
  }
  return (
    <div ref={ref} onKeyDown={mover}>
      <GrupoBotones rotulo={rotulo}>
        {opciones.map(o => (
          <BotonDeGrupo
            key={o.valor}
            tamano={tamano}
            icono={o.icono}
            presionado={o.valor === valor}
            onClick={() => onCambio(o.valor)}
            aria-label={o.soloIcono ? o.texto : undefined}
          >
            {o.soloIcono ? undefined : o.texto}
          </BotonDeGrupo>
        ))}
      </GrupoBotones>
    </div>
  )
}
