'use client'
/**
 * Reglas como oración: cada condición se lee como frase. Operador Y/O en pastilla (clic para
 * cambiar), campo, comparación y valor editables en el lugar, la oración completa abajo y las
 * coincidencias recalculadas al instante. ProgramacionDosLineas: lo técnico (cron) en segunda
 * línea, mono gris, debajo de su versión en palabras.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#reglas-como-oracion
 */
import { useId } from 'react'
import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type Operador = 'Y' | 'O'

export type OpcionRegla = { valor: string; texto: string }

export type CampoRegla = {
  valor: string
  texto: string
  comparaciones: OpcionRegla[]
  /** Si hay opciones, el valor es un select; si no, un texto libre (montos en mono). */
  valores?: OpcionRegla[]
  /** "$", "días". */
  unidad?: string
}

export type Condicion = { id: string; campo: string; comparacion: string; valor: string }

export type ReglasOracionProps = {
  campos: CampoRegla[]
  condiciones: Condicion[]
  operador: Operador
  onCambiarOperador: (o: Operador) => void
  onCambiar: (c: Condicion[]) => void
  /** Se llama al agregar: devuelve la condición nueva con valores por defecto. */
  nueva: () => Condicion
  /** Coincidencias de hoy con la regla actual; null mientras calcula. */
  coincidencias?: number | null
  className?: string
}

const CONTROL = 'h-7 rounded-[7px] bg-panel px-2 text-[13px] font-medium text-tinta hover:bg-suave max-md:h-11'

export function ReglasOracion({
  campos,
  condiciones,
  operador,
  onCambiarOperador,
  onCambiar,
  nueva,
  coincidencias,
  className,
}: ReglasOracionProps) {
  const idBase = useId()
  const campoDe = (v: string) => campos.find((c) => c.valor === v) ?? campos[0]
  const cambiar = (id: string, parche: Partial<Condicion>) =>
    onCambiar(condiciones.map((c) => (c.id === id ? { ...c, ...parche } : c)))

  const frase = condiciones
    .map((c) => {
      const f = campoDe(c.campo)
      const cmp = f.comparaciones.find((x) => x.valor === c.comparacion)?.texto ?? ''
      const val = f.valores?.find((x) => x.valor === c.valor)?.texto ?? `${f.unidad === '$' ? '$ ' : ''}${c.valor}${f.unidad && f.unidad !== '$' ? ` ${f.unidad}` : ''}`
      return `${f.texto.toLowerCase()} ${cmp} ${val}`
    })
    .join(operador === 'Y' ? ' y ' : ' o ')

  return (
    <div className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min', className)}>
      <ol className="flex flex-col">
        {condiciones.map((c, i) => {
          const f = campoDe(c.campo)
          return (
            <li key={c.id} className="group flex flex-wrap items-center gap-2 border-b border-divisor px-4 py-2.5">
              {i === 0 ? (
                <span className="w-11 text-xs font-semibold tracking-[.04em] text-texto-3">SI</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onCambiarOperador(operador === 'Y' ? 'O' : 'Y')}
                  aria-label={`Operador ${operador === 'Y' ? 'y' : 'o'}. Cambiar a ${operador === 'Y' ? 'o' : 'y'}`}
                  className={cx('grid h-[22px] w-11 place-items-center rounded-[6px] bg-suave text-[11px] font-semibold tracking-[.04em] text-texto-2 hover:bg-hover max-md:h-11', FOCO)}
                >
                  {operador}
                </button>
              )}
              <select
                aria-label={`Campo de la condición ${i + 1}`}
                value={c.campo}
                onChange={(e) => {
                  const nf = campoDe(e.target.value)
                  cambiar(c.id, { campo: nf.valor, comparacion: nf.comparaciones[0]?.valor ?? '', valor: nf.valores?.[0]?.valor ?? '' })
                }}
                className={cx(CONTROL, FOCO)}
              >
                {campos.map((x) => (
                  <option key={x.valor} value={x.valor}>
                    {x.texto}
                  </option>
                ))}
              </select>
              <select
                aria-label={`Comparación de la condición ${i + 1}`}
                value={c.comparacion}
                onChange={(e) => cambiar(c.id, { comparacion: e.target.value })}
                className={cx(CONTROL, 'font-normal text-texto-2', FOCO)}
              >
                {f.comparaciones.map((x) => (
                  <option key={x.valor} value={x.valor}>
                    {x.texto}
                  </option>
                ))}
              </select>
              {f.valores ? (
                <select
                  aria-label={`Valor de la condición ${i + 1}`}
                  value={c.valor}
                  onChange={(e) => cambiar(c.id, { valor: e.target.value })}
                  className={cx(CONTROL, FOCO)}
                >
                  {f.valores.map((x) => (
                    <option key={x.valor} value={x.valor}>
                      {x.texto}
                    </option>
                  ))}
                </select>
              ) : (
                <label className="inline-flex items-center gap-1">
                  {f.unidad === '$' && <span className="text-xs text-texto-3">$</span>}
                  <input
                    id={`${idBase}-${c.id}`}
                    aria-label={`Valor de la condición ${i + 1}`}
                    value={c.valor}
                    inputMode={f.unidad ? 'numeric' : 'text'}
                    onChange={(e) => cambiar(c.id, { valor: e.target.value })}
                    className={cx(CONTROL, 'w-28 font-mono tabular-nums outline-none focus:shadow-[0_0_0_2px_color-mix(in_oklch,var(--color-acento)_40%,transparent)]')}
                  />
                  {f.unidad && f.unidad !== '$' && <span className="text-xs text-texto-3">{f.unidad}</span>}
                </label>
              )}
              {condiciones.length > 1 && (
                <button
                  type="button"
                  aria-label={`Quitar condición ${i + 1}`}
                  title="Quitar"
                  onClick={() => onCambiar(condiciones.filter((x) => x.id !== c.id))}
                  className={cx('ml-auto grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100 max-md:size-11', FOCO)}
                >
                  <XIcon size={13} aria-hidden />
                </button>
              )}
            </li>
          )
        })}
      </ol>
      <button
        type="button"
        onClick={() => onCambiar([...condiciones, nueva()])}
        className={cx('flex w-full items-center gap-2 border-b border-divisor px-4 py-2.5 text-[13px] text-texto-3 hover:bg-hover hover:text-tinta max-md:min-h-11', FOCO)}
      >
        <PlusIcon size={14} aria-hidden />
        Agregar condición
      </button>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-b-tarjeta bg-panel px-4 py-3 text-[13px]">
        <span className="font-mono text-[11px] font-medium tracking-[.06em] text-texto-3 uppercase">Criterio</span>
        <span className="min-w-0 flex-1 text-texto-2">Si {frase}</span>
        <span className="text-texto-2 tabular-nums" aria-live="polite">
          Coincidencias hoy: <b className="font-medium text-tinta">{coincidencias == null ? '…' : coincidencias}</b>
        </span>
      </div>
    </div>
  )
}

/* ── Programación en dos líneas ────────────────────────────────────────── */

export function ProgramacionDosLineas({ palabras, tecnico, className }: { palabras: string; tecnico: string; className?: string }) {
  return (
    <p className={cx('flex flex-col gap-0.5', className)}>
      <span className="text-[13px] text-tinta tabular-nums">{palabras}</span>
      <span className="font-mono text-[11px] text-texto-3">{tecnico}</span>
    </p>
  )
}
