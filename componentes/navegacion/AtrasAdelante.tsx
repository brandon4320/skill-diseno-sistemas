'use client'

import { useRef, useState, type MouseEvent } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Atrás y adelante (01-navegacion · 21): ‹ › siguen el historial; el globo dice adónde vuelve
 * ("Volver a Clientes"); en los extremos quedan al 40 % en su lugar; clic derecho o mantener
 * apretado muestra la lista. Distinto de la flecha al padre del celular, que sigue la jerarquía.
 */
export type PasoHistorial = { id: string; texto: string }

export type AtrasAdelanteProps = {
  atras: readonly PasoHistorial[]
  adelante: readonly PasoHistorial[]
  /** pasos < 0 vuelve, > 0 avanza. */
  onIr: (pasos: number) => void
}

export function AtrasAdelante({ atras, adelante, onIr }: AtrasAdelanteProps) {
  const [lista, setLista] = useState<'atras' | 'adelante' | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const abrir = (lado: 'atras' | 'adelante') => (e?: MouseEvent) => { e?.preventDefault(); setLista(lado) }
  const mantener = (lado: 'atras' | 'adelante') => ({
    onPointerDown: () => { timer.current = setTimeout(() => setLista(lado), 500) },
    onPointerUp: () => clearTimeout(timer.current),
    onPointerLeave: () => clearTimeout(timer.current),
  })
  const boton = 'grid size-8 cursor-pointer place-items-center rounded-control text-texto-2 hover:bg-hover hover:text-tinta disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent'
  const items = lista === 'atras' ? atras : adelante
  return (
    <div className="relative flex items-center gap-0.5" onKeyDown={e => { if (e.key === 'Escape') setLista(null) }}>
      <button type="button" disabled={!atras.length} onClick={() => onIr(-1)} onContextMenu={abrir('atras')} {...mantener('atras')} aria-label={atras[0] ? `Volver a ${atras[0].texto}` : 'Atrás'} title={atras[0] ? `Volver a ${atras[0].texto}` : undefined} className={cx(boton, FOCO)}>
        <CaretLeftIcon className="size-4" />
      </button>
      <button type="button" disabled={!adelante.length} onClick={() => onIr(1)} onContextMenu={abrir('adelante')} {...mantener('adelante')} aria-label={adelante[0] ? `Ir a ${adelante[0].texto}` : 'Adelante'} title={adelante[0] ? `Ir a ${adelante[0].texto}` : undefined} className={cx(boton, FOCO)}>
        <CaretRightIcon className="size-4" />
      </button>
      {lista && items.length > 0 && (
        <ul role="menu" aria-label={lista === 'atras' ? 'Historial atrás' : 'Historial adelante'} className="absolute top-full left-0 z-40 mt-1.5 w-56 rounded-tarjeta border border-borde bg-superficie p-1.5 shadow-flotante">
          {items.map((p, i) => (
            <li key={p.id} role="none">
              <button type="button" role="menuitem" autoFocus={i === 0} onClick={() => { onIr(lista === 'atras' ? -(i + 1) : i + 1); setLista(null) }} className={cx('flex w-full cursor-pointer items-center rounded-control px-2 py-1.5 text-left text-[13px] text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
                <span className="truncate">{p.texto}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
