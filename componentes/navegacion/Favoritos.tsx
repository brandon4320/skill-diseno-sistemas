'use client'

import { StarIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Favoritos en el menú (01-navegacion · 04): cada favorito con el cuadrito del color de su
 * entidad; los recientes se fijan con ☆ al pasar. Tope de 5: el sexto dice por qué no entra.
 */
export type EntradaMenu = { id: string; texto: string; href: string; icono: Icon; color: string }

export type FavoritosProps = {
  favoritos: readonly EntradaMenu[]
  recientes?: readonly EntradaMenu[]
  onFijar: (id: string) => void
  onSoltar: (id: string) => void
  activo?: string
  tope?: number
  /** Se llama cuando se intenta fijar con el tope lleno; mostrá un toast con el motivo. */
  onTopeLleno?: (tope: number) => void
}

function Fila({ e, fav, activo, onEstrella, deshabilitada }: { e: EntradaMenu; fav: boolean; activo: boolean; onEstrella: () => void; deshabilitada?: boolean }) {
  const I = e.icono
  return (
    <li className="group relative">
      <a href={e.href} aria-current={activo ? 'page' : undefined} className={cx('flex h-[34px] items-center gap-2.5 rounded-control pr-9 pl-2 text-[13px] text-texto-2 hover:bg-hover hover:text-tinta aria-[current=page]:bg-superficie aria-[current=page]:text-tinta aria-[current=page]:shadow-min', FOCO)}>
        <span style={{ background: e.color }} className="grid size-5 shrink-0 place-items-center rounded-[6px] text-white"><I weight="fill" className="size-3" /></span>
        <span className="truncate">{e.texto}</span>
      </a>
      <button
        type="button"
        onClick={onEstrella}
        aria-pressed={fav}
        aria-disabled={deshabilitada || undefined}
        aria-label={fav ? `Quitar ${e.texto} de favoritos` : `Fijar ${e.texto} en favoritos`}
        className={cx('absolute top-1/2 right-1 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-chip text-texto-3 hover:text-tinta', fav ? 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100', FOCO)}
      >
        <StarIcon weight={fav ? 'fill' : 'regular'} className={cx('size-3.5', fav && 'text-ambar-texto')} />
      </button>
    </li>
  )
}

export function Favoritos({ favoritos, recientes = [], onFijar, onSoltar, activo, tope = 5, onTopeLleno }: FavoritosProps) {
  const lleno = favoritos.length >= tope
  return (
    <nav aria-label="Favoritos y recientes" className="space-y-3">
      <div>
        <h3 className="px-2 pb-1 text-[11px] font-medium text-texto-3">Favoritos <span className="font-mono tabular-nums">{favoritos.length}/{tope}</span></h3>
        {favoritos.length === 0 ? (
          <p className="px-2 text-xs text-texto-3">Fijá con ☆ lo que abrís seguido.</p>
        ) : (
          <ul>{favoritos.map(e => <Fila key={e.id} e={e} fav activo={activo === e.id} onEstrella={() => onSoltar(e.id)} />)}</ul>
        )}
      </div>
      {recientes.length > 0 && (
        <div>
          <h3 className="px-2 pb-1 text-[11px] font-medium text-texto-3">Recientes</h3>
          <ul>
            {recientes.map(e => (
              <Fila key={e.id} e={e} fav={false} activo={activo === e.id} deshabilitada={lleno} onEstrella={() => (lleno ? onTopeLleno?.(tope) : onFijar(e.id))} />
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
