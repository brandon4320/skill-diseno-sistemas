'use client'

import { useId, type ReactNode } from 'react'
import { Minus, Plus } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { EnvoltorioCampo, cajaCampo, describedBy, type Mensaje } from './_campo'

export type CampoNumeroProps = {
  rotulo: ReactNode
  valor: number
  onCambio: (n: number) => void
  min?: number
  max?: number
  paso?: number
  /** "cuotas", "días", "u.". */
  unidad?: string
  /** Lo que resulta del número: "vence el 18 dic", "$ 104.166 por cuota". */
  resultado?: ReactNode
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

/** Número con − y + a los costados (flechas del teclado también); el resultado va debajo. */
export function CampoNumero({ rotulo, valor, onCambio, min = 0, max = Infinity, paso = 1, unidad, resultado, ayuda, mensaje, id: idPropio, className }: CampoNumeroProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const fijar = (n: number) => onCambio(Math.min(max, Math.max(min, Number.isFinite(n) ? n : min)))
  const boton = (signo: 1 | -1) => {
    const Icono = signo > 0 ? Plus : Minus
    const tope = signo > 0 ? valor >= max : valor <= min
    return (
      <button
        type="button"
        tabIndex={-1}
        disabled={tope}
        onClick={() => fijar(valor + signo * paso)}
        aria-label={signo > 0 ? 'Sumar' : 'Restar'}
        className={cx('grid size-8 shrink-0 place-items-center rounded-[calc(var(--radius-control)-3px)] text-texto-2 hover:bg-hover disabled:text-deshabilitado disabled:hover:bg-transparent max-sm:size-11', FOCO)}
      >
        <Icono size={14} aria-hidden />
      </button>
    )
  }
  const ayudaFinal = ayuda ?? resultado
  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} ayuda={ayudaFinal} mensaje={mensaje} className={cx('w-44', className)}>
      <div data-caja className={cajaCampo(mensaje?.tipo ?? 'neutro', 'px-1')}>
        {boton(-1)}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          aria-valuenow={valor}
          aria-valuemin={min}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-describedby={describedBy(id, mensaje, ayudaFinal)}
          value={valor}
          onChange={(e) => fijar(Number(e.target.value.replace(/\D/g, '')))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); fijar(valor + (e.key === 'ArrowUp' ? 1 : -1) * paso * (e.shiftKey ? 10 : 1)) }
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-center font-mono text-sm tabular-nums text-tinta outline-none max-sm:text-base"
        />
        {unidad && <span className="shrink-0 text-[13px] text-texto-3">{unidad}</span>}
        {boton(1)}
      </div>
    </EnvoltorioCampo>
  )
}
