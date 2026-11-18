'use client'
/**
 * TarjetaOportunidad: etapa con su color, nombre, cliente y responsable, monto protagonista,
 * probabilidad y fecha de cierre, y el próximo paso con un "Hecho" a mano.
 * Ganada: monto en verde. Perdida: monto tachado y dibujo apagado (el texto sigue legible).
 */
import { CheckIcon, DotsThreeIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'
import { CajaTarjeta, miles } from './compartido'

export type ResultadoOportunidad = 'abierta' | 'ganada' | 'perdida'

export type TarjetaOportunidadProps = {
  titulo: string
  cliente: string
  /** Etapa del pipeline ("Negociación") y su color de entidad. */
  etapa: string
  colorEtapa: string
  moneda: 'US$' | '$'
  monto: number
  /** 0–100 */
  probabilidad: number
  cierre: string
  responsable: Persona
  resultado?: ResultadoOportunidad
  motivoPerdida?: string
  proximoPaso?: { texto: string; cuando: string }
  onPasoHecho?: () => void
  onMenu?: () => void
}

export function TarjetaOportunidad({
  titulo, cliente, etapa, colorEtapa, moneda, monto, probabilidad, cierre, responsable,
  resultado = 'abierta', motivoPerdida, proximoPaso, onPasoHecho, onMenu,
}: TarjetaOportunidadProps) {
  const perdida = resultado === 'perdida'
  return (
    <CajaTarjeta aria-label={`${titulo}, ${etapa}`} className="gap-3">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
          style={{ color: `color-mix(in oklch, ${colorEtapa} 62%, var(--color-tinta))` }}
        >
          <span aria-hidden className={cx('size-2 rounded-full', perdida && 'grayscale')} style={{ background: colorEtapa }} />
          {resultado === 'ganada' ? 'Ganada' : perdida ? 'Perdida' : etapa}
        </span>
        {perdida && motivoPerdida && <span className="text-xs text-texto-3">{motivoPerdida}</span>}
        {onMenu && (
          <button
            type="button"
            aria-label="Más acciones"
            onClick={onMenu}
            className={cx('ml-auto grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-suave hover:text-tinta pointer-coarse:size-11', FOCO)}
          >
            <DotsThreeIcon size={18} weight="bold" />
          </button>
        )}
      </div>

      <div className="min-w-0">
        <h3 className={cx('truncate text-sm font-medium', perdida ? 'text-texto-2' : 'text-tinta')}>{titulo}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-texto-3">
          <span className="truncate">{cliente}</span>
          <span aria-hidden>·</span>
          <Avatar persona={responsable} tamano="xs" className={perdida ? 'grayscale' : undefined} />
          <span className="truncate">{responsable.nombre.split(' ')[0]}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span
          className={cx(
            'text-xl font-medium whitespace-nowrap tabular-nums',
            resultado === 'ganada' ? 'text-verde-texto' : perdida ? 'text-texto-3 line-through' : 'text-tinta',
          )}
        >
          <span className="mr-1 text-sm font-normal text-texto-3">{moneda}</span>
          {miles(monto)}
        </span>
        <span className="ml-auto text-xs text-texto-3 tabular-nums">
          {resultado === 'abierta' ? `${probabilidad} % · cierra ${cierre}` : cierre}
        </span>
      </div>

      {resultado === 'abierta' && proximoPaso && (
        <div className="flex min-h-9 items-center gap-2 rounded-control bg-panel py-1 pr-1 pl-3 text-xs pointer-coarse:min-h-11">
          <span className="min-w-0 flex-1 truncate text-texto-2">
            {proximoPaso.texto} <span className="text-texto-3">· {proximoPaso.cuando}</span>
          </span>
          {onPasoHecho && (
            <button
              type="button"
              onClick={onPasoHecho}
              className={cx('inline-flex h-7 items-center gap-1 rounded-chip px-2 font-medium text-texto-2 hover:bg-suave hover:text-tinta pointer-coarse:h-11', FOCO)}
            >
              <CheckIcon size={14} />Hecho
            </button>
          )}
        </div>
      )}
    </CajaTarjeta>
  )
}
