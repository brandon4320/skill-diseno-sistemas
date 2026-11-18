'use client'
/**
 * UsoContraLimite + CompararPlanes. Patrones 14.18 y 14.19 · 12-flujos.html#uso-contra-limite y #comparar-planes
 *
 * UsoContraLimite: cifra grande "418 de 500" con su barra; ámbar desde el 80 %, rojo al tope, y una línea
 * con lo que pasa al llegar ("Al llegar a 500 no se pueden sumar clientes; lo cargado sigue").
 *
 * CompararPlanes: tarjetas con precio y lo que incluye; el plan actual marcado, el recomendado con su motivo,
 * un solo botón lleno (el del plan sugerido). Tabla de funciones opcional debajo, con columna resaltada.
 *
 *   <UsoContraLimite rotulo="Clientes" usado={418} limite={500} consecuencia="Al llegar a 500…" accion={{ texto: 'Ver planes', hacer: ver }} />
 *   <CompararPlanes planes={planes} actual="base" recomendado="pro" motivo="Para 1.000 clientes" onElegir={cambiar} />
 */
import { CheckIcon } from '@phosphor-icons/react'
import { monto, type Moneda } from '../datos/formato'
import { cx, FOCO } from './compartido'

export type UsoContraLimiteProps = {
  rotulo: string
  usado: number
  limite: number
  unidad?: string
  consecuencia?: string
  accion?: { texto: string; hacer: () => void }
}

export function UsoContraLimite({ rotulo, usado, limite, unidad, consecuencia, accion }: UsoContraLimiteProps) {
  const k = Math.min(1, usado / limite)
  const tono = k >= 1 ? 'bg-rojo-texto' : k >= 0.8 ? 'bg-ambar-texto' : 'bg-tinta'
  const n = (x: number) => x.toLocaleString('es-AR')
  return (
    <div className="flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-5">
      <span className="text-xs text-texto-3">{rotulo}</span>
      <p className="font-display text-2xl font-medium tracking-tight tabular-nums">
        {n(usado)} <span className="text-base text-texto-3">de {n(limite)}{unidad ? ` ${unidad}` : ''}</span>
      </p>
      <div role="meter" aria-label={rotulo} aria-valuemin={0} aria-valuemax={limite} aria-valuenow={usado} aria-valuetext={`${n(usado)} de ${n(limite)}`} className="h-1.5 overflow-hidden rounded-full bg-suave">
        <div className={cx('h-full rounded-full transition-[width] duration-500 ease-(--ease)', tono)} style={{ width: `${k * 100}%` }} />
      </div>
      {consecuencia && <p className={cx('text-xs', k >= 0.8 ? 'text-ambar-texto' : 'text-texto-3')}>{consecuencia}</p>}
      {accion && (
        <button type="button" onClick={accion.hacer} className={cx('self-start rounded-control text-[13px] text-texto-2 underline underline-offset-2 hover:text-tinta max-md:min-h-11', FOCO)}>{accion.texto}</button>
      )}
    </div>
  )
}

export type Plan<V extends string> = { id: V; nombre: string; precio: number; periodo?: string; resumen: string; incluye: string[] }

export type CompararPlanesProps<V extends string> = {
  planes: Plan<V>[]
  actual: V
  recomendado?: V
  /** Por qué se recomienda ("Para tus 418 clientes y los que vienen"). */
  motivo?: string
  moneda?: Moneda
  onElegir: (id: V) => void
}

export function CompararPlanes<V extends string>({ planes, actual, recomendado, motivo, moneda = 'ARS', onElegir }: CompararPlanesProps<V>) {
  return (
    <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      {planes.map((p) => {
        const esActual = p.id === actual
        const esReco = p.id === recomendado
        return (
          <article key={p.id} aria-label={`Plan ${p.nombre}`} className={cx('flex flex-col gap-4 rounded-tarjeta border bg-superficie p-5', esReco ? 'border-acento ring-[3px] ring-acento/10' : 'border-borde')}>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-display text-base font-medium">{p.nombre}</h4>
              {esActual && <span className="rounded-chip bg-suave px-1.5 py-px text-[11px] font-medium text-texto-2">Tu plan</span>}
              {esReco && <span className="rounded-chip bg-azul-fondo px-1.5 py-px text-[11px] font-medium text-azul-texto">Recomendado</span>}
            </div>
            <p className="font-display text-xl font-medium tabular-nums">
              {monto(p.precio, moneda)} <span className="font-sans text-xs font-normal text-texto-3">{p.periodo ?? 'por mes'}</span>
            </p>
            <p className="text-[13px] text-texto-2">{esReco && motivo ? motivo : p.resumen}</p>
            <ul className="flex flex-1 flex-col gap-2 text-[13px]">
              {p.incluye.map((x) => <li key={x} className="flex gap-2"><CheckIcon size={15} className="mt-px shrink-0 text-verde-texto" aria-hidden />{x}</li>)}
            </ul>
            {esActual ? (
              <span className="grid h-9 place-items-center text-[13px] text-texto-3 max-md:h-11">Es tu plan actual</span>
            ) : (
              <button type="button" onClick={() => onElegir(p.id)} className={cx('h-9 rounded-control text-[13px] font-medium max-md:h-11', esReco ? 'bg-tinta text-superficie shadow-principal hover:bg-tinta/90' : 'border border-borde bg-superficie text-tinta shadow-min hover:bg-hover', FOCO)}>
                Pasar a {p.nombre}
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}
