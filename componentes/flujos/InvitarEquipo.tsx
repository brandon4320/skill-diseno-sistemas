'use client'
/**
 * InvitarEquipo: correos como fichas dentro de una caja (Enter, coma o pegar una lista), rol para todos
 * y enlace para copiar. Patrón 14.8 · 12-flujos.html#invitar-al-equipo
 *
 * - Cada correo se valida al convertirse en ficha; los mal escritos quedan en rojo con su motivo y se editan con un clic.
 * - Backspace con la caja vacía saca la última ficha.
 * - El botón dice cuántas invitaciones salen ("Invitar a 3") y se apaga si hay alguna mal escrita.
 *
 *   <InvitarEquipo roles={[{ valor: 'editor', texto: 'Puede editar' }, …]} enlace="https://…/unirse/k7Q2"
 *     onInvitar={(correos, rol) => api.invitar(correos, rol)} />
 */
import { useId, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { CheckIcon, LinkIcon, XIcon } from '@phosphor-icons/react'
import { BotonEspera, cx, FOCO, plural } from './compartido'

export type RolInvitacion<V extends string> = { valor: V; texto: string }

export type InvitarEquipoProps<V extends string> = {
  roles: RolInvitacion<V>[]
  rolInicial?: V
  /** Enlace para compartir; si falta, no se muestra. */
  enlace?: string
  /** Correos que ya están en el equipo: se marcan y no se invitan. */
  existentes?: string[]
  onInvitar: (correos: string[], rol: V) => void | Promise<void>
}

const VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function InvitarEquipo<V extends string>({ roles, rolInicial, enlace, existentes = [], onInvitar }: InvitarEquipoProps<V>) {
  const id = useId()
  const [correos, setCorreos] = useState<string[]>([])
  const [texto, setTexto] = useState('')
  const [rol, setRol] = useState<V>(rolInicial ?? roles[0].valor)
  const [copiado, setCopiado] = useState(false)

  const motivo = (c: string) => (!VALIDO.test(c) ? 'Revisá cómo está escrito' : existentes.includes(c) ? 'Ya está en el equipo' : correos.indexOf(c) !== correos.lastIndexOf(c) ? 'Repetido' : null)
  const sumar = (crudo: string) => {
    const nuevos = crudo.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)
    if (nuevos.length) setCorreos((a) => [...a, ...nuevos])
    setTexto('')
  }
  const tecla = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && texto.trim()) { e.preventDefault(); sumar(texto) }
    if (e.key === 'Backspace' && !texto && correos.length) setCorreos((a) => a.slice(0, -1))
  }
  const pegar = (e: ClipboardEvent<HTMLInputElement>) => {
    const t = e.clipboardData.getData('text')
    if (/[\s,;]/.test(t.trim())) { e.preventDefault(); sumar(t) }
  }
  const editar = (i: number) => { setTexto(correos[i]); setCorreos((a) => a.filter((_, k) => k !== i)) }
  const copiar = async () => {
    if (!enlace) return
    try { await navigator.clipboard.writeText(enlace) } catch { /* sin permiso: el enlace queda visible */ }
    setCopiado(true); setTimeout(() => setCopiado(false), 1600)
  }

  const malos = correos.filter((c) => motivo(c))
  const buenos = correos.filter((c) => !motivo(c))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-in`} className="text-[13px] font-medium">Correos</label>
        <div className="flex min-h-11 cursor-text flex-wrap items-center gap-1.5 rounded-control border border-borde bg-superficie px-2.5 py-1.5 focus-within:border-acento focus-within:ring-[3px] focus-within:ring-acento/15" onClick={() => document.getElementById(`${id}-in`)?.focus()}>
          {correos.map((c, i) => {
            const m = motivo(c)
            return (
              <span key={`${c}-${i}`} title={m ?? undefined} className={cx('inline-flex h-7 items-center gap-1 rounded-chip pl-2 text-xs', m ? 'bg-rojo-fondo text-rojo-texto' : 'bg-suave text-tinta')}>
                <button type="button" onClick={() => editar(i)} className={cx('max-w-[220px] truncate', FOCO)} aria-label={`${c}${m ? `: ${m}` : ''}. Editar`}>{c}</button>
                <button type="button" onClick={() => setCorreos((a) => a.filter((_, k) => k !== i))} aria-label={`Sacar ${c}`} className={cx('grid size-7 place-items-center rounded-chip hover:bg-tinta/10 max-md:size-11', FOCO)}>
                  <XIcon size={12} aria-hidden />
                </button>
              </span>
            )
          })}
          <input id={`${id}-in`} value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={tecla} onPaste={pegar} onBlur={() => texto.trim() && sumar(texto)} placeholder={correos.length ? '' : 'nombre@empresa.com y Enter'} inputMode="email" autoComplete="off" aria-describedby={`${id}-ay`} className="h-7 min-w-[160px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-texto-3 max-md:h-11 max-md:text-base" />
        </div>
        <span id={`${id}-ay`} aria-live="polite" className={cx('text-xs', malos.length ? 'text-rojo-texto' : 'text-texto-3')}>
          {malos.length ? `${plural(malos.length, 'correo para revisar', 'correos para revisar')}: tocalo para editarlo` : 'Separá con coma o pegá una lista'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[13px] text-texto-2">
          Rol
          <select value={rol} onChange={(e) => setRol(e.target.value as V)} className={cx('h-9 rounded-control border border-borde bg-superficie px-2.5 text-[13px] text-tinta max-md:h-11', FOCO)}>
            {roles.map((r) => <option key={r.valor} value={r.valor}>{r.texto}</option>)}
          </select>
        </label>
        <BotonEspera className="ml-auto" hacer={() => onInvitar(buenos, rol)} textoEspera="Invitando…" motivoBloqueo={!buenos.length ? 'Sumá al menos un correo' : malos.length ? 'Corregí los correos marcados' : undefined}>
          {buenos.length > 1 ? `Invitar a ${buenos.length}` : 'Invitar'}
        </BotonEspera>
      </div>

      {enlace && (
        <div className="flex items-center gap-3 rounded-control border border-borde bg-panel px-3 py-2 text-[13px]">
          <LinkIcon size={16} className="shrink-0 text-texto-3" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-texto-2">{enlace}</span>
          <button type="button" onClick={copiar} className={cx('inline-flex min-h-9 items-center gap-1.5 rounded-control px-2 text-texto-2 hover:bg-suave hover:text-tinta max-md:min-h-11', FOCO)} aria-live="polite">
            {copiado ? <><CheckIcon size={14} className="text-verde-texto" aria-hidden />Copiado</> : 'Copiar enlace'}
          </button>
        </div>
      )}
    </div>
  )
}
