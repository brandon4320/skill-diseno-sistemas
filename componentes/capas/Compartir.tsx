'use client'
/**
 * Compartir: link copiable, a quién llega el link y la lista de personas con su permiso.
 * Va dentro de un modal o una hoja; no trae su propio contenedor flotante.
 *
 * - Link en mono sobre bandeja; "Copiar link" pasa a "Copiado" 2 s sin cambiar de ancho.
 * - Alcance del link dicho en una línea ("Lo abre cualquiera del estudio con el link").
 * - Invitar por correo arriba; cada persona con avatar de iniciales, nombre, correo y un select
 *   de permiso (Puede ver / Puede comentar / Puede editar / Quitar acceso). El dueño no se toca.
 *
 *   <Compartir link="faro.app/d/propuesta-7Kq2" alcance="Lo abre cualquiera del estudio con el link."
 *     miembros={miembros} onPermiso={(id, p) => …} onInvitar={(correo) => …} />
 */
import { useEffect, useId, useState, type FormEvent } from 'react'
import { CheckIcon, CopyIcon, LinkIcon } from '@phosphor-icons/react'
import { cn, FOCO } from './compartido'

export type Permiso = 'ver' | 'comentar' | 'editar'

export type Miembro = {
  id: string
  nombre: string
  correo: string
  permiso: Permiso | 'duenio'
  /** var(--color-dato-1)… para el avatar. */
  color?: string
}

export type CompartirProps = {
  link: string
  alcance: string
  miembros: Miembro[]
  onPermiso: (id: string, permiso: Permiso | null) => void
  onInvitar?: (correo: string) => void
}

const TEXTO_PERMISO: Record<Permiso, string> = { ver: 'Puede ver', comentar: 'Puede comentar', editar: 'Puede editar' }
const iniciales = (n: string) =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase()

export function Compartir({ link, alcance, miembros, onPermiso, onInvitar }: CompartirProps) {
  const [copiado, setCopiado] = useState(false)
  const [correo, setCorreo] = useState('')
  const id = useId()
  useEffect(() => {
    if (!copiado) return
    const t = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(t)
  }, [copiado])

  const copiar = () => {
    void navigator.clipboard?.writeText(link.startsWith('http') ? link : `https://${link}`).catch(() => {})
    setCopiado(true)
  }
  const invitar = (e: FormEvent) => {
    e.preventDefault()
    const c = correo.trim()
    if (!c || !onInvitar) return
    onInvitar(c)
    setCorreo('')
  }

  const CAMPO = 'flex h-10 items-center gap-2 rounded-control border border-borde-fuerte px-3 max-md:h-11'
  const BTN = 'inline-flex h-10 items-center justify-center gap-1.5 rounded-control border border-borde bg-superficie px-3 text-[13px] font-medium text-tinta shadow-min hover:bg-hover max-md:h-11'

  return (
    <div className="grid gap-4 text-[13px]">
      {onInvitar && (
        <form onSubmit={invitar} className="flex gap-2 max-md:flex-col">
          <label className={cn(CAMPO, 'min-w-0 flex-1 bg-superficie focus-within:border-acento')}>
            <span className="sr-only">Correo para invitar</span>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="nombre@empresa.com" autoComplete="email" className="h-full min-w-0 flex-1 bg-transparent text-sm text-tinta outline-none placeholder:text-texto-3" />
          </label>
          <button type="submit" className={cn(BTN, 'border-tinta bg-tinta text-superficie hover:bg-tinta', FOCO)}>
            Invitar
          </button>
        </form>
      )}

      <section className="grid gap-2 rounded-interno bg-suave p-3.5" aria-labelledby={`${id}-l`}>
        <span id={`${id}-l`} className="text-xs font-medium text-texto-2">Link</span>
        <div className="flex gap-2 max-md:flex-col">
          <div className={cn(CAMPO, 'min-w-0 flex-1 bg-suave')}>
            <LinkIcon size={15} className="flex-none text-texto-3" aria-hidden />
            <input readOnly value={link} aria-label="Link del archivo" onFocus={(e) => e.currentTarget.select()} className="h-full min-w-0 flex-1 bg-transparent font-mono text-xs text-texto-2 outline-none" />
          </div>
          <button type="button" onClick={copiar} className={cn(BTN, 'grid min-w-[128px]', FOCO)}>
            <span className={cn('col-start-1 row-start-1 inline-flex items-center gap-1.5', copiado && 'invisible')}>
              <CopyIcon size={15} aria-hidden />
              Copiar link
            </span>
            <span className={cn('col-start-1 row-start-1 inline-flex items-center gap-1.5 text-verde-texto', !copiado && 'invisible')} aria-live="polite">
              <CheckIcon size={15} weight="bold" aria-hidden />
              {copiado ? 'Copiado' : ''}
            </span>
          </button>
        </div>
        <small className="text-xs text-texto-2">{alcance}</small>
      </section>

      <section className="grid gap-1" aria-label="Personas con acceso">
        {miembros.map((m) => (
          <div key={m.id} className="flex min-h-11 items-center gap-3">
            <span
              aria-hidden
              className="grid size-7 flex-none place-items-center rounded-full text-[11px] font-medium text-white"
              style={{ background: `color-mix(in oklch, ${m.color ?? 'var(--color-dato-1)'} 64%, #000)` }}
            >
              {iniciales(m.nombre)}
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate font-medium text-tinta">{m.nombre}</b>
              <small className="block truncate text-xs text-texto-2">{m.correo}</small>
            </span>
            {m.permiso === 'duenio' ? (
              <span className="px-2 text-xs text-texto-2">Dueño</span>
            ) : (
              <select
                aria-label={`Permiso de ${m.nombre}`}
                value={m.permiso}
                onChange={(e) => onPermiso(m.id, e.target.value === 'quitar' ? null : (e.target.value as Permiso))}
                className={cn('h-8 rounded-control border border-borde bg-superficie px-2 text-xs text-tinta max-md:h-11', FOCO)}
              >
                {(Object.keys(TEXTO_PERMISO) as Permiso[]).map((p) => (
                  <option key={p} value={p}>
                    {TEXTO_PERMISO[p]}
                  </option>
                ))}
                <option value="quitar">Quitar acceso</option>
              </select>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
