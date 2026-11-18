'use client'
/**
 * VistaPreviaLote + ResultadoLote: antes de una acción masiva se muestra qué va a pasar, agrupado por lo que le
 * pasa a cada fila; después, el resultado en verbos y cifras. Patrones 14.12 y 14.14 ·
 * 12-flujos.html#vista-previa-antes-del-lote y #resultado-en-verbos-y-cifras
 *
 * - Grupos con verbo ("Se facturan", "Se saltean") + cantidad + motivo; las filas se despliegan por grupo.
 * - El botón repite la cifra que importa ("Facturar 18 contratos · $ 7,6 M").
 * - El resultado no dice "Proceso completado": dice qué se hizo, cuánto, qué quedó afuera y por qué, con un enlace a cada parte.
 *
 *   <VistaPreviaLote grupos={[{ tono: 'verde', verbo: 'Se facturan', filas: ok }, { tono: 'ambar', verbo: 'Se saltean', motivo: 'Sin CUIT', filas: sin }]}
 *     accion="Facturar 18 contratos · $ 7,6 M" onConfirmar={facturar} />
 *   <ResultadoLote titulo="Se emitieron 18 facturas" lineas={[{ cifra: '$ 7.640.000', texto: 'facturado' }, …]} />
 */
import { useState, type ReactNode } from 'react'
import { CaretDownIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { TONOS, type Tono } from '../base/utilidades'
import { BotonEspera, cx, FOCO, plural } from './compartido'

export type FilaLote = { id: string; texto: ReactNode; detalle?: ReactNode }
export type GrupoLote = { tono: Tono; verbo: string; motivo?: string; filas: FilaLote[] }

export type VistaPreviaLoteProps = {
  grupos: GrupoLote[]
  /** Texto del botón con la cifra: "Facturar 18 contratos · $ 7,6 M". */
  accion: string
  textoEspera?: string
  onConfirmar: () => void | Promise<void>
  onCancelar?: () => void
}

export function VistaPreviaLote({ grupos, accion, textoEspera = 'Procesando…', onConfirmar, onCancelar }: VistaPreviaLoteProps) {
  const [abierto, setAbierto] = useState<number | null>(null)
  const hay = grupos.some((g) => g.tono === 'verde' && g.filas.length)
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col overflow-hidden rounded-control border border-borde">
        {grupos.map((g, i) => {
          const on = abierto === i
          return (
            <li key={g.verbo} className="border-b border-divisor last:border-0">
              <button type="button" aria-expanded={on} onClick={() => setAbierto(on ? null : i)} className={cx('flex min-h-12 w-full items-center gap-3 px-4 text-left text-[13px] hover:bg-hover', FOCO)}>
                <span aria-hidden className={cx('size-2 shrink-0 rounded-full', TONOS[g.tono].punto)} />
                <span className="flex-1">
                  <b className="font-medium">{g.verbo} {plural(g.filas.length, 'fila', 'filas')}</b>
                  {g.motivo && <span className="text-texto-3"> · {g.motivo}</span>}
                </span>
                <CaretDownIcon size={14} aria-hidden className={cx('text-texto-3 transition-transform', on && 'rotate-180')} />
              </button>
              {on && (
                <ul className="max-h-[220px] overflow-auto bg-panel px-4 py-1">
                  {g.filas.map((f) => (
                    <li key={f.id} className="flex items-baseline justify-between gap-3 border-b border-divisor py-2 text-[13px] last:border-0">
                      <span className="min-w-0 truncate">{f.texto}</span>
                      {f.detalle && <span className="shrink-0 text-texto-2 tabular-nums">{f.detalle}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {onCancelar && <button type="button" onClick={onCancelar} className={cx('min-h-9 rounded-control px-3 text-[13px] text-texto-2 hover:bg-suave hover:text-tinta max-md:min-h-11', FOCO)}>Cancelar</button>}
        <BotonEspera hacer={onConfirmar} textoEspera={textoEspera} motivoBloqueo={hay ? undefined : 'No queda ninguna fila para procesar'}>{accion}</BotonEspera>
      </div>
    </div>
  )
}

export type LineaResultado = { cifra: string; texto: string; tono?: Tono; enlace?: { texto: string; href: string } }

export type ResultadoLoteProps = {
  /** Verbo + cifra: "Se emitieron 18 facturas". */
  titulo: string
  lineas: LineaResultado[]
  /** "hoy 15:40 · 2,8 s" */
  cuando?: string
  acciones?: ReactNode
}

export function ResultadoLote({ titulo, lineas, cuando, acciones }: ResultadoLoteProps) {
  return (
    <div role="status" className="flex flex-col gap-4 rounded-tarjeta border border-borde bg-superficie p-5">
      <div className="flex items-start gap-3">
        <CheckCircleIcon size={22} weight="fill" className="shrink-0 text-verde-texto" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <h4 className="font-display text-base font-medium">{titulo}</h4>
          {cuando && <span className="text-xs text-texto-3 tabular-nums">{cuando}</span>}
        </div>
      </div>
      <ul className="flex flex-col">
        {lineas.map((l) => (
          <li key={l.texto} className="flex items-baseline gap-3 border-b border-divisor py-2.5 text-[13px] last:border-0">
            <b className={cx('min-w-[110px] font-medium tabular-nums', l.tono ? TONOS[l.tono].texto : 'text-tinta')}>{l.cifra}</b>
            <span className="flex-1 text-texto-2">{l.texto}</span>
            {l.enlace && <a href={l.enlace.href} className="text-texto-2 underline underline-offset-2 hover:text-tinta">{l.enlace.texto}</a>}
          </li>
        ))}
      </ul>
      {acciones && <div className="flex flex-wrap justify-end gap-2">{acciones}</div>}
    </div>
  )
}
