'use client'
/**
 * Conversación: mensaje de la persona (burbuja suave a la derecha), respuesta del asistente
 * (texto a todo el ancho, sin burbuja, con acciones al pasar), razonamiento plegable
 * ("3 herramientas usadas · 2,1 s") y sugerencias para seguir.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#conversacion
 */
import { useId, useState, type ReactNode } from 'react'
import {
  ArrowClockwiseIcon,
  CaretRightIcon,
  CheckIcon,
  CircleNotchIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  type Icon,
} from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/* ── Mensaje de la persona ─────────────────────────────────────────────── */

export function MensajeUsuario({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        'max-w-[78%] self-end rounded-[16px_16px_4px_16px] bg-suave px-3 py-2.5 text-[13px] leading-[1.55] break-words whitespace-pre-wrap text-tinta max-md:max-w-[88%]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ── Respuesta del asistente ───────────────────────────────────────────── */

export type Valoracion = 'bien' | 'mal' | null

export type MensajeAsistenteProps = {
  children: ReactNode
  /** Razonamiento, objetos o sugerencias que van debajo del texto. */
  extra?: ReactNode
  hora?: string
  /** Texto plano para Copiar. */
  textoPlano?: string
  onReintentar?: () => void
  onValorar?: (v: Valoracion) => void
  /** Mientras escribe: punto que late y sin acciones. */
  escribiendo?: boolean
  className?: string
}

function AccionChica({ icono: Ico, etiqueta, on, onClick }: { icono: Icon; etiqueta: string; on?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      aria-pressed={on}
      onClick={onClick}
      className={cx(
        'grid size-7 place-items-center rounded-chip hover:bg-hover hover:text-tinta max-md:size-11',
        on ? 'text-acento' : 'text-texto-3',
        FOCO,
      )}
    >
      <Ico size={14} weight={on ? 'fill' : 'regular'} aria-hidden />
    </button>
  )
}

export function MensajeAsistente({
  children,
  extra,
  hora,
  textoPlano,
  onReintentar,
  onValorar,
  escribiendo = false,
  className,
}: MensajeAsistenteProps) {
  const [copiado, setCopiado] = useState(false)
  const [valor, setValor] = useState<Valoracion>(null)

  const copiar = async () => {
    if (!textoPlano) return
    try {
      await navigator.clipboard.writeText(textoPlano)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch {
      /* sin permiso de portapapeles: no hace nada */
    }
  }
  const valorar = (v: Exclude<Valoracion, null>) => {
    const nuevo = valor === v ? null : v
    setValor(nuevo)
    onValorar?.(nuevo)
  }

  return (
    <div className={cx('group flex min-w-0 flex-col gap-3', className)} aria-busy={escribiendo}>
      <div className="text-[13px] leading-[21px] text-tinta tabular-nums [&_b]:font-semibold [&_p+p]:mt-2 [&_ul]:mt-1.5 [&_ul]:ml-[18px] [&_ul]:list-disc">
        {children}
        {escribiendo && <span aria-label="Escribiendo" className="ml-1 inline-block size-2 animate-pulse rounded-full bg-texto-3 align-middle motion-reduce:animate-none" />}
      </div>
      {extra}
      {!escribiendo && (
        <div className="flex items-center gap-0.5 text-texto-3 md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          {hora && <span className="mr-auto text-xs">{hora}</span>}
          {textoPlano && <AccionChica icono={copiado ? CheckIcon : CopyIcon} etiqueta={copiado ? 'Copiado' : 'Copiar respuesta'} onClick={copiar} />}
          {onReintentar && <AccionChica icono={ArrowClockwiseIcon} etiqueta="Rehacer respuesta" onClick={onReintentar} />}
          {onValorar && (
            <>
              <AccionChica icono={ThumbsUpIcon} etiqueta="Buena respuesta" on={valor === 'bien'} onClick={() => valorar('bien')} />
              <AccionChica icono={ThumbsDownIcon} etiqueta="Mala respuesta" on={valor === 'mal'} onClick={() => valorar('mal')} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Razonamiento plegable ─────────────────────────────────────────────── */

export type PasoHerramienta = {
  id: string
  /** En verbo: "Buscó facturas vencidas de Grupo Atlas". */
  texto: ReactNode
  /** Resultado corto o nombre técnico, en mono gris: "4 resultados", "facturas.buscar". */
  detalle?: string
  estado?: 'hecho' | 'corriendo'
}

export type RazonamientoPlegableProps = {
  pasos: PasoHerramienta[]
  /** "2,1 s". */
  duracion?: string
  abiertoPorDefecto?: boolean
  className?: string
}

export function RazonamientoPlegable({ pasos, duracion, abiertoPorDefecto = false, className }: RazonamientoPlegableProps) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto)
  const id = useId()
  const corriendo = pasos.some((p) => p.estado === 'corriendo')
  const n = pasos.length
  const titulo = corriendo ? 'Buscando…' : `${n} ${n === 1 ? 'herramienta usada' : 'herramientas usadas'}${duracion ? ` · ${duracion}` : ''}`

  return (
    <div className={cx('flex flex-col', className)}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((a) => !a)}
        className={cx(
          '-ml-1 inline-flex h-[26px] items-center gap-1.5 self-start rounded-[7px] pr-1.5 pl-1 text-xs font-medium text-texto-3 tabular-nums hover:bg-hover hover:text-tinta max-md:min-h-11',
          FOCO,
        )}
      >
        {corriendo ? (
          <CircleNotchIcon size={13} className="animate-spin motion-reduce:animate-none" aria-hidden />
        ) : (
          <CaretRightIcon size={13} aria-hidden className={cx('transition-transform duration-200', abierto && 'rotate-90')} />
        )}
        {titulo}
      </button>
      <ol
        id={id}
        hidden={!abierto}
        className="mt-1 ml-[7px] flex flex-col gap-2 border-l border-divisor py-1 pl-4"
      >
        {pasos.map((p) => (
          <li key={p.id} className="flex min-w-0 items-baseline gap-2 text-xs text-texto-2">
            {p.estado === 'corriendo' ? (
              <CircleNotchIcon size={11} className="shrink-0 translate-y-px animate-spin text-texto-3 motion-reduce:animate-none" aria-label="En curso" />
            ) : (
              <CheckIcon size={11} weight="bold" className="shrink-0 translate-y-px text-verde-texto" aria-label="Hecho" />
            )}
            <span className="min-w-0">{p.texto}</span>
            {p.detalle && <span className="ml-auto shrink-0 font-mono text-[11px] text-texto-3">{p.detalle}</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── Sugerencias para seguir ───────────────────────────────────────────── */

export type Sugerencia = { id: string; texto: string; icono?: Icon }

export function Sugerencias({ items, onElegir, className }: { items: Sugerencia[]; onElegir: (s: Sugerencia) => void; className?: string }) {
  return (
    <div role="group" aria-label="Sugerencias" className={cx('flex flex-wrap gap-2', className)}>
      {items.map((s) => {
        const Ico = s.icono
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onElegir(s)}
            className={cx(
              'inline-flex h-8 items-center gap-2 rounded-[10px] border border-borde bg-superficie px-3 text-xs font-medium text-texto-2 transition hover:bg-hover hover:text-tinta active:scale-[.97] max-md:h-11',
              FOCO,
            )}
          >
            {Ico && <Ico size={14} className="text-texto-3" aria-hidden />}
            {s.texto}
          </button>
        )
      })}
    </div>
  )
}
