'use client'
/**
 * Actividad: LineaTiempo (ícono por tipo sobre línea de 1 px, lo automático plegado),
 * HiloComentarios (menciones, reacciones, respuestas con sangría, resolver),
 * HistorialHechos (hechos con cifra + qué cambió) y ListaPorDia (cabecera de día pegada con conteo y total).
 * Galería viva: ejemplos/biblioteca/07-listas.html#linea-de-tiempo-de-actividad
 */
import { Fragment, useState, type ReactNode } from 'react'
import {
  ArrowRightIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  FileIcon,
  GearSixIcon,
  CurrencyDollarIcon,
  FlagIcon,
  ArrowCounterClockwiseIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'
import { EASE, plural } from './_lista'

/* ── Línea de tiempo ────────────────────────────────────────────────────── */

export type TipoEvento = 'comentario' | 'archivo' | 'etapa' | 'monto' | 'sistema' | 'hecho'

const ICONO: Record<TipoEvento, Icon> = {
  comentario: ChatCircleIcon,
  archivo: FileIcon,
  etapa: FlagIcon,
  monto: CurrencyDollarIcon,
  sistema: GearSixIcon,
  hecho: CheckCircleIcon,
}

export type EventoActividad = {
  id: string
  tipo: TipoEvento
  /** Quién: persona o "Sistema". */
  autor?: Persona
  /** "cambió la etapa", "subió un archivo". */
  accion: ReactNode
  /** Hace cuánto, ya formateado. */
  cuando: string
  /** Contenido en línea: la cita, el archivo, "En diseño → En obra". */
  cita?: string
  cambio?: { de: ReactNode; a: ReactNode }
  /** Monto viejo tachado → nuevo. */
  monto?: { antes: string; ahora: string }
  archivo?: { nombre: string; peso?: string }
}

export type LineaTiempoProps = {
  eventos: EventoActividad[]
  /** Pliega los automáticos seguidos en "4 cambios del sistema". */
  plegarSistema?: boolean
  className?: string
}

export function LineaTiempo({ eventos, plegarSistema = true, className }: LineaTiempoProps) {
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set())
  // Agrupa corridas de eventos de sistema.
  const bloques: Array<{ sistema: true; eventos: EventoActividad[]; i: number } | { sistema: false; evento: EventoActividad }> = []
  eventos.forEach((e, i) => {
    const ult = bloques[bloques.length - 1]
    if (plegarSistema && e.tipo === 'sistema') {
      if (ult && ult.sistema) ult.eventos.push(e)
      else bloques.push({ sistema: true, eventos: [e], i })
    } else bloques.push({ sistema: false, evento: e })
  })
  return (
    <ol className={cx('relative', className)}>
      <span aria-hidden className="absolute top-3 bottom-3 left-[15px] w-px bg-divisor" />
      {bloques.map((b) => {
        if (!b.sistema) return <ItemLinea key={b.evento.id} e={b.evento} />
        if (b.eventos.length === 1) return <ItemLinea key={b.eventos[0].id} e={b.eventos[0]} />
        const abierto = abiertos.has(b.i)
        return (
          <Fragment key={`s${b.i}`}>
            <li className="relative flex items-center gap-3 py-1.5 pl-0">
              <span className="relative z-[1] grid size-8 place-items-center rounded-full border border-borde bg-superficie text-texto-3">
                <GearSixIcon size={14} aria-hidden />
              </span>
              <button
                type="button"
                aria-expanded={abierto}
                onClick={() =>
                  setAbiertos((s) => {
                    const n = new Set(s)
                    if (n.has(b.i)) n.delete(b.i)
                    else n.add(b.i)
                    return n
                  })
                }
                className={cx('h-8 rounded-chip px-2 text-xs text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}
              >
                {abierto ? 'Ocultar' : plural(b.eventos.length, 'cambio del sistema', 'cambios del sistema')}
              </button>
            </li>
            {abierto && b.eventos.map((e) => <ItemLinea key={e.id} e={e} />)}
          </Fragment>
        )
      })}
    </ol>
  )
}

function ItemLinea({ e }: { e: EventoActividad }) {
  const I = ICONO[e.tipo]
  return (
    <li className="relative flex gap-3 py-2 motion-safe:animate-[ds-entrar_.4s_cubic-bezier(.23,1,.32,1)]">
      <span className="relative z-[1] grid size-8 shrink-0 place-items-center rounded-full border border-borde bg-superficie text-texto-2">
        {e.autor && e.tipo === 'comentario' ? <Avatar persona={e.autor} tamano="sm" decorativo /> : <I size={15} aria-hidden />}
      </span>
      <div className="min-w-0 flex-1 pt-1.5">
        <p className="text-[13px] text-texto-2">
          <span className="font-medium text-tinta">{e.autor?.nombre ?? 'Sistema'}</span> {e.accion}
          <span className="ml-1.5 text-xs text-texto-3">{e.cuando}</span>
        </p>
        {e.cita && <blockquote className="mt-1.5 rounded-interno border border-borde bg-panel px-3 py-2 text-[13px] text-tinta">{e.cita}</blockquote>}
        {e.cambio && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-texto-2">
            <span>{e.cambio.de}</span>
            <ArrowRightIcon size={11} aria-label="pasó a" />
            <span className="font-medium text-tinta">{e.cambio.a}</span>
          </p>
        )}
        {e.monto && (
          <p className="mt-1 text-xs tabular-nums">
            <del className="text-texto-3">{e.monto.antes}</del> <span className="font-medium text-tinta">{e.monto.ahora}</span>
          </p>
        )}
        {e.archivo && (
          <p className="mt-1.5 inline-flex items-center gap-2 rounded-chip border border-borde px-2 py-1 text-xs text-tinta">
            <FileIcon size={13} aria-hidden />
            {e.archivo.nombre}
            {e.archivo.peso && <span className="text-texto-3 tabular-nums">{e.archivo.peso}</span>}
          </p>
        )}
      </div>
      <style href="ds-entrar" precedence="ds">{`@keyframes ds-entrar{from{opacity:0;filter:blur(4px);transform:translateY(-4px)}to{opacity:1;filter:none;transform:none}}`}</style>
    </li>
  )
}

/* ── Hilo de comentarios ────────────────────────────────────────────────── */

export type Reaccion = { emoji: string; quienes: string[]; mia?: boolean }

export type Comentario = {
  id: string
  autor: Persona
  /** "Administración". */
  area?: string
  cuando: string
  /** Texto; las menciones van como "@Nombre Apellido" y se resaltan. */
  texto: string
  reacciones?: Reaccion[]
  respuestas?: Comentario[]
}

export type HiloComentariosProps = {
  comentarios: Comentario[]
  resuelto?: boolean
  /** Quién lo resolvió y cuándo: "Tomás Ferro lo resolvió hace 1 h". */
  textoResuelto?: string
  onResolver?: (resuelto: boolean) => void
  onReaccionar?: (comentarioId: string, emoji: string) => void
  onResponder?: (comentarioId: string) => void
  className?: string
}

function conMenciones(texto: string): ReactNode[] {
  return texto.split(/(@[\p{Lu}][\p{L}]+(?: [\p{Lu}][\p{L}]+)?)/u).map((p, i) =>
    p.startsWith('@') ? (
      <span key={i} className="rounded-[4px] bg-acento-suave px-0.5 font-medium text-acento">
        {p}
      </span>
    ) : (
      p
    ),
  )
}

/** Resolver lo pliega en una línea con Reabrir. */
export function HiloComentarios({ comentarios, resuelto = false, textoResuelto = 'Hilo resuelto', onResolver, onReaccionar, onResponder, className }: HiloComentariosProps) {
  if (resuelto)
    return (
      <div className={cx('flex h-11 items-center gap-2 rounded-tarjeta border border-borde bg-panel px-4 text-[13px] text-texto-2', className)}>
        <CheckCircleIcon size={16} weight="fill" className="text-verde-texto" aria-hidden />
        <span className="flex-1 truncate">
          {textoResuelto} · {plural(contar(comentarios), 'comentario')}
        </span>
        {onResolver && (
          <button type="button" onClick={() => onResolver(false)} className={cx('inline-flex h-8 items-center gap-1.5 rounded-chip px-2 text-xs font-medium text-tinta hover:bg-hover', FOCO)}>
            <ArrowCounterClockwiseIcon size={13} aria-hidden /> Reabrir
          </button>
        )}
      </div>
    )
  const pintar = (c: Comentario, nivel: number): ReactNode => (
    <li key={c.id} className={cx('flex gap-3', nivel > 0 && 'mt-3 ml-11')}>
      <Avatar persona={c.autor} tamano={nivel > 0 ? 'sm' : 'md'} decorativo />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-texto-3">
          <span className="text-[13px] font-medium text-tinta">{c.autor.nombre}</span>
          {c.area && <> · {c.area}</>} · {c.cuando}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-tinta">{conMenciones(c.texto)}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {c.reacciones?.map((r) => (
            <button
              key={r.emoji}
              type="button"
              title={r.quienes.join(', ')}
              aria-label={`${r.emoji} ${r.quienes.length}: ${r.quienes.join(', ')}`}
              aria-pressed={!!r.mia}
              onClick={() => onReaccionar?.(c.id, r.emoji)}
              className={cx(
                'inline-flex h-7 items-center gap-1 rounded-chip border px-2 text-xs tabular-nums transition-colors',
                r.mia ? 'border-acento/40 bg-acento-suave text-acento' : 'border-borde text-texto-2 hover:bg-hover',
                FOCO,
              )}
            >
              <span aria-hidden>{r.emoji}</span>
              {r.quienes.length}
            </button>
          ))}
          {onResponder && nivel === 0 && (
            <button type="button" onClick={() => onResponder(c.id)} className={cx('h-7 rounded-chip px-2 text-xs text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
              Responder
            </button>
          )}
        </div>
        {c.respuestas && c.respuestas.length > 0 && <ul>{c.respuestas.map((r) => pintar(r, nivel + 1))}</ul>}
      </div>
    </li>
  )
  return (
    <div className={cx('rounded-tarjeta border border-borde bg-superficie p-4', className)}>
      <ul className="space-y-4">{comentarios.map((c) => pintar(c, 0))}</ul>
      {onResolver && (
        <div className="mt-4 flex justify-end border-t border-divisor pt-3">
          <button
            type="button"
            onClick={() => onResolver(true)}
            className={cx('inline-flex h-8 items-center gap-1.5 rounded-chip border border-borde bg-superficie px-3 text-xs font-medium text-tinta shadow-min hover:bg-hover', FOCO)}
          >
            <CheckCircleIcon size={14} aria-hidden /> Resolver
          </button>
        </div>
      )}
    </div>
  )
}

