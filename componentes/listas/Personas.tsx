'use client'
/**
 * Personas y conexiones (ajustes): FilaPersona (rol que se cambia en el lugar con su explicación,
 * agentes con su estado, invitación que dice cuándo vence) y FilaConexion (logo, estado con cifra,
 * apagada al 50 %; si pide intervención, el interruptor se vuelve el botón que la arregla).
 * Galería viva: ejemplos/biblioteca/07-listas.html#lista-de-personas
 */
import { useId, type ReactNode } from 'react'
import { RobotIcon, WarningIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { Interruptor } from '../base/Interruptor'
import { cx, FOCO, TONOS, type Tono } from '../base/utilidades'

export type Rol = { id: string; nombre: string; explicacion: string }

export type Miembro = {
  persona: Persona
  correo: string
  rol: string
  /** "hace 2 h", "Nunca entró". */
  actividad?: string
  /** Agente: con su estado. */
  agente?: { estado: string; tono: Tono }
  /** Invitación pendiente: "vence en 5 días". */
  invitacion?: string
}

export type FilaPersonaProps = {
  miembro: Miembro
  roles: Rol[]
  onRol?: (rol: string) => void
  /** Menú ⋯ (Menu de base/). */
  menu?: ReactNode
  /** El dueño no puede cambiarse su propio rol. */
  bloqueado?: boolean
}

export function FilaPersona({ miembro: m, roles, onRol, menu, bloqueado }: FilaPersonaProps) {
  const id = useId()
  const rol = roles.find((r) => r.id === m.rol)
  return (
    <div className={cx('flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap', m.invitacion && 'bg-panel')}>
      {m.agente ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-acento-suave text-acento">
          <RobotIcon size={16} aria-hidden />
        </span>
      ) : (
        <Avatar persona={m.persona} tamano="md" decorativo />
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-[13px] font-medium text-tinta">
          {m.persona.nombre}
          {m.agente && (
            <span className={cx('inline-flex items-center gap-1 rounded-chip px-1.5 text-xs font-normal', TONOS[m.agente.tono].fondo, TONOS[m.agente.tono].texto)}>
              <span aria-hidden className={cx('size-1.5 rounded-full', TONOS[m.agente.tono].punto)} />
              {m.agente.estado}
            </span>
          )}
        </p>
        <p className="truncate text-xs text-texto-3">{m.invitacion ? `${m.correo} · Invitación pendiente, ${m.invitacion}` : m.correo}</p>
      </div>
      <div className="w-full sm:w-44">
        <label htmlFor={id} className="sr-only">
          Rol de {m.persona.nombre}
        </label>
        <select
          id={id}
          value={m.rol}
          disabled={bloqueado || !onRol}
          onChange={(e) => onRol?.(e.target.value)}
          aria-describedby={`${id}-ayuda`}
          className={cx('h-8 w-full rounded-control border border-borde bg-superficie px-2 text-base text-tinta disabled:opacity-60 md:text-[13px]', FOCO)}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
        <p id={`${id}-ayuda`} className="mt-0.5 truncate text-xs text-texto-3">
          {rol?.explicacion}
        </p>
      </div>
      {m.actividad && <span className="hidden w-24 shrink-0 text-right text-xs text-texto-3 md:block">{m.actividad}</span>}
      {menu}
    </div>
  )
}

/* ── Conexiones ─────────────────────────────────────────────────────────── */

export type Conexion = {
  id: string
  nombre: string
  /** Logo del servicio, en cuadro blanco. */
  logo: ReactNode
  /** "3/4 herramientas", "Sincronizado hace 5 min". */
  estado: string
  activa: boolean
  /** Si pide intervención: el texto del botón que la arregla ("Reconectar"). */
  arreglar?: { texto: string; causa: string }
}

export type FilaConexionProps = {
  conexion: Conexion
  onActiva: (activa: boolean) => void
  onArreglar?: () => void
}

export function FilaConexion({ conexion: c, onActiva, onArreglar }: FilaConexionProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={cx('flex min-w-0 flex-1 items-center gap-3 transition-opacity', !c.activa && !c.arreglar && 'opacity-50')}>
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-control border border-borde bg-white">{c.logo}</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-tinta">{c.nombre}</p>
          <p className={cx('flex items-center gap-1 truncate text-xs tabular-nums', c.arreglar ? 'text-ambar-texto' : 'text-texto-3')}>
            {c.arreglar && <WarningIcon size={12} aria-hidden />}
            {c.arreglar ? c.arreglar.causa : c.estado}
          </p>
        </div>
      </div>
      {c.arreglar ? (
        <button
          type="button"
          onClick={onArreglar}
          className={cx('inline-flex h-8 shrink-0 items-center rounded-chip bg-acento px-3 text-xs font-medium text-white hover:brightness-110 md:h-7', FOCO)}
        >
          {c.arreglar.texto}
        </button>
      ) : (
        <Interruptor aria-label={`${c.activa ? 'Apagar' : 'Prender'} ${c.nombre}`} activo={c.activa} onCambio={onActiva} />
      )}
    </div>
  )
}
