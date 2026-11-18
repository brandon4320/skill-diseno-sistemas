'use client'
/**
 * CentroNotificaciones: avisos agrupados por día, pestañas que cuentan (también en 0),
 * "Marcar todo leído" (el Deshacer lo trae el toast del padre) y la entrega por canal al costado.
 * Las filas son FilaAviso de estructura/ (acción en la fila, éxito en el lugar).
 * Galería viva: ejemplos/biblioteca/07-listas.html#centro-de-notificaciones
 */
import { type ReactNode } from 'react'
import { ChecksIcon } from '@phosphor-icons/react'
import { Interruptor } from '../base/Interruptor'
import { cx, FOCO } from '../base/utilidades'
import { EtiquetaDia, FilaAviso, type FilaAvisoProps } from '../estructura/FilaAviso'
import { PestanasEstado, type PestanaEstado } from './Filtros'
import { plural } from './_lista'

export type Aviso = FilaAvisoProps & { id: string }

export type CanalEntrega = { id: string; nombre: string; descripcion?: ReactNode; activo: boolean }

export type CentroNotificacionesProps = {
  titulo?: string
  /** Por día: { titulo: 'Hoy', avisos }. */
  dias: Array<{ titulo: string; avisos: Aviso[] }>
  pestanas: PestanaEstado[]
  pestanaActiva: string
  onPestana: (id: string) => void
  onMarcarTodo?: () => void
  /** Entrega por canal (sistema, correo, WhatsApp) con su interruptor. */
  canales?: CanalEntrega[]
  onCanal?: (id: string, activo: boolean) => void
  /** Vacío del filtro, nombrándolo. */
  vacio?: ReactNode
  className?: string
}

export function CentroNotificaciones({
  titulo = 'Avisos',
  dias,
  pestanas,
  pestanaActiva,
  onPestana,
  onMarcarTodo,
  canales,
  onCanal,
  vacio,
  className,
}: CentroNotificacionesProps) {
  const sinLeer = dias.reduce((n, d) => n + d.avisos.filter((a) => a.leido === false).length, 0)
  const total = dias.reduce((n, d) => n + d.avisos.length, 0)
  return (
    <div className={cx('grid gap-3.5 lg:grid-cols-[1fr_280px]', className)}>
      <section className="min-w-0 overflow-hidden rounded-tarjeta border border-borde bg-superficie">
        <header className="flex flex-wrap items-center gap-2 px-5 pt-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-medium text-tinta">{titulo}</h2>
            <p className="text-xs text-texto-3" aria-live="polite">
              {sinLeer === 0 ? 'Todo leído' : plural(sinLeer, 'sin leer', 'sin leer')}
            </p>
          </div>
          {onMarcarTodo && (
            <button
              type="button"
              onClick={onMarcarTodo}
              disabled={sinLeer === 0}
              className={cx('inline-flex h-8 items-center gap-1.5 rounded-chip px-2.5 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta disabled:opacity-50', FOCO)}
            >
              <ChecksIcon size={14} aria-hidden /> Marcar todo leído
            </button>
          )}
        </header>
        <PestanasEstado pestanas={pestanas} activa={pestanaActiva} onCambio={onPestana} rotulo="Filtrar avisos" className="mt-2 px-3" />
        {total === 0
          ? vacio
          : dias.map((d) =>
              d.avisos.length === 0 ? null : (
                <section key={d.titulo} aria-label={d.titulo} className="py-1">
                  <EtiquetaDia>{d.titulo}</EtiquetaDia>
                  {d.avisos.map(({ id, ...a }) => (
                    <FilaAviso key={id} {...a} />
                  ))}
                </section>
              ),
            )}
      </section>
      {canales && canales.length > 0 && (
        <aside className="h-fit rounded-tarjeta border border-borde bg-superficie p-4">
          <h3 className="mb-2 text-[13px] font-medium text-tinta">Dónde te llegan</h3>
          <div className="divide-y divide-divisor">
            {canales.map((c) => (
              <Interruptor key={c.id} rotulo={c.nombre} descripcion={c.descripcion} activo={c.activo} onCambio={(v) => onCanal?.(c.id, v)} className="py-2" />
            ))}
          </div>
        </aside>
      )}
    </div>
  )
}
