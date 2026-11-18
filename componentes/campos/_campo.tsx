'use client'

// Piezas internas de campos/: envoltorio con rótulo, caja del campo, mensajes y teclado de grupos.
import { useEffect, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import { CheckCircle, Warning, WarningCircle } from '@phosphor-icons/react'
import { cx } from '../base/utilidades'

/** Estado visual del campo: neutro, error (frena), aviso (no frena) u ok (recién corregido). */
export type EstadoCampo = 'neutro' | 'error' | 'aviso' | 'ok'

/** Clases de la caja del campo (40 px; 52 px y letra 16 en celular). */
export function cajaCampo(estado: EstadoCampo = 'neutro', extra?: string | false) {
  return cx(
    'flex h-10 min-w-0 items-center gap-2 rounded-control border bg-superficie px-3 shadow-min max-sm:h-[52px]',
    'transition-[border-color,box-shadow] duration-150 ease-(--ease) motion-reduce:transition-none',
    estado === 'error' && 'border-rojo-texto shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-rojo-texto)_14%,transparent)]',
    estado === 'aviso' && 'border-ambar-texto shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-ambar-texto)_14%,transparent)]',
    estado === 'ok' && 'border-verde-texto/60',
    estado === 'neutro' &&
      'border-borde-fuerte hover:border-texto-3/60 focus-within:border-acento focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-acento)_18%,transparent)]',
    extra,
  )
}

/** Clases del input dentro de la caja. */
export const INPUT =
  'h-full min-w-0 flex-1 bg-transparent text-sm text-tinta outline-none placeholder:text-texto-3 disabled:cursor-not-allowed max-sm:text-base'

/** Mensaje bajo el campo. `accion` es la corrección como botón ("Usar sofia@orbe.com.ar"). */
export type Mensaje = { tipo: 'error' | 'aviso' | 'ok'; texto: ReactNode; accion?: { texto: string; alUsar: () => void } }

export function MensajeCampo({ id, mensaje }: { id: string; mensaje: Mensaje }) {
  const Icono = mensaje.tipo === 'error' ? WarningCircle : mensaje.tipo === 'aviso' ? Warning : CheckCircle
  return (
    <p
      id={id}
      className={cx(
        'flex flex-wrap items-center gap-1 text-xs leading-snug',
        mensaje.tipo === 'error' ? 'text-rojo-texto' : mensaje.tipo === 'aviso' ? 'text-ambar-texto' : 'text-verde-texto',
      )}
    >
      <Icono size={14} weight="fill" aria-hidden className="shrink-0" />
      {mensaje.texto}
      {mensaje.accion && (
        <button
          type="button"
          onClick={mensaje.accion.alUsar}
          className="ml-1 inline-flex h-6 items-center rounded-chip border border-borde bg-superficie px-2 text-xs font-medium text-tinta shadow-min hover:bg-hover max-sm:h-11"
        >
          {mensaje.accion.texto}
        </button>
      )}
    </p>
  )
}

export type EnvoltorioProps = {
  id: string
  rotulo: ReactNode
  /** Se marca lo opcional, nunca lo obligatorio. */
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  /** Algo a la derecha del rótulo: contador, "¿La olvidaste?". */
  extraRotulo?: ReactNode
  /** Si el control no es un input (grupo, botón), el rótulo va como texto con id `${id}-rotulo`. */
  rotuloComoTexto?: boolean
  className?: string
  children: ReactNode
}

/** Rótulo arriba a 6 px, campo, y debajo la ayuda o el mensaje (el mensaje reemplaza la ayuda). */
export function EnvoltorioCampo({ id, rotulo, opcional, ayuda, mensaje, extraRotulo, rotuloComoTexto, className, children }: EnvoltorioProps) {
  const R = rotuloComoTexto ? 'span' : 'label'
  return (
    <div className={cx('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex min-h-[18px] items-baseline justify-between gap-2">
        <R {...(rotuloComoTexto ? { id: `${id}-rotulo` } : { htmlFor: id })} className="text-[13px] font-medium text-texto-2">
          {rotulo}
          {opcional && <span className="font-normal text-xs text-texto-3"> · opcional</span>}
        </R>
        {extraRotulo}
      </div>
      {children}
      {mensaje ? <MensajeCampo id={`${id}-mensaje`} mensaje={mensaje} /> : ayuda ? <p id={`${id}-ayuda`} className="text-xs text-texto-3">{ayuda}</p> : null}
    </div>
  )
}

/** aria-describedby que corresponde según haya mensaje o ayuda. */
export function describedBy(id: string, mensaje?: Mensaje | null, ayuda?: ReactNode) {
  return mensaje ? `${id}-mensaje` : ayuda ? `${id}-ayuda` : undefined
}

/** Cierra algo al tocar afuera. */
export function useAfuera(ref: RefObject<HTMLElement | null>, abierto: boolean, cerrar: () => void) {
  useEffect(() => {
    if (!abierto) return
    const f = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cerrar() }
    document.addEventListener('pointerdown', f)
    return () => document.removeEventListener('pointerdown', f)
  }, [ref, abierto, cerrar])
}

/** Flechas en un grupo de radios: devuelve el índice nuevo o null si la tecla no es de flecha. */
export function flechaEnGrupo(e: KeyboardEvent, actual: number, total: number): number | null {
  const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key]
  if (!d || total === 0) return null
  e.preventDefault()
  return (actual + d + total) % total
}

/** Sin acentos y en minúscula, para buscar. */
export const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Marca la coincidencia dentro del texto (sin acentos). */
export function Coincidencia({ texto, busqueda }: { texto: string; busqueda: string }) {
  const i = busqueda ? sinAcentos(texto).indexOf(sinAcentos(busqueda)) : -1
  if (i < 0) return <>{texto}</>
  return (
    <>
      {texto.slice(0, i)}
      <mark className="bg-dato-4/35 text-inherit">{texto.slice(i, i + busqueda.length)}</mark>
      {texto.slice(i + busqueda.length)}
    </>
  )
}

/** Número es-AR: "1.250.000,50". */
export const numeroAR = (n: number, dec = 0) =>
  new Intl.NumberFormat('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n).replace('-', '−')
