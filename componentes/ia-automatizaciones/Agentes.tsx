'use client'
/**
 * Agentes: fila de agente con su línea de qué hace y una rayita de 2 px de su color como avance;
 * AgentesPorEstado los agrupa en Activos / Libres / Desconectados. Lo inactivo se apaga en el
 * avatar (gris y tenue), nunca en el texto, y "No disponible" siempre dice cuándo vuelve.
 * AgentesQueTeNecesitan: la bandeja de los que esperan una respuesta tuya.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#agentes-por-estado
 */
import type { ReactNode } from 'react'
import { CaretRightIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { colorDe, cx, FOCO } from '../base/utilidades'

export type EstadoAgente = 'trabajando' | 'esperando' | 'libre' | 'desconectado'

export type Agente = Persona & {
  /** Qué hace ahora, en una línea: "Revisando 32 facturas de noviembre". */
  linea: string
  estado: EstadoAgente
  /** 0–1: avance de la tarea en curso. */
  avance?: number
  /** Solo para desconectado: "vuelve 16:00". Obligatorio para que no quede "sin hora". */
  vuelve?: string
}

const ROTULO: Record<EstadoAgente, { texto: string; clase: string }> = {
  trabajando: { texto: 'Trabajando', clase: 'text-azul-texto' },
  esperando: { texto: 'Te espera', clase: 'text-ambar-texto' },
  libre: { texto: 'Libre', clase: 'text-texto-3' },
  desconectado: { texto: 'No disponible', clase: 'text-texto-3' },
}

export type FilaAgenteProps = {
  agente: Agente
  onAbrir?: (a: Agente) => void
  className?: string
}

export function FilaAgente({ agente: a, onAbrir, className }: FilaAgenteProps) {
  const inactivo = a.estado === 'libre' || a.estado === 'desconectado'
  const r = ROTULO[a.estado]
  const contenido: ReactNode = (
    <>
      <Avatar persona={a} tamano="md" decorativo className={cx(inactivo && 'opacity-45 grayscale')} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center justify-between gap-3">
          <b className={cx('truncate text-[13px] font-medium', inactivo ? 'text-texto-2' : 'text-tinta')}>{a.nombre}</b>
          <span className={cx('shrink-0 text-xs font-medium', r.clase)}>
            {r.texto}
            {a.estado === 'desconectado' && a.vuelve ? ` · ${a.vuelve}` : ''}
          </span>
        </span>
        <small className="truncate text-xs text-texto-3">{a.linea}</small>
        {a.estado === 'trabajando' && a.avance !== undefined && (
          <span
            role="progressbar"
            aria-label={`Avance de ${a.nombre}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(a.avance * 100)}
            className="mt-1 h-0.5 overflow-hidden rounded-full bg-suave"
          >
            <span
              className="block h-full rounded-full transition-[width] duration-500"
              style={{ width: `${Math.max(0, Math.min(1, a.avance)) * 100}%`, background: colorDe(a.id) }}
            />
          </span>
        )}
      </span>
    </>
  )
  const base = 'flex w-full items-start gap-3 rounded-control px-3 py-2.5 text-left max-md:min-h-11'
  return onAbrir ? (
    <button type="button" onClick={() => onAbrir(a)} className={cx(base, 'hover:bg-hover', FOCO, className)}>
      {contenido}
    </button>
  ) : (
    <div className={cx(base, className)}>{contenido}</div>
  )
}

const GRUPOS: { titulo: string; estados: EstadoAgente[] }[] = [
  { titulo: 'Activos', estados: ['trabajando', 'esperando'] },
  { titulo: 'Libres', estados: ['libre'] },
  { titulo: 'Desconectados', estados: ['desconectado'] },
]

export function AgentesPorEstado({ agentes, onAbrir, className }: { agentes: Agente[]; onAbrir?: (a: Agente) => void; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-4', className)}>
      {GRUPOS.map((g) => {
        const lista = agentes.filter((a) => g.estados.includes(a.estado))
        if (lista.length === 0) return null
        return (
          <section key={g.titulo} aria-label={g.titulo}>
            <h4 className="px-3 pb-1 font-mono text-[11px] font-medium tracking-[.06em] text-texto-3 uppercase tabular-nums">
              {g.titulo} · {lista.length}
            </h4>
            <div className="flex flex-col">
              {lista.map((a) => (
                <FilaAgente key={a.id} agente={a} onAbrir={onAbrir} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* ── Agentes que te necesitan ──────────────────────────────────────────── */

export type PedidoAgente = {
  id: string
  agente: Persona
  /** La pregunta, concreta: "¿Le mando el recordatorio a Grupo Atlas?". */
  pregunta: string
  /** Sobre qué: "FAC-01094 · $ 2.115.000". */
  sobre?: string
  hace: string
}

export function AgentesQueTeNecesitan({ pedidos, onAbrir, className }: { pedidos: PedidoAgente[]; onAbrir: (p: PedidoAgente) => void; className?: string }) {
  if (pedidos.length === 0) return null
  return (
    <section aria-label="Agentes que te necesitan" className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min', className)}>
      <header className="flex items-center gap-2 border-b border-divisor px-4 py-3">
        <span className="size-2 rounded-full bg-ambar-texto" aria-hidden />
        <h3 className="text-[13px] font-medium text-tinta tabular-nums">
          {pedidos.length} {pedidos.length === 1 ? 'agente te necesita' : 'agentes te necesitan'}
        </h3>
      </header>
      <ul className="flex flex-col p-1.5">
        {pedidos.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onAbrir(p)}
              className={cx('flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left hover:bg-hover max-md:min-h-11', FOCO)}
            >
              <Avatar persona={p.agente} tamano="sm" decorativo />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] text-tinta">
                  <b className="font-medium">{p.agente.nombre}</b> · {p.pregunta}
                </span>
                {p.sobre && <small className="truncate text-xs text-texto-3 tabular-nums">{p.sobre}</small>}
              </span>
              <span className="shrink-0 text-xs text-texto-3">{p.hace}</span>
              <CaretRightIcon size={13} className="shrink-0 text-texto-3" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
