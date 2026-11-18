'use client'
/**
 * ResolverAmbiguedad: cuando lo escrito coincide con más de un registro, se muestran los candidatos lado a lado
 * con los datos que los distinguen (CUIT, ciudad, contratos) y se elige uno. Patrón 14.17 · 12-flujos.html#resolver-ambiguedad
 *
 * - role="radiogroup" con flechas; cada tarjeta lleva el cuadro de color de la entidad y un ✓ al elegirse.
 * - El dato que distingue va en la segunda línea, nunca escondido en un tooltip.
 * - Debajo, en una línea, a nombre de quién queda la operación.
 *
 *   <ResolverAmbiguedad etiqueta="Cliente" candidatos={[{ id: 'c1', nombre: 'Orbe Retail S.A.', detalle: 'CUIT 30-71458203-6 · Bahía Blanca · 3 contratos' }, …]}
 *     valor={cli} onCambio={setCli} confirmacion={(c) => `La cotización queda a nombre de ${c.nombre}`} />
 */
import { useRef, type KeyboardEvent } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { colorDe, iniciales } from '../base/utilidades'
import { cx, FOCO } from './compartido'

export type Candidato = { id: string; nombre: string; detalle: string; color?: string }

export type ResolverAmbiguedadProps = {
  etiqueta: string
  candidatos: Candidato[]
  valor: string | null
  onCambio: (id: string) => void
  confirmacion?: (c: Candidato) => string
}

export function ResolverAmbiguedad({ etiqueta, candidatos, valor, onCambio, confirmacion }: ResolverAmbiguedadProps) {
  const grupo = useRef<HTMLDivElement>(null)
  const elegido = candidatos.find((c) => c.id === valor)
  const flechas = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const k = (i + d + candidatos.length) % candidatos.length
    onCambio(candidatos[k].id)
    grupo.current?.querySelectorAll<HTMLButtonElement>('[role=radio]')[k]?.focus()
  }
  return (
    <div className="flex flex-col gap-2.5">
      <div ref={grupo} role="radiogroup" aria-label={etiqueta} className="grid gap-2 md:grid-cols-2">
        {candidatos.map((c, i) => {
          const on = c.id === valor
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on || (!valor && i === 0) ? 0 : -1}
              onClick={() => onCambio(c.id)}
              onKeyDown={(e) => flechas(e, i)}
              className={cx('flex min-h-14 items-center gap-3 rounded-control border bg-superficie px-3.5 py-3 text-left transition-[border,box-shadow]', on ? 'border-acento ring-[3px] ring-acento/15' : 'border-borde hover:border-borde-fuerte', FOCO)}
            >
              <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-chip text-[11px] font-medium text-white" style={{ background: `color-mix(in oklch, ${c.color ?? colorDe(c.id)} 70%, #000)` }}>{iniciales(c.nombre)}</span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-sm font-medium">{c.nombre}</b>
                <small className="block truncate text-xs text-texto-3 tabular-nums">{c.detalle}</small>
              </span>
              <span aria-hidden className={cx('grid size-5 shrink-0 place-items-center rounded-full bg-verde-texto text-white transition-[opacity,transform] duration-200', on ? 'scale-100 opacity-100' : 'scale-60 opacity-0')}>
                <CheckIcon size={12} weight="bold" />
              </span>
            </button>
          )
        })}
      </div>
      <span aria-live="polite" className="flex items-center gap-1.5 text-xs text-texto-3">
        {elegido ? <><CheckIcon size={13} className="text-verde-texto" aria-hidden />{confirmacion ? confirmacion(elegido) : elegido.nombre}</> : 'Elegí uno para seguir.'}
      </span>
    </div>
  )
}
