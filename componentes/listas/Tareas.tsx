'use client'
/**
 * Tareas: FilaTarea, ListaTareas (pendientes + "Hechas" sin tachar), BloqueTareas (renglones de 34 px),
 * GruposUrgencia (Vencidas / Hoy / Mañana / Próximas) y CrearTareaRapida (@persona !prioridad fecha).
 * Galería viva: ejemplos/biblioteca/07-listas.html#lista-de-tareas
 */
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarBlankIcon, CheckIcon, KeyReturnIcon, UserIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'
import { CabeceraGrupo, EASE, plural } from './_lista'

export type PrioridadTarea = 'urgente' | 'alta' | 'media' | 'baja'

export type Tarea = {
  id: string
  titulo: string
  /** "OT-0142". Va en mono, gris. */
  codigo?: string
  prioridad?: PrioridadTarea
  /** Texto ya formateado: "vie 20 nov", "Hoy". */
  vence?: string
  vencida?: boolean
  responsable?: Persona
  hecha?: boolean
}

const BARRAS: Record<PrioridadTarea, number> = { urgente: 4, alta: 3, media: 2, baja: 1 }
const NOMBRE: Record<PrioridadTarea, string> = { urgente: 'Urgente', alta: 'Alta', media: 'Media', baja: 'Baja' }

/** Prioridad en barras (no en color): 1 a 4 barras de 3 px. */
export function BarrasPrioridad({ prioridad }: { prioridad: PrioridadTarea }) {
  const n = BARRAS[prioridad]
  return (
    <span role="img" aria-label={`Prioridad ${NOMBRE[prioridad].toLowerCase()}`} className="inline-flex h-3 items-end gap-[2px]">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={cx('w-[3px] rounded-[1px]', i <= n ? (prioridad === 'urgente' ? 'bg-rojo-texto' : 'bg-tinta') : 'bg-borde')} style={{ height: 3 + i * 2 }} />
      ))}
    </span>
  )
}

/** Casilla redonda de 16 px. */
export function CasillaTarea({ hecha, onCambio, rotulo }: { hecha: boolean; onCambio: (h: boolean) => void; rotulo: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={hecha}
      aria-label={rotulo}
      onClick={() => onCambio(!hecha)}
      className={cx(
        'grid size-4 shrink-0 place-items-center rounded-full border transition-[background,border-color,transform] duration-150 active:scale-90',
        EASE,
        hecha ? 'border-verde-texto bg-verde-texto text-white' : 'border-borde-fuerte bg-superficie hover:border-texto-2',
        FOCO,
      )}
    >
      {hecha && <CheckIcon size={10} weight="bold" />}
    </button>
  )
}

export type FilaTareaProps = {
  tarea: Tarea
  onHecha: (id: string, hecha: boolean) => void
  /** Clic en la prioridad: el padre abre su selector. */
  onPrioridad?: (id: string) => void
  onResponsable?: (id: string) => void
  /** Menú ⋯ u otra acción al final. */
  extra?: ReactNode
  /** Renglón compacto de 34 px (BloqueTareas). */
  compacta?: boolean
}

export function FilaTarea({ tarea: t, onHecha, onPrioridad, onResponsable, extra, compacta }: FilaTareaProps) {
  return (
    <li
      data-flip={t.id}
      className={cx('group/tarea flex items-center gap-3 px-4 transition-colors hover:bg-hover', compacta ? 'h-[34px]' : 'min-h-11 py-2', t.hecha && 'text-texto-3')}
    >
      <CasillaTarea hecha={!!t.hecha} onCambio={(h) => onHecha(t.id, h)} rotulo={`Marcar "${t.titulo}" como ${t.hecha ? 'pendiente' : 'hecha'}`} />
      <span className={cx('min-w-0 flex-1 truncate text-[13px]', t.hecha ? 'text-texto-3' : 'text-tinta')}>
        {t.titulo}
        {t.codigo && <span className="ml-2 font-mono text-xs text-texto-3">{t.codigo}</span>}
      </span>
      {!compacta && t.prioridad && (
        <button type="button" onClick={() => onPrioridad?.(t.id)} disabled={!onPrioridad} className={cx('grid h-8 w-8 place-items-center rounded-chip hover:bg-suave disabled:cursor-default', FOCO)}>
          <BarrasPrioridad prioridad={t.prioridad} />
        </button>
      )}
      {t.vence && (
        <span className={cx('hidden w-20 shrink-0 items-center gap-1 text-xs tabular-nums sm:inline-flex', t.vencida && !t.hecha ? 'text-rojo-texto' : 'text-texto-2')}>
          <CalendarBlankIcon size={13} aria-hidden />
          {t.vence}
        </span>
      )}
      {!compacta && (
        <button
          type="button"
          onClick={() => onResponsable?.(t.id)}
          disabled={!onResponsable}
          aria-label={t.responsable ? `Responsable: ${t.responsable.nombre}` : 'Asignar responsable'}
          className={cx('grid size-8 shrink-0 place-items-center rounded-full hover:bg-suave disabled:cursor-default', FOCO)}
        >
          {t.responsable ? <Avatar persona={t.responsable} tamano="sm" decorativo /> : <UserIcon size={15} className="text-texto-3" />}
        </button>
      )}
      {extra}
    </li>
  )
}

