'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'
import { Warning, type Icon } from '@phosphor-icons/react'
import { Tooltip } from '../base/Tooltip'
import { cx, FOCO } from '../base/utilidades'

/**
 * "Nunca un control deshabilitado sin decir por qué" (SKILL.md §5 Acciones).
 * - Con `causa`: queda aria-disabled (sigue enfocable, el tooltip y el lector la dicen), con la causa
 *   escrita al lado y su arreglo como enlace ("Falta el CUIT · Cargarlo").
 * - Con `esperaHasta`: cuenta regresiva escrita ("Podés pedir otro en 0:28") y se habilita sola.
 * Si lo que falta son campos de un formulario, NO uses este: el botón no se apaga, lleva al primer
 * problema y lo sacude (ver formulario-alta.html).
 */
export type BotonConCausaProps = {
  children: ReactNode
  icono?: Icon
  variante?: 'principal' | 'secundario'
  onClick: () => void
  /** Por qué no se puede ahora ("Falta el CUIT de Orbe Retail"). */
  causa?: string
  /** Arreglo en una o dos palabras + qué hace. */
  arreglo?: { texto: string; hacer: () => void }
  /** Fecha (ms) desde la que se puede de nuevo. */
  esperaHasta?: number
  /** Texto de la espera: (m:ss) => `Podés pedir otro en ${t}`. */
  textoEspera?: (t: string) => string
}

export function BotonConCausa({
  children, icono: Ico, variante = 'secundario', onClick, causa, arreglo, esperaHasta,
  textoEspera = t => `Podés pedir otro en ${t}`,
}: BotonConCausaProps) {
  const id = useId()
  const [ahora, setAhora] = useState(() => Date.now())
  const resta = esperaHasta ? Math.max(0, Math.ceil((esperaHasta - ahora) / 1000)) : 0
  useEffect(() => {
    if (!resta) return
    const t = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(t)
  }, [resta])

  const apagado = Boolean(causa) || resta > 0
  const motivo = causa ?? (resta ? textoEspera(`${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, '0')}`) : '')
  const principal = variante === 'principal'

  const boton = (
    <button
      type="button"
      onClick={() => { if (!apagado) onClick() }}
      aria-disabled={apagado || undefined}
      aria-describedby={apagado ? id : undefined}
      className={cx(
        'inline-flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-control pr-3.5 pl-3 text-[13px] font-medium whitespace-nowrap pointer-coarse:min-h-11',
        'transition-[background-color,opacity] duration-150',
        principal ? 'bg-tinta text-superficie shadow-principal' : 'border border-borde bg-superficie text-tinta shadow-min',
        apagado ? 'cursor-not-allowed opacity-45' : principal ? 'cursor-pointer hover:bg-tinta/90' : 'cursor-pointer hover:bg-hover',
        FOCO,
      )}
    >
      {Ico && <Ico size={17} aria-hidden />}
      {children}
    </button>
  )

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
      {causa ? <Tooltip texto={causa} describir={false}>{boton}</Tooltip> : boton}
      {apagado && (
        <span id={id} aria-live="polite" className="inline-flex items-center gap-1.5 text-xs text-texto-2">
          {causa && <Warning size={14} aria-hidden className="text-ambar-texto" />}
          <span className="tabular-nums">{motivo}</span>
          {causa && arreglo && (
            <>
              <span aria-hidden>·</span>
              <button type="button" onClick={arreglo.hacer} className={cx('cursor-pointer font-medium text-acento hover:underline pointer-coarse:min-h-11', FOCO)}>
                {arreglo.texto}
              </button>
            </>
          )}
        </span>
      )}
    </span>
  )
}
