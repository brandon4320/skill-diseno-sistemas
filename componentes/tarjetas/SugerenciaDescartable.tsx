'use client'
/**
 * Sugerencias descartables: chips "haz esto" con su ✕. Al hacer o quitar, el chip se encoge y
 * sale (sin saltos: anima ancho y margen); cuando no queda ninguna, una línea en verde.
 * También TarjetaSugerencias: los primeros pasos con una barra de 4 segmentos.
 */
import { useState } from 'react'
import { CheckCircleIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type Sugerencia = { id: string; texto: string; icono?: Icon }

export type SugerenciasProps = {
  sugerencias: readonly Sugerencia[]
  onIr: (id: string) => void
  onQuitar: (id: string) => void
  textoVacio?: string
}

export function Sugerencias({ sugerencias, onIr, onQuitar, textoVacio = 'Al día: no hay sugerencias' }: SugerenciasProps) {
  const [saliendo, setSaliendo] = useState<ReadonlySet<string>>(new Set())
  const sacar = (id: string, fn: (id: string) => void) => {
    setSaliendo(s => new Set(s).add(id))
    window.setTimeout(() => fn(id), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220)
  }
  if (sugerencias.length === 0) {
    return (
      <p className="flex h-[34px] items-center gap-2 text-[13px] text-texto-3" role="status">
        <CheckCircleIcon size={16} weight="fill" className="text-verde-texto" aria-hidden />{textoVacio}
      </p>
    )
  }
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Sugerencias">
      {sugerencias.map(s => {
        const Ic = s.icono
        const sale = saliendo.has(s.id)
        return (
          <li
            key={s.id}
            className={cx(
              'inline-flex h-[34px] max-w-full items-center overflow-hidden rounded-full border border-borde bg-superficie text-[13px] font-medium text-texto-2 shadow-min pointer-coarse:h-11',
              'transition-[opacity,transform,max-width] duration-200 ease-(--ease)',
              sale && 'max-w-0 scale-95 border-0 opacity-0',
            )}
          >
            <button
              type="button"
              onClick={() => sacar(s.id, onIr)}
              className={cx('inline-flex h-full min-w-0 items-center gap-2 truncate pr-1 pl-3 hover:text-tinta', FOCO)}
            >
              {Ic && <Ic size={15} className="text-texto-3" aria-hidden />}
              <span className="truncate">{s.texto}</span>
            </button>
            <button
              type="button"
              aria-label={`Quitar sugerencia: ${s.texto}`}
              onClick={() => sacar(s.id, onQuitar)}
              className={cx('mr-0.5 grid size-7 flex-none place-items-center rounded-full text-texto-3 hover:bg-hover hover:text-tinta pointer-coarse:mr-0 pointer-coarse:size-11', FOCO)}
            >
              <XIcon size={13} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export type TarjetaSugerenciasProps = SugerenciasProps & { titulo: string; hechos: number; total: number }

export function TarjetaSugerencias({ titulo, hechos, total, ...resto }: TarjetaSugerenciasProps) {
  return (
    <section className="overflow-hidden rounded-tarjeta border border-borde bg-superficie" aria-label={titulo}>
      <header className="flex items-center gap-3 px-6 py-5">
        <h3 className="text-sm font-medium text-tinta">{titulo}</h3>
        <div className="ml-auto flex w-[72px] gap-[3px]" role="img" aria-label={`${hechos} de ${total} hechos`}>
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className={cx('h-1 flex-1 rounded-sm transition-colors duration-300', i < hechos ? 'bg-verde-texto' : 'bg-suave')} />
          ))}
        </div>
      </header>
      <div className="border-t border-divisor px-6 pt-4 pb-5"><Sugerencias {...resto} /></div>
    </section>
  )
}