function contar(cs: Comentario[]): number {
  return cs.reduce((n, c) => n + 1 + contar(c.respuestas ?? []), 0)
}

/* ── Historial con cifras ───────────────────────────────────────────────── */

export type Hecho = {
  id: string
  /** Con su cifra: "14 facturas cobradas por $ 9,8 M". Nunca "Actualización". */
  titulo: ReactNode
  /** Qué cambió: "3 llegaron por Mercado Pago". */
  detalle?: ReactNode
  icono?: Icon
  tono?: 'verde' | 'ambar' | 'rojo' | 'azul' | 'gris'
}

export type HistorialHechosProps = { grupos: Array<{ titulo: string; hechos: Hecho[] }>; className?: string }

const TONO: Record<NonNullable<Hecho['tono']>, string> = {
  verde: 'bg-verde-fondo text-verde-texto',
  ambar: 'bg-ambar-fondo text-ambar-texto',
  rojo: 'bg-rojo-fondo text-rojo-texto',
  azul: 'bg-azul-fondo text-azul-texto',
  gris: 'bg-gris-fondo text-gris-texto',
}

/** Agrupado Ayer / Esta semana / Este mes; cada hecho con su cifra y una segunda línea. */
export function HistorialHechos({ grupos, className }: HistorialHechosProps) {
  return (
    <div className={cx('space-y-5', className)}>
      {grupos.map((g) => (
        <section key={g.titulo}>
          <h3 className="mb-2 text-xs font-medium text-texto-3">{g.titulo}</h3>
          <ul className="space-y-3">
            {g.hechos.map((h) => {
              const I = h.icono ?? CheckCircleIcon
              return (
                <li key={h.id} className="flex gap-3">
                  <span className={cx('grid size-8 shrink-0 place-items-center rounded-control', TONO[h.tono ?? 'gris'])}>
                    <I size={15} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-tinta tabular-nums">{h.titulo}</p>
                    {h.detalle && <p className="text-xs text-texto-2 tabular-nums">{h.detalle}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

/* ── Lista agrupada por día ─────────────────────────────────────────────── */

export type DiaLista<T> = {
  id: string
  /** "Hoy · mié 18 nov". La fecha va una sola vez. */
  titulo: string
  /** "$ 1.284.000". */
  total?: ReactNode
  items: T[]
}

export type ListaPorDiaProps<T> = {
  dias: DiaLista<T>[]
  /** Cada fila dice solo la hora. */
  fila: (item: T) => ReactNode
  clave: (item: T) => string
  className?: string
}

/** Cabecera del día pegada al hacer scroll, con su conteo y su total. Ponela dentro de un Desvanecido. */
export function ListaPorDia<T>({ dias, fila, clave, className }: ListaPorDiaProps<T>) {
  return (
    <div className={className}>
      {dias.map((d) => (
        <section key={d.id} aria-label={d.titulo}>
          <div className={cx('sticky top-0 z-10 flex h-9 items-center gap-2 border-b border-divisor bg-panel/95 px-4 backdrop-blur-sm transition-colors', EASE)}>
            <span className="text-xs font-medium text-tinta">{d.titulo}</span>
            <span className="text-xs text-texto-3 tabular-nums">{d.items.length}</span>
            <span className="flex-1" />
            {d.total !== undefined && <span className="text-xs text-texto-2 tabular-nums">{d.total}</span>}
          </div>
          <ul className="divide-y divide-divisor">
            {d.items.map((it) => (
              <li key={clave(it)}>{fila(it)}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
