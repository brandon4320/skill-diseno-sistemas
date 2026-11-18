'use client'
/**
 * Constructor de filtros: renglones campo · operador · valor. El operador y el valor cambian
 * según el tipo del campo. Y/O una sola vez para todo el grupo. Arriba de la tabla, el resultado
 * en chips con ×. Se filtra en vivo, sin "Aplicar".
 */
import { useId } from 'react'
import { PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type TipoCampo = 'texto' | 'numero' | 'fecha' | 'lista'
export type CampoFiltro = { id: string; nombre: string; tipo: TipoCampo; opciones?: string[] }
export type Condicion = { campo: string; op: string; valor: string }
export type Union = 'y' | 'o'

export const OPERADORES: Record<TipoCampo, string[]> = {
  texto: ['contiene', 'es', 'no contiene', 'está vacío'],
  numero: ['=', 'mayor a', 'menor a', 'entre'],
  fecha: ['es', 'antes de', 'después de', 'últimos 30 días'],
  lista: ['es', 'no es'],
}

export type ConstructorFiltrosProps = {
  campos: CampoFiltro[]
  condiciones: Condicion[]
  union: Union
  onCambiar: (c: Condicion[], u: Union) => void
  className?: string
}

const CONTROL = 'h-8 min-w-0 rounded-[10px] border border-borde-fuerte bg-superficie px-2 text-[13px] text-tinta max-md:h-11'

export function ConstructorFiltros({ campos, condiciones, union, onCambiar, className }: ConstructorFiltrosProps) {
  const base = useId()
  const campo = (id: string) => campos.find((c) => c.id === id) ?? campos[0]
  const poner = (i: number, c: Partial<Condicion>) => onCambiar(condiciones.map((x, k) => (k === i ? { ...x, ...c } : x)), union)
  const agregar = () => {
    const c = campos[0]
    if (c) onCambiar([...condiciones, { campo: c.id, op: OPERADORES[c.tipo][0], valor: '' }], union)
  }

  return (
    <div className={cx('flex flex-col gap-2', className)}>
      {condiciones.map((cond, i) => {
        const def = campo(cond.campo)
        const sinValor = cond.op === 'está vacío' || cond.op === 'últimos 30 días'
        return (
          <div key={i} className="grid grid-cols-[68px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_28px] items-center gap-2 max-md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] max-md:border-b max-md:border-divisor max-md:pb-2">
            <span className="pl-0.5 text-xs text-texto-3 max-md:col-span-full">
              {i === 0 ? 'Donde' : i === 1 ? (
                <select aria-label="Unión de las condiciones" value={union} onChange={(e) => onCambiar(condiciones, e.target.value as Union)} className={cx(CONTROL, 'w-full', FOCO)}>
                  <option value="y">y</option>
                  <option value="o">o</option>
                </select>
              ) : union === 'y' ? 'y' : 'o'}
            </span>
            <select
              aria-label={`Campo de la condición ${i + 1}`}
              value={cond.campo}
              onChange={(e) => { const c = campo(e.target.value); poner(i, { campo: c.id, op: OPERADORES[c.tipo][0], valor: '' }) }}
              className={cx(CONTROL, FOCO)}
            >
              {campos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select aria-label={`Operador de la condición ${i + 1}`} value={cond.op} onChange={(e) => poner(i, { op: e.target.value })} className={cx(CONTROL, FOCO)}>
              {OPERADORES[def.tipo].map((o) => <option key={o}>{o}</option>)}
            </select>
            {sinValor ? <span className="max-md:hidden" /> : def.tipo === 'lista' ? (
              <select aria-label={`Valor de la condición ${i + 1}`} value={cond.valor} onChange={(e) => poner(i, { valor: e.target.value })} className={cx(CONTROL, 'max-md:col-span-2', FOCO)}>
                <option value="">Elegí…</option>
                {(def.opciones ?? []).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input
                id={`${base}-v${i}`}
                aria-label={`Valor de la condición ${i + 1}`}
                type={def.tipo === 'fecha' ? 'date' : 'text'}
                inputMode={def.tipo === 'numero' ? 'decimal' : undefined}
                value={cond.valor}
                onChange={(e) => poner(i, { valor: e.target.value })}
                className={cx(CONTROL, def.tipo === 'numero' && 'text-right tabular-nums', 'max-md:col-span-2', FOCO)}
              />
            )}
            <button
              type="button"
              aria-label={`Quitar la condición ${i + 1}`}
              onClick={() => onCambiar(condiciones.filter((_, k) => k !== i), union)}
              className={cx('grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-rojo-texto max-md:size-11', FOCO)}
            >
              <TrashIcon size={14} aria-hidden />
            </button>
          </div>
        )
      })}
      <button type="button" onClick={agregar} className={cx('inline-flex h-8 w-fit items-center gap-1.5 rounded-chip px-2 text-[13px] font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}>
        <PlusIcon size={14} aria-hidden /> Agregar condición
      </button>
    </div>
  )
}

export type ChipsFiltroProps = {
  campos: CampoFiltro[]
  condiciones: Condicion[]
  union: Union
  onQuitar: (indice: number) => void
}

/** El resultado arriba de la tabla: un chip por condición, con ×. */
export function ChipsFiltro({ campos, condiciones, union, onQuitar }: ChipsFiltroProps) {
  if (!condiciones.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Filtros activos">
      {condiciones.map((c, i) => (
        <li key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-mono text-[11px] tracking-[.06em] text-texto-3 uppercase">{union}</span>}
          <span className="inline-flex h-7 items-center gap-1 rounded-chip border border-borde bg-superficie pr-0.5 pl-2 text-xs text-tinta max-md:h-11">
            <span className="text-texto-3">{campos.find((x) => x.id === c.campo)?.nombre ?? c.campo}</span> {c.op} <b className="font-medium tabular-nums">{c.valor}</b>
            <button type="button" aria-label="Quitar filtro" onClick={() => onQuitar(i)} className={cx('grid size-6 place-items-center rounded-[6px] text-texto-3 hover:bg-hover hover:text-tinta max-md:size-11', FOCO)}>
              <XIcon size={12} aria-hidden />
            </button>
          </span>
        </li>
      ))}
    </ul>
  )
}
