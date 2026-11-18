'use client'
/**
 * CrearTarea: alta mínima. Un título grande sin caja, una fila de propiedades como pastillas
 * (responsable, fecha, prioridad, proyecto) y Enter para crear. Patrón 14.6 · 12-flujos.html#crear-tarea-minimalista
 *
 * - El título es lo único obligatorio; el botón explica qué falta mientras está vacío.
 * - Las propiedades se eligen con el control que pase quien la usa (Combobox, CampoFecha…) dentro de `propiedades`.
 * - "Crear otra" deja el modal abierto y vacía el título (para cargar varias seguidas).
 * - Pista de teclado abajo: Enter crea, Esc cierra.
 *
 *   <CrearTarea abierto={ver} onCerrar={cerrar} onCrear={(t, otra) => guardar(t)}
 *     propiedades={<><PastillaProp icono={UserIcon} texto={resp ?? 'Responsable'} vacio={!resp} onClick={…} /></>} />
 */
import { useEffect, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from 'react'
import { XIcon, type Icon } from '@phosphor-icons/react'
import { Interruptor } from '../base/Interruptor'
import { BotonEspera, cx, FOCO } from './compartido'

export type CrearTareaProps = {
  abierto: boolean
  onCerrar: () => void
  /** `otra` = el usuario quiere seguir cargando. */
  onCrear: (titulo: string, descripcion: string, otra: boolean) => void | Promise<void>
  /** Pastillas de propiedades (usar PastillaProp). */
  propiedades?: ReactNode
  contexto?: string
}

export function CrearTarea({ abierto, onCerrar, onCrear, propiedades, contexto }: CrearTareaProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const tit = useRef<HTMLInputElement>(null)
  const [titulo, setTitulo] = useState('')
  const [desc, setDesc] = useState('')
  const [otra, setOtra] = useState(false)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) { d.showModal(); tit.current?.focus() }
    if (!abierto && d.open) d.close()
  }, [abierto])

  const crear = async () => {
    if (!titulo.trim()) return
    await onCrear(titulo.trim(), desc.trim(), otra)
    setTitulo(''); setDesc('')
    if (otra) tit.current?.focus()
    else onCerrar()
  }
  const enviar = (e: FormEvent) => { e.preventDefault(); void crear() }

  return (
    <dialog ref={ref} onClose={onCerrar} aria-label="Nueva tarea" className="m-auto w-[min(100%-24px,620px)] rounded-tarjeta border border-borde bg-superficie p-0 text-tinta shadow-flotante backdrop:bg-tinta/40">
      <form onSubmit={enviar}>
        <div className="flex items-center gap-2 px-6 pt-5 text-xs text-texto-3">
          {contexto && <span className="rounded-chip bg-suave px-2 py-0.5 text-texto-2">{contexto}</span>}
          <span>Nueva tarea</span>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className={cx('ml-auto grid size-8 place-items-center rounded-control hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}>
            <XIcon size={16} aria-hidden />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-8 pt-4 pb-5 max-md:px-6">
          <input
            ref={tit}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="¿Qué hay que hacer?"
            aria-label="Título de la tarea"
            autoComplete="off"
            className="min-h-11 w-full border-0 bg-transparent font-display text-2xl font-medium tracking-tight text-tinta outline-none placeholder:text-texto-3 max-md:text-xl"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Agregá detalles (opcional)"
            aria-label="Descripción"
            rows={2}
            className="w-full resize-none border-0 bg-transparent text-[13px] text-texto-2 outline-none placeholder:text-texto-3"
          />
          {propiedades && <div className="mt-2 flex flex-wrap gap-1.5">{propiedades}</div>}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-divisor px-6 py-4">
          <Interruptor rotulo="Crear otra" activo={otra} onCambio={setOtra} />
          <span className="text-xs text-texto-3 max-md:hidden"><kbd className="font-mono">Enter</kbd> crea · <kbd className="font-mono">Esc</kbd> cierra</span>
          <BotonEspera className="ml-auto" hacer={crear} textoEspera="Creando…" motivoBloqueo={titulo.trim() ? undefined : 'Escribí el título'}>Crear tarea</BotonEspera>
        </div>
      </form>
    </dialog>
  )
}

export type PastillaPropProps = Omit<ComponentProps<'button'>, 'children'> & { icono: Icon; texto: string; vacio?: boolean }

/** Propiedad de la tarea como pastilla de 28 px (44 en celular). Gris punteada mientras está vacía. */
export function PastillaProp({ icono: Ic, texto, vacio, className, ...resto }: PastillaPropProps) {
  return (
    <button
      type="button"
      {...resto}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-chip border px-2.5 text-xs transition-colors max-md:h-11',
        vacio ? 'border-dashed border-borde-fuerte text-texto-3 hover:text-tinta' : 'border-borde bg-superficie text-tinta hover:bg-hover',
        FOCO,
        className,
      )}
    >
      <Ic size={14} aria-hidden />{texto}
    </button>
  )
}
