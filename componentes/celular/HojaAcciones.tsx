'use client'

import { useState } from 'react'
import type { Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { HojaInferior } from './HojaInferior'

/**
 * Más acciones como hoja (SKILL.md §4 Menú ⋯): en el celular el ⋯ abre una hoja con filas de 52,
 * grupos y sin atajos. Lo reversible arriba, silenciar al medio, borrar o anular al final en rojo,
 * con confirmación dentro de la misma hoja (no un modal encima).
 */
export type AccionHoja = {
  id: string
  texto: string
  icono: Icon
  hacer: () => void
  peligro?: boolean
  /** Para las de peligro: "Se borra FAC-01088 y no se puede recuperar". */
  confirmar?: string
}

export type HojaAccionesProps = {
  abierta: boolean
  alCerrar: () => void
  titulo: string
  grupos: readonly (readonly AccionHoja[])[]
}

export function HojaAcciones({ abierta, alCerrar, titulo, grupos }: HojaAccionesProps) {
  const [pidiendo, setPidiendo] = useState<AccionHoja | null>(null)
  const cerrar = () => { setPidiendo(null); alCerrar() }
  const ejecutar = (a: AccionHoja) => { a.hacer(); cerrar() }

  return (
    <HojaInferior abierta={abierta} alCerrar={cerrar} titulo={pidiendo ? `¿${pidiendo.texto}?` : titulo}>
      {pidiendo ? (
        <div className="flex flex-col gap-3" role="alertdialog" aria-label={pidiendo.texto}>
          <p className="text-sm text-texto-2">{pidiendo.confirmar}</p>
          <button type="button" autoFocus onClick={() => ejecutar(pidiendo)} className={cx('h-[52px] cursor-pointer rounded-full bg-rojo-texto text-sm font-medium text-superficie', FOCO)}>
            {pidiendo.texto}
          </button>
          <button type="button" onClick={() => setPidiendo(null)} className={cx('h-[52px] cursor-pointer rounded-full border border-borde text-sm font-medium text-tinta', FOCO)}>
            Volver
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {grupos.map((g, i) => (
            <ul key={i} className="overflow-hidden rounded-control border border-borde">
              {g.map(a => (
                <li key={a.id} className="border-b border-divisor last:border-b-0">
                  <button
                    type="button"
                    onClick={() => (a.peligro && a.confirmar ? setPidiendo(a) : ejecutar(a))}
                    className={cx(
                      'flex h-[52px] w-full cursor-pointer items-center gap-3 px-4 text-left text-[15px] hover:bg-hover',
                      a.peligro ? 'text-rojo-texto' : 'text-tinta',
                      FOCO,
                    )}
                  >
                    <a.icono size={20} aria-hidden className={a.peligro ? '' : 'text-texto-2'} />
                    {a.texto}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </HojaInferior>
  )
}
