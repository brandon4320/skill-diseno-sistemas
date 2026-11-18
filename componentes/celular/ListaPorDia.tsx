'use client'

import type { ReactNode } from 'react'
import { Check, DotsThree, type Icon } from '@phosphor-icons/react'
import { cx, FOCO, TONOS, type Tono } from '../base/utilidades'

/**
 * Lista por día (SKILL.md §5 Listas/Celular): cada día es una bandeja con franja de fecha y ⋯;
 * adentro filas blancas de 64 con ícono redondo, dos líneas y el check de 44. Lo vencido dice la
 * hora en rojo; lo hecho se tacha y baja a gris.
 */
export type ItemDia = {
  id: string
  titulo: string
  detalle: ReactNode
  icono: Icon
  tono?: Tono
  hora?: string
  vencido?: boolean
  hecho?: boolean
}

export type DiaLista = { id: string; fecha: string; items: readonly ItemDia[] }

export type ListaPorDiaProps = {
  dias: readonly DiaLista[]
  alMarcar: (itemId: string, hecho: boolean) => void
  alMasDelDia?: (diaId: string) => void
}

export function ListaPorDia({ dias, alMarcar, alMasDelDia }: ListaPorDiaProps) {
  return (
    <div className="flex flex-col gap-4 px-4">
      {dias.map(d => (
        <section key={d.id} aria-labelledby={`dia-${d.id}`} className="rounded-tarjeta bg-suave p-1.5">
          <header className="flex items-center justify-between py-1 pr-1 pl-2.5">
            <h3 id={`dia-${d.id}`} className="text-xs font-semibold tracking-wide text-texto-2 uppercase">
              {d.fecha} <span className="ml-1 font-mono font-normal text-texto-3">{d.items.length}</span>
            </h3>
            {alMasDelDia && (
              <button type="button" aria-label={`Más acciones de ${d.fecha}`} onClick={() => alMasDelDia(d.id)} className={cx('grid size-9 cursor-pointer place-items-center rounded-full text-texto-3 hover:bg-hover', FOCO)}>
                <DotsThree size={20} weight="bold" aria-hidden />
              </button>
            )}
          </header>
          <ul className="flex flex-col gap-1">
            {d.items.map(it => {
              const t = TONOS[it.tono ?? 'gris']
              return (
                <li key={it.id} className="flex min-h-16 items-center gap-3 rounded-control bg-superficie py-2 pr-1 pl-3">
                  <span aria-hidden className={cx('grid size-9 shrink-0 place-items-center rounded-full', it.hecho ? 'bg-gris-fondo text-texto-3' : cx(t.fondo, t.texto))}>
                    <it.icono size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className={cx('block truncate text-sm font-medium', it.hecho ? 'text-texto-3 line-through' : 'text-tinta')}>{it.titulo}</b>
                    <small className="block truncate text-xs text-texto-3">
                      {it.hora && <span className={cx('mr-1 font-mono', it.vencido && !it.hecho && 'font-medium text-rojo-texto')}>{it.hora}</span>}
                      {it.detalle}
                    </small>
                  </span>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={Boolean(it.hecho)}
                    aria-label={`Hecho: ${it.titulo}`}
                    onClick={() => alMarcar(it.id, !it.hecho)}
                    className={cx('grid size-11 shrink-0 cursor-pointer place-items-center rounded-full', FOCO)}
                  >
                    <span aria-hidden className={cx('grid size-6 place-items-center rounded-full border-2 transition-colors duration-150', it.hecho ? 'border-verde-texto bg-verde-texto text-superficie' : 'border-borde-fuerte text-transparent')}>
                      <Check size={14} weight="bold" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