/* ── Lista con "Hechas" ─────────────────────────────────────────────────── */

export type ListaTareasProps = {
  tareas: Tarea[]
  onHecha: FilaTareaProps['onHecha']
  onPrioridad?: FilaTareaProps['onPrioridad']
  onResponsable?: FilaTareaProps['onResponsable']
  /** Hechas plegadas por defecto. */
  hechasAbiertas?: boolean
  className?: string
}

/** Lo hecho baja a "Hechas" sin tacharse. El Deshacer lo pone el toast del padre. */
export function ListaTareas({ tareas, onHecha, onPrioridad, onResponsable, hechasAbiertas = false, className }: ListaTareasProps) {
  const [abiertas, setAbiertas] = useState(hechasAbiertas)
  const pendientes = tareas.filter((t) => !t.hecha)
  const hechas = tareas.filter((t) => t.hecha)
  const props = { onHecha, onPrioridad, onResponsable }
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <ul className="divide-y divide-divisor">
        {pendientes.map((t) => (
          <FilaTarea key={t.id} tarea={t} {...props} />
        ))}
      </ul>
      {hechas.length > 0 && (
        <>
          <CabeceraGrupo titulo="Hechas" conteo={hechas.length} abierto={abiertas} onAlternar={() => setAbiertas((a) => !a)} className="border-t" />
          {abiertas && (
            <ul className="divide-y divide-divisor">
              {hechas.map((t) => (
                <FilaTarea key={t.id} tarea={t} {...props} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

/* ── Bloque de renglones ────────────────────────────────────────────────── */

export type BloqueTareasProps = {
  titulo: ReactNode
  tareas: Tarea[]
  onHecha: FilaTareaProps['onHecha']
  className?: string
}

/** Un bloque, renglones de 34 px; al tildar baja al fondo y el contador cambia en el mismo instante. */
export function BloqueTareas({ titulo, tareas, onHecha, className }: BloqueTareasProps) {
  const ordenadas = [...tareas.filter((t) => !t.hecha), ...tareas.filter((t) => t.hecha)]
  const n = tareas.filter((t) => !t.hecha).length
  return (
    <section className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <header className="flex h-10 items-center justify-between border-b border-divisor px-4">
        <h3 className="text-[13px] font-medium text-tinta">{titulo}</h3>
        <span aria-live="polite" className="text-xs text-texto-3 tabular-nums">
          {n === 0 ? 'Todo hecho' : plural(n, 'pendiente')}
        </span>
      </header>
      <ul className="divide-y divide-divisor">
        {ordenadas.map((t) => (
          <FilaTarea key={t.id} tarea={t} onHecha={onHecha} compacta />
        ))}
      </ul>
    </section>
  )
}

/* ── Agrupar por urgencia ───────────────────────────────────────────────── */

export type GrupoUrgencia = { id: 'vencidas' | 'hoy' | 'manana' | 'proximas' | (string & {}); titulo: string; tareas: Tarea[] }

export type GruposUrgenciaProps = {
  grupos: GrupoUrgencia[]
  onHecha: FilaTareaProps['onHecha']
  onCrear?: (grupo: string) => void
  className?: string
}

/**
 * Bandas plegables con conteo y "+". Lo tildado queda visible en gris hasta recargar: la fila no salta
 * mientras trabajás (el padre decide cuándo sacarla). El rojo vive solo en la fecha vencida.
 */
export function GruposUrgencia({ grupos, onHecha, onCrear, className }: GruposUrgenciaProps) {
  const [plegados, setPlegados] = useState<Set<string>>(new Set())
  const alternar = (id: string) =>
    setPlegados((p) => {
      const s = new Set(p)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      {grupos.map((g) => {
        const abierto = !plegados.has(g.id)
        return (
          <div key={g.id}>
            <CabeceraGrupo
              titulo={g.titulo}
              conteo={g.tareas.filter((t) => !t.hecha).length}
              abierto={abierto}
              onAlternar={() => alternar(g.id)}
              onCrear={onCrear ? () => onCrear(g.id) : undefined}
              textoCrear={`Crear tarea en ${g.titulo}`}
            />
            {abierto && (
              <ul className="divide-y divide-divisor border-b border-divisor last:border-b-0">
                {g.tareas.map((t) => (
                  <FilaTarea key={t.id} tarea={{ ...t, vencida: t.vencida ?? g.id === 'vencidas' }} onHecha={onHecha} />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Crear tarea rápida ─────────────────────────────────────────────────── */

export type TareaEntendida = { titulo: string; persona?: string; prioridad?: PrioridadTarea; fecha?: string }

const FECHAS = ['hoy', 'mañana', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

/** "Pedir vidrios @Joaquín !alta mañana" → { titulo, persona: 'Joaquín', prioridad: 'alta', fecha: 'mañana' }. */
export function entenderTarea(texto: string): TareaEntendida {
  let titulo = texto
  const persona = /@([\p{L}]+)/u.exec(texto)?.[1]
  const pr = /!(urgente|alta|media|baja)\b/i.exec(texto)?.[1]?.toLowerCase() as PrioridadTarea | undefined
  const fecha = FECHAS.find((f) => new RegExp(`(^|\\s)${f}(\\s|$)`, 'i').test(texto))
  if (persona) titulo = titulo.replace(`@${persona}`, '')
  if (pr) titulo = titulo.replace(new RegExp(`!${pr}`, 'i'), '')
  if (fecha) titulo = titulo.replace(new RegExp(`(^|\\s)${fecha}(?=\\s|$)`, 'i'), ' ')
  return { titulo: titulo.replace(/\s+/g, ' ').trim(), persona, prioridad: pr, fecha }
}

export type CrearTareaRapidaProps = {
  /** Etapa o grupo donde va a vivir: "En obra". */
  donde: string
  onCrear: (t: TareaEntendida) => void
  placeholder?: string
  className?: string
}

/** Una línea que entiende @persona, !prioridad y la fecha; muestra lo que entendió. Enter crea y deja el campo listo. */
export function CrearTareaRapida({ donde, onCrear, placeholder = 'Nueva tarea… @persona !prioridad mañana', className }: CrearTareaRapidaProps) {
  const [texto, setTexto] = useState('')
  const id = useId()
  const e = entenderTarea(texto)
  const fichas = [e.persona && `@${e.persona}`, e.prioridad && NOMBRE[e.prioridad], e.fecha].filter(Boolean) as string[]

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    if (!e.titulo) return
    onCrear(e)
    setTexto('')
  }
  return (
    <form onSubmit={enviar} className={cx('rounded-control border border-borde bg-superficie px-3 py-2 focus-within:border-acento/60', className)}>
      <label htmlFor={id} className="sr-only">
        Nueva tarea en {donde}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-8 min-w-0 flex-1 bg-transparent text-base text-tinta outline-none placeholder:text-texto-3 md:text-[13px]"
        />
        <kbd aria-hidden className="hidden items-center gap-1 rounded-[4px] border border-borde px-1.5 font-mono text-xs text-texto-3 sm:inline-flex">
          <KeyReturnIcon size={12} />
        </kbd>
      </div>
      {fichas.length > 0 && (
        <div aria-live="polite" className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-texto-2">
          <span className="sr-only">Entendí:</span>
          {fichas.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 rounded-chip bg-verde-fondo px-2 py-0.5 text-verde-texto">
              <CheckIcon size={11} weight="bold" aria-hidden />
              {f}
            </span>
          ))}
          <span className="text-texto-3">en {donde}</span>
        </div>
      )}
    </form>
  )
}
