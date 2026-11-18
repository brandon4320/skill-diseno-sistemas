'use client'
/**
 * TarjetaPlanUso: cuánto del plan se usó, la proyección a fin de período en palabras
 * ("a este ritmo llegás al límite el 26 nov") y de qué se compone el uso. La barra pasa a
 * ámbar desde el 80 % y a rojo si la proyección supera el límite antes de renovar.
 */
import { ArrowUpIcon } from '@phosphor-icons/react'
import { Boton } from '../base/Boton'
import { Pastilla } from '../base/Pastilla'
import { CajaTarjeta, BarraUso, miles } from './compartido'

export type ParteUso = { nombre: string; pct: number; color: string }

export type TarjetaPlanUsoProps = {
  recurso: string
  plan: string
  usado: number
  limite: number
  proyeccion?: number
  /** "26 nov": fecha en que se llega al límite al ritmo actual. */
  llegaAlLimite?: string
  renueva: string
  partes?: readonly ParteUso[]
  onAmpliar?: () => void
  textoAmpliar?: string
}

export function TarjetaPlanUso({ recurso, plan, usado, limite, proyeccion, llegaAlLimite, renueva, partes, onAmpliar, textoAmpliar }: TarjetaPlanUsoProps) {
  const pct = Math.round((usado / limite) * 100)
  const pasa = proyeccion !== undefined && proyeccion > limite
  const color = pasa ? 'var(--color-rojo-texto)' : pct >= 80 ? 'var(--color-ambar-texto)' : undefined
  return (
    <CajaTarjeta aria-label={`${recurso}, ${pct} % usado`}>
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-medium text-tinta">{recurso}</h3>
        <span className="ml-auto"><Pastilla tono="gris" punto={false}>Plan {plan}</Pastilla></span>
      </div>
      <div className="flex items-baseline gap-2 tabular-nums">
        <span className="text-2xl font-medium text-tinta">{miles(usado)}</span>
        <span className="text-sm text-texto-3">/ {miles(limite)}</span>
        <span className="ml-auto text-sm font-medium text-texto-2">{pct} %</span>
      </div>
      <BarraUso valor={usado} total={limite} color={color} rotulo={`${recurso} usados`} />
      {pasa && llegaAlLimite && (
        <p className="text-xs leading-normal text-texto-2">
          A este ritmo llegás al límite el <b className="font-medium text-rojo-texto">{llegaAlLimite}</b>, antes de que se renueve.
        </p>
      )}
      {partes && partes.length > 0 && (
        <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
          {partes.map(p => (
            <li key={p.nombre} className="flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-sm" style={{ background: p.color }} />
              <span className="min-w-0 flex-1 truncate text-texto-2">{p.nombre}</span>
              <span className="text-texto-3 tabular-nums">{p.pct} %</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex items-center gap-3 border-t border-divisor pt-3">
        <span className="text-xs text-texto-3 tabular-nums">Se renueva el {renueva}</span>
        {onAmpliar && (
          <Boton tamano="chico" variante={pasa ? 'principal' : 'secundario'} icono={ArrowUpIcon} onClick={onAmpliar} className="ml-auto tabular-nums pointer-coarse:h-11">
            {textoAmpliar ?? 'Ampliar'}
          </Boton>
        )}
      </div>
    </CajaTarjeta>
  )
}
