'use client'
/**
 * Procesos: RegistroCorridas (ID en mono, origen, duración, resultado en verbos y cifras; parcial en ámbar,
 * falló en rojo con su causa), PasosConChecks (botón por paso, resultado escrito, el bloqueado dice por qué,
 * barra de segmentos) y ListaEnCurso (cuatro datos: nombre, código·cliente, quiénes y cuándo se tocó).
 * Galería viva: ejemplos/biblioteca/07-listas.html#registro-de-corridas
 */
import { useState, type ReactNode } from 'react'
import { CheckIcon, CircleNotchIcon, LockSimpleIcon, PlayIcon, WarningIcon, XIcon } from '@phosphor-icons/react'
import { PilaAvatares } from '../base/PilaAvatares'
import { type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'
import { EASE, plural } from './_lista'

/* ── Registro de corridas ───────────────────────────────────────────────── */

export type ResultadoCorrida = 'ok' | 'parcial' | 'fallo' | 'corriendo'

export type Corrida = {
  id: string
  /** "Programada", "Manual · Martina". */
  origen: string
  resultado: ResultadoCorrida
  /** En verbos y cifras: "Facturó 42 contratos por $ 18,4 M". */
  detalle: ReactNode
  /** Si es parcial o falló: la causa. */
  causa?: ReactNode
  duracion?: string
  cuando: string
}

const ICONO_CORRIDA: Record<ResultadoCorrida, ReactNode> = {
  ok: <CheckIcon size={12} weight="bold" />,
  parcial: <WarningIcon size={12} weight="bold" />,
  fallo: <XIcon size={12} weight="bold" />,
  corriendo: <CircleNotchIcon size={12} weight="bold" className="motion-safe:animate-spin" />,
}
const TONO_CORRIDA: Record<ResultadoCorrida, string> = {
  ok: 'bg-verde-fondo text-verde-texto',
  parcial: 'bg-ambar-fondo text-ambar-texto',
  fallo: 'bg-rojo-fondo text-rojo-texto',
  corriendo: 'bg-azul-fondo text-azul-texto',
}
const NOMBRE_CORRIDA: Record<ResultadoCorrida, string> = { ok: 'Sin problemas', parcial: 'Parcial', fallo: 'Falló', corriendo: 'Corriendo' }

export type RegistroCorridasProps = {
  corridas: Corrida[]
  /** Ejecutar suma la corrida arriba y se la ve correr (la pone el padre con resultado 'corriendo'). */
  onEjecutar?: () => void
  className?: string
}

export function RegistroCorridas({ corridas, onEjecutar, className }: RegistroCorridasProps) {
  const corriendo = corridas.some((c) => c.resultado === 'corriendo')
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      {onEjecutar && (
        <div className="flex justify-end border-b border-divisor px-4 py-2">
          <button
            type="button"
            onClick={onEjecutar}
            disabled={corriendo}
            className={cx('inline-flex h-8 items-center gap-1.5 rounded-chip bg-acento px-3 text-xs font-medium text-white hover:brightness-110 disabled:cursor-progress disabled:opacity-60', FOCO)}
          >
            <PlayIcon size={13} weight="fill" aria-hidden />
            {corriendo ? 'Corriendo…' : 'Ejecutar ahora'}
          </button>
        </div>
      )}
      <ul className="divide-y divide-divisor" aria-live="polite">
        {corridas.map((c) => (
          <li
            key={c.id}
            className={cx(
              'flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3 sm:flex-nowrap',
              c.resultado === 'parcial' && 'bg-ambar-fondo/40',
              c.resultado === 'fallo' && 'bg-rojo-fondo/40',
            )}
          >
            <span role="img" aria-label={NOMBRE_CORRIDA[c.resultado]} className={cx('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full', TONO_CORRIDA[c.resultado])}>
              {ICONO_CORRIDA[c.resultado]}
            </span>
            <div className="w-28 shrink-0">
              <p className="font-mono text-xs text-tinta">{c.id}</p>
              <p className="truncate text-xs text-texto-3">{c.origen}</p>
            </div>
            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
              <p className="text-[13px] text-tinta tabular-nums">{c.detalle}</p>
              {c.causa && <p className={cx('text-xs', c.resultado === 'fallo' ? 'text-rojo-texto' : 'text-ambar-texto')}>{c.causa}</p>}
            </div>
            <span className="w-14 shrink-0 text-right text-xs text-texto-2 tabular-nums">{c.duracion ?? '—'}</span>
            <span className="w-20 shrink-0 text-right text-xs text-texto-3">{c.cuando}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Pasos con checks ───────────────────────────────────────────────────── */

export type Paso = {
  id: string
  titulo: string
  descripcion?: ReactNode
  /** Botón del paso: "Cargar certificado". */
  accion: string
  hacer: () => void | Promise<void>
  /** Al terminar: "Certificado cargado · vence 12/2027". */
  resultado?: ReactNode
  hecho?: boolean
  /** Si todavía no se puede: por qué. */
  bloqueado?: string
}

export type PasosConChecksProps = { pasos: Paso[]; className?: string }

export function PasosConChecks({ pasos, className }: PasosConChecksProps) {
  const [corriendo, setCorriendo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hechos = pasos.filter((p) => p.hecho).length

  async function hacer(p: Paso) {
    setCorriendo(p.id)
    setError(null)
    try {
      await p.hacer()
    } catch {
      setError(p.id)
    } finally {
      setCorriendo(null)
    }
  }
  return (
    <div className={cx('rounded-tarjeta border border-borde bg-superficie', className)}>
      <div className="flex items-center gap-3 border-b border-divisor px-4 py-3">
        <div className="flex flex-1 gap-1" role="img" aria-label={`${hechos} de ${pasos.length} pasos hechos`}>
          {pasos.map((p) => (
            <span key={p.id} className={cx('h-1.5 flex-1 rounded-full transition-colors duration-300', EASE, p.hecho ? 'bg-verde-texto' : 'bg-suave')} />
          ))}
        </div>
        <span className="text-xs text-texto-2 tabular-nums">
          {hechos} de {pasos.length}
        </span>
      </div>
      <ol className="divide-y divide-divisor">
        {pasos.map((p, i) => (
          <li key={p.id} className={cx('flex flex-wrap items-start gap-3 px-4 py-3 sm:flex-nowrap', p.bloqueado && 'text-texto-3')}>
            <span
              className={cx(
                'grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium tabular-nums',
                p.hecho ? 'bg-verde-texto text-white' : p.bloqueado ? 'border border-borde text-texto-3' : 'border border-borde-fuerte text-tinta',
              )}
            >
              {p.hecho ? <CheckIcon size={12} weight="bold" aria-label="Hecho" /> : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cx('text-[13px] font-medium', p.bloqueado ? 'text-texto-2' : 'text-tinta')}>{p.titulo}</p>
              {p.hecho && p.resultado ? (
                <p className="text-xs text-verde-texto">{p.resultado}</p>
              ) : p.bloqueado ? (
                <p className="flex items-center gap-1 text-xs">
                  <LockSimpleIcon size={11} aria-hidden /> {p.bloqueado}
                </p>
              ) : (
                p.descripcion && <p className="text-xs text-texto-2">{p.descripcion}</p>
              )}
              {error === p.id && <p className="text-xs text-rojo-texto">No se pudo. No cambió nada; probá de nuevo.</p>}
            </div>
            {!p.hecho && (
              <button
                type="button"
                onClick={() => hacer(p)}
                disabled={!!p.bloqueado || corriendo !== null}
                aria-busy={corriendo === p.id}
                className={cx(
                  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-chip border border-borde bg-superficie px-3 text-xs font-medium text-tinta shadow-min hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50 md:h-7',
                  FOCO,
                )}
              >
                {corriendo === p.id && <CircleNotchIcon size={12} className="motion-safe:animate-spin" aria-hidden />}
                {p.accion}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── Lista mínima en curso ──────────────────────────────────────────────── */

export type ItemEnCurso = {
  id: string
  nombre: string
  codigo: string
  cliente: string
  /** El largo de la pila es el dato. */
  quienes: Persona[]
  /** "Ahora", "hace 2 h". */
  tocado: string
}

export type ListaEnCursoProps = {
  items: ItemEnCurso[]
  onAbrir: (id: string) => void
  /** Al volver de la ficha, la fila destella. */
  destacado?: string
  className?: string
}

export function ListaEnCurso({ items, onAbrir, destacado, className }: ListaEnCursoProps) {
  return (
    <ul className={cx('divide-y divide-divisor overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)} aria-label={plural(items.length, 'trabajo en curso', 'trabajos en curso')}>
      {items.map((it) => (
        <li key={it.id} data-focus={it.id} className={cx(it.id === destacado && 'motion-safe:animate-[ds-destello_1.2s_ease-out]')}>
          <button type="button" onClick={() => onAbrir(it.id)} className={cx('flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-hover', FOCO)}>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-tinta">{it.nombre}</span>
              <span className="block truncate text-xs text-texto-3">
                <span className="font-mono">{it.codigo}</span> · {it.cliente}
              </span>
            </span>
            <PilaAvatares personas={it.quienes} max={4} tamano="sm" />
            <span className="hidden w-16 shrink-0 text-right text-xs text-texto-3 sm:block">{it.tocado}</span>
          </button>
        </li>
      ))}
      <style href="ds-destello" precedence="ds">{`@keyframes ds-destello{0%,30%{background:var(--color-acento-suave)}100%{background:transparent}}`}</style>
    </ul>
  )
}
